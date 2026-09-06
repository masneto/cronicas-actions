import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type AuditResult = {
  metadata?: { vulnerabilities?: Record<string, number> };
  vulnerabilities?: Record<string, {
    severity?: string;
    via?: Array<{ title?: string; range?: string; url?: string } | string>;
    fixAvailable?: { name?: string; version?: string; isSemVerMajor?: boolean } | boolean;
  }>;
};

type Vulnerability = NonNullable<NonNullable<AuditResult['vulnerabilities']>[string]>;

function advisoryDetails(vulnerability: Vulnerability): Array<{ title: string; range: string; url: string }> {
  return (vulnerability.via || []).map((detail) => {
    if (typeof detail === 'string') return { title: detail, range: '?', url: '' };
    return {
      title: detail.title || 'sem detalhes',
      range: detail.range || '?',
      url: detail.url || '',
    };
  });
}

function fixVersion(vulnerability: Vulnerability): string {
  if (vulnerability.fixAvailable === false) return 'nao disponivel';
  if (typeof vulnerability.fixAvailable === 'object') {
    return vulnerability.fixAvailable.version || 'disponivel';
  }
  return vulnerability.fixAvailable ? 'disponivel' : 'nao informado';
}

function vulnerabilityCount(audit: AuditResult): number {
  const vulnerabilities = audit.metadata?.vulnerabilities || {};
  return ['moderate', 'high', 'critical'].reduce(
    (total, severity) => total + (vulnerabilities[severity] || 0),
    0
  );
}

function fixedPackageChanges(before: AuditResult, after: AuditResult, beforeFile: string, afterFile: string): string[] {
  const beforeLock = JSON.parse(fs.readFileSync(beforeFile, 'utf8')).packages || {};
  const afterLock = JSON.parse(fs.readFileSync(afterFile, 'utf8')).packages || {};
  const afterVulnerabilities = after.vulnerabilities || {};

  return Object.keys(before.vulnerabilities || {})
    .filter((name) => !afterVulnerabilities[name])
    .sort()
    .map((name) => {
      const paths = Object.keys(beforeLock).filter((packagePath) =>
        packagePath === `node_modules/${name}` || packagePath.endsWith(`/node_modules/${name}`));
      const packagePath = paths[0];
      const oldVersion = packagePath ? beforeLock[packagePath]?.version : undefined;
      const newPath = Object.keys(afterLock).find((candidate) =>
        candidate === `node_modules/${name}` || candidate.endsWith(`/node_modules/${name}`));
      const newVersion = newPath ? afterLock[newPath]?.version : undefined;
      return `- \`${name}\`: \`${oldVersion || 'não informado'}\` -> \`${newVersion || 'corrigido'}\``;
    });
}

function changelogEntries(audit: AuditResult, label: string): string[] {
  return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
    const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?' };
    const fix = fixVersion(vulnerability);
    return `- **${label}:** ${name} \`${detail.range}\` → \`${fix}\` — _${detail.title}_ (${vulnerability.severity || 'unknown'})`;
  });
}

const CHANGELOG_TITLE = '# Security Fixes Changelog';
const CHANGELOG_INTRO = '_Gerado automaticamente pelo workflow de segurança._';
const PIPELINE_PREFIX = '- Pipeline: ';

function parseSections(content: string): Array<{ header: string; body: string[] }> {
  const sections: Array<{ header: string; body: string[] }> = [];
  let current: { header: string; body: string[] } | null = null;
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (/^##\s+/.test(line)) {
      current = { header: line, body: [] };
      sections.push(current);
    } else if (current && line) {
      current.body.push(line);
    }
  }
  return sections;
}

function updateChangelog(changelogFile: string, entries: string[]): void {
  const date = new Date().toISOString().slice(0, 10);
  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const repository = process.env.GITHUB_REPOSITORY || '';
  const runId = process.env.GITHUB_RUN_ID || '';
  const pipelineLine = `${PIPELINE_PREFIX}${serverUrl}/${repository}/actions/runs/${runId}`;
  const header = `## ${date}`;
  const preamble = `${CHANGELOG_TITLE}\n\n${CHANGELOG_INTRO}`;

  const existing = fs.existsSync(changelogFile) ? fs.readFileSync(changelogFile, 'utf8') : '';
  const sections = parseSections(existing);

  const runEntries = entries.map((entry) => entry.trim()).filter(Boolean);
  const newSection = [header, '', ...runEntries, pipelineLine];

  const blocks = [newSection.join('\n')];
  for (const section of sections) {
    blocks.push('', [section.header, '', ...section.body].join('\n'));
  }

  fs.writeFileSync(changelogFile, `${preamble}\n\n${blocks.join('\n')}\n`);
}

async function runCommand(command: string, args: string[], cwd: string, outputFile?: string): Promise<number> {
  let output = '';
  const exitCode = await exec(command, args, {
    cwd,
    ignoreReturnCode: true,
    silent: true,
    listeners: {
      stdout: (data: Buffer) => { output += data.toString(); }
    }
  });
  if (outputFile) fs.writeFileSync(outputFile, output || '{}');
  return exitCode;
}

async function applyFallbacks(auditFile: string, cwd: string): Promise<boolean> {
  let applied = false;
  const audit = JSON.parse(fs.readFileSync(auditFile, 'utf8')) as AuditResult;
  const fixes = [...new Set(Object.values(audit.vulnerabilities || {})
    .map((vulnerability) => vulnerability.fixAvailable)
    .filter((fix): fix is { name: string; version: string } =>
      typeof fix === 'object' && Boolean(fix?.name) && Boolean(fix?.version))
    .map((fix) => `${fix.name}@${fix.version}`))];

  for (const fix of fixes) {
    await runCommand('npm', ['install', '--package-lock-only', '--force', '--ignore-scripts', '--no-audit', '--no-save', fix], cwd);
    applied = true;
  }

  const refreshedAudit = path.join(os.tmpdir(), `${path.basename(auditFile)}-fallback.json`);
  await runCommand('npm', ['audit', '--json'], cwd, refreshedAudit);
  const remaining = JSON.parse(fs.readFileSync(refreshedAudit, 'utf8')) as AuditResult;
  const overrideFixes = Object.values(remaining.vulnerabilities || {})
    .map((vulnerability) => vulnerability.fixAvailable)
    .filter((fix): fix is { name: string; version: string } =>
      typeof fix === 'object' && Boolean(fix?.name) && Boolean(fix?.version));

  if (overrideFixes.length === 0) {
    fs.rmSync(refreshedAudit, { force: true });
    return applied;
  }

  const packageFile = path.join(cwd, 'package.json');
  const backup = fs.readFileSync(packageFile, 'utf8');
  try {
    const packageJson = JSON.parse(backup) as { overrides?: Record<string, string> };
    const overrides = { ...(packageJson.overrides || {}) };
    for (const fix of overrideFixes) overrides[fix.name] = fix.version;
    packageJson.overrides = overrides;
    fs.writeFileSync(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
    await runCommand('npm', ['install', '--package-lock-only', '--force', '--ignore-scripts', '--no-audit'], cwd);
    applied = true;
  } finally {
    fs.writeFileSync(packageFile, backup);
    fs.rmSync(refreshedAudit, { force: true });
  }
  return applied;
}

export async function run(): Promise<void> {
  try {
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

    if (core.getBooleanInput('changelog-only')) {
      const changelogFile = core.getInput('changelog-file') || 'SECURITY_FIXES.md';
      const changelogEntriesInput = core.getInput('changelog-entries') || '';
      const entries = changelogEntriesInput.split('\n').map((line) => line.trim()).filter(Boolean);
      const hasVulnerabilities = entries.some((entry) => !entry.includes('sem vulnerabilidades'));
      if (!hasVulnerabilities) {
        core.info('Sem vulnerabilidades: changelog nao atualizado.');
        return;
      }
      const changelogPath = path.resolve(workspace, changelogFile);
      updateChangelog(changelogPath, entries);
      core.info(`Changelog atualizado em ${changelogPath}.`);
      return;
    }

    const workingDirectory = core.getInput('working-directory') || '.';
    const label = core.getInput('package-label') || workingDirectory;
    core.debug(`Auditando ${label} em ${workingDirectory}`);
    const cwd = path.resolve(workspace, workingDirectory);
    const safeLabel = label.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const beforeLock = path.join(os.tmpdir(), `${safeLabel}-package-lock-before.json`);
    const beforeAudit = path.join(os.tmpdir(), `${safeLabel}-audit-before.json`);
    const afterFixAudit = path.join(os.tmpdir(), `${safeLabel}-audit-after-fix.json`);
    const afterExplicitAudit = path.join(os.tmpdir(), `${safeLabel}-audit-after-explicit.json`);
    const afterLock = path.join(cwd, 'package-lock.json');
    const lockfilePath = workingDirectory === '.' ? 'package-lock.json' : `${workingDirectory}/package-lock.json`;

    fs.writeFileSync(beforeLock, '');
    const installExitCode = await runCommand('npm', ['ci', '--no-audit', '--loglevel', 'error'], cwd);
    if (installExitCode !== 0) {
      throw new Error(`npm ci falhou em ${workingDirectory} (exit code ${installExitCode}).`);
    }
    const gitShowExitCode = await exec('git', ['show', `HEAD:${lockfilePath}`], {
      cwd: workspace,
      ignoreReturnCode: true,
      silent: true,
      listeners: { stdout: (data: Buffer) => fs.appendFileSync(beforeLock, data) }
    });
    if (gitShowExitCode !== 0) {
      throw new Error(`Nao foi possivel ler ${lockfilePath} no commit atual.`);
    }
    await runCommand('npm', ['audit', '--json'], cwd, beforeAudit);

    const before = JSON.parse(fs.readFileSync(beforeAudit, 'utf8')) as AuditResult;
    const beforeCount = vulnerabilityCount(before);
    core.info(`${label}: ${beforeCount} vulnerabilidade(s) antes do fix.`);

    const readAudit = (auditFile: string): AuditResult =>
      JSON.parse(fs.readFileSync(auditFile, 'utf8')) as AuditResult;

    const MAX_FIX_ROUNDS = 3;
    let previousCount = beforeCount;
    let final = before;
    for (let round = 0; round < MAX_FIX_ROUNDS; round++) {
      await runCommand('npm', ['audit', 'fix', '--force'], cwd);
      await runCommand('npm', ['audit', '--json'], cwd, afterFixAudit);
      await applyFallbacks(afterFixAudit, cwd);
      await runCommand('npm', ['audit', '--json'], cwd, afterExplicitAudit);
      const roundResult = readAudit(afterExplicitAudit);
      const roundCount = vulnerabilityCount(roundResult);
      final = roundResult;
      if (roundCount === 0 || roundCount >= previousCount) break;
      previousCount = roundCount;
    }

    if (vulnerabilityCount(final) > 0) {
      for (const name of Object.keys(final.vulnerabilities || {})) {
        await runCommand('npm', ['install', '--package-lock-only', '--force', '--ignore-scripts', '--no-audit', '--no-save', `${name}@latest`], cwd);
      }
      await runCommand('npm', ['audit', '--json'], cwd, afterExplicitAudit);
      final = readAudit(afterExplicitAudit);
    }

    const changes = fixedPackageChanges(before, final, beforeLock, afterLock);
    const finalCount = vulnerabilityCount(final);
    core.info(`${label}: ${finalCount} vulnerabilidade(s) depois do fix; ${changes.length} pacote(s) atualizado(s).`);

    core.setOutput('had-vulnerabilities', beforeCount > 0 ? 'true' : 'false');
    core.setOutput('before', beforeCount);
    core.setOutput('after', finalCount);
    core.setOutput('audit-before-file', beforeAudit);
    const changelogEntriesList = beforeCount > 0
      ? changelogEntries(before, label)
      : [`- **${label}:** sem vulnerabilidades`];
    core.setOutput('changelog-entries', changelogEntriesList.join('\n'));
    const summaryLines = [
      `## ${label}`,
      '',
      `- Corrigidas: **${Math.max(0, beforeCount - finalCount)}**`,
      `- Não corrigidas: **${finalCount}**`,
    ];
    if (changes.length) {
      summaryLines.push('- Dependências corrigidas:');
      summaryLines.push(...changes);
    }
    core.summary.addRaw(`${summaryLines.join('\n')}\n\n`);
    await core.summary.write();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Action falhou com erro desconhecido.');
  }
}

run();