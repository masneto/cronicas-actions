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
      return `- **${name}**: \`${oldVersion || 'não informado'}\` -> \`${newVersion || 'corrigido'}\``;
    });
}

function changelogEntries(audit: AuditResult, label: string): string[] {
  return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
    const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?' };
    const fix = fixVersion(vulnerability);
    return `- **${label}:** ${name} \`${detail.range}\` -> disponível: \`${fix}\` — _${detail.title}_ (${vulnerability.severity || 'unknown'}, remanescente após o fix)`;
  });
}

function updateChangelog(file: string, audit: AuditResult, label: string, beforeCount: number, changes: string[]): void {
  const date = new Date().toISOString().slice(0, 10);
  const pipeline = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`;
  const entries = Object.keys(audit.vulnerabilities || {}).length > 0
    ? changelogEntries(audit, label)
    : changes.length > 0
      ? [`- **${label}:** dependências corrigidas:`, ...changes.map((change) => `  ${change}`)]
    : beforeCount > 0
      ? [`- **${label}:** ${beforeCount} vulnerabilidade(s) corrigida(s) automaticamente.`]
      : [];
  if (!entries.length) return;

  let content = fs.existsSync(file)
    ? fs.readFileSync(file, 'utf8')
    : '# Security Fixes\n';
  const heading = `## ${date}`;
  const entryText = entries.join('\n');
  const existingHeading = content.indexOf(`${heading}\n`);
  if (existingHeading >= 0) {
    const nextHeading = content.indexOf('\n## ', existingHeading + heading.length);
    const sectionEnd = nextHeading >= 0 ? nextHeading : content.length;
    const section = content.slice(existingHeading, sectionEnd);
    if (!section.includes(`**${label}:**`)) {
      const insertion = `\n${entryText}\n- Pipeline: [${pipeline}](${pipeline})\n`;
      content = content.slice(0, sectionEnd) + insertion + content.slice(sectionEnd);
    }
  } else {
    const firstSection = content.indexOf('\n## ');
    const block = `\n${heading}\n\n${entryText}\n- Pipeline: [${pipeline}](${pipeline})\n`;
    content = firstSection >= 0
      ? content.slice(0, firstSection) + block + content.slice(firstSection)
      : `${content.trimEnd()}${block}\n`;
  }
  fs.writeFileSync(file, content);
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
    const workingDirectory = core.getInput('working-directory') || '.';
    const label = core.getInput('package-label') || workingDirectory;
    const cwd = path.resolve(workspace, workingDirectory);
    const safeLabel = label.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const beforeLock = path.join(os.tmpdir(), `${safeLabel}-package-lock-before.json`);
    const beforeAudit = path.join(os.tmpdir(), `${safeLabel}-audit-before.json`);
    const afterFixAudit = path.join(os.tmpdir(), `${safeLabel}-audit-after-fix.json`);
    const afterExplicitAudit = path.join(os.tmpdir(), `${safeLabel}-audit-after-explicit.json`);
    const afterLock = path.join(cwd, 'package-lock.json');
    const lockfilePath = workingDirectory === '.' ? 'package-lock.json' : `${workingDirectory}/package-lock.json`;
    const changelogPath = core.getInput('changelog-path');

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

    await runCommand('npm', ['audit', 'fix', '--force'], cwd);
    await runCommand('npm', ['audit', '--json'], cwd, afterFixAudit);
    const explicitFallbackApplied = await applyFallbacks(afterFixAudit, cwd);
    await runCommand('npm', ['audit', '--json'], cwd, afterExplicitAudit);

    const final = JSON.parse(fs.readFileSync(afterExplicitAudit, 'utf8')) as AuditResult;
    const changes = fixedPackageChanges(before, final, beforeLock, afterLock);
    const finalCount = vulnerabilityCount(final);
    core.info(`${label}: ${finalCount} vulnerabilidade(s) depois do fix; ${changes.length} pacote(s) atualizado(s).`);

    core.setOutput('had-vulnerabilities', beforeCount > 0 ? 'true' : 'false');
    core.setOutput('before', beforeCount);
    core.setOutput('after', finalCount);
    core.setOutput('audit-before-file', beforeAudit);
    if (changelogPath && beforeCount > 0) {
      updateChangelog(path.resolve(workspace, changelogPath), final, label, beforeCount, changes);
    }
    core.summary.addHeading(label, 2);
    core.summary.addRaw(`- Corrigidas: **${Math.max(0, beforeCount - finalCount)}**`).addEOL();
    core.summary.addRaw(`- Não corrigidas: **${finalCount}**`).addEOL();
    core.summary.addRaw(`- Motivo: *${finalCount === 0 ? 'corrigido por npm audit fix e/ou fallback' : 'vulnerabilidades remanescentes após fallback'}*`).addEOL();
    if (changes.length) {
      core.summary.addRaw('- Dependências corrigidas:').addEOL();
      core.summary.addList(changes.map((change) => change.replace(/^- /, '')));
    }
    const fallbackReason = explicitFallbackApplied
      ? 'Fallback aplicado com a versão recomendada pelo npm audit.'
      : 'Fallback de overrides não necessário (vulnerabilidades resolvidas antes desta etapa).';
    core.summary.addRaw(`- Ação de fallback aplicada: ${fallbackReason}`).addEOL();
    await core.summary.write();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Action falhou com erro desconhecido.');
  }
}

run();