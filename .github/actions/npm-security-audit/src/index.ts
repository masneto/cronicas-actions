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

function vulnerabilityRows(audit: AuditResult): string[][] {
  return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
    const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?', url: '' };
    const title = detail.url ? `${detail.title} (${detail.url})` : detail.title;
    return [name, vulnerability.severity || 'unknown', title, detail.range, fixVersion(vulnerability)];
  });
}

function packageChanges(beforeFile: string, afterFile: string): string[] {
  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8')).packages || {};
  const after = JSON.parse(fs.readFileSync(afterFile, 'utf8')).packages || {};

  return Object.keys(after).sort().flatMap((packagePath) => {
    if (!packagePath.startsWith('node_modules/')) return [];
    const oldVersion = before[packagePath]?.version;
    const newVersion = after[packagePath]?.version;
    if (!oldVersion || !newVersion || oldVersion === newVersion) return [];
    return [`- **${packagePath.slice('node_modules/'.length)}**: \`${oldVersion}\` -> \`${newVersion}\``];
  });
}

function changelogEntries(audit: AuditResult, label: string): string[] {
  return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
    const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?' };
    const fix = fixVersion(vulnerability);
    const { range, title } = detail;
    return `- **${label}:** ${name} \`${range}\` -> \`${fix}\` - _${title}_ (${vulnerability.severity || 'unknown'})`;
  });
}

function updateChangelog(file: string, audit: AuditResult, label: string): void {
  const date = new Date().toISOString().slice(0, 10);
  const pipeline = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`;
  const entries = changelogEntries(audit, label);
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
      const insertion = `\n${entryText}\n`;
      content = content.slice(0, sectionEnd) + insertion + content.slice(sectionEnd);
    }
  } else {
    const firstSection = content.indexOf('\n## ');
    const block = `\n${heading}\n\n${entryText}\n- Pipeline: ${pipeline}\n`;
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

export async function run(): Promise<void> {
  try {
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
    const workingDirectory = core.getInput('working-directory') || '.';
    const label = core.getInput('package-label') || workingDirectory;
    const cwd = path.resolve(workspace, workingDirectory);
    const safeLabel = label.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const beforeLock = path.join(os.tmpdir(), `${safeLabel}-package-lock-before.json`);
    const beforeAudit = path.join(os.tmpdir(), `${safeLabel}-audit-before.json`);
    const afterAudit = path.join(os.tmpdir(), `${safeLabel}-audit-after.json`);
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

    const force = core.getInput('force') !== 'false';
    await runCommand('npm', force ? ['audit', 'fix', '--force'] : ['audit', 'fix'], cwd);
    await runCommand('npm', ['audit', '--json'], cwd, afterAudit);

    const after = JSON.parse(fs.readFileSync(afterAudit, 'utf8')) as AuditResult;
    const changes = packageChanges(beforeLock, afterLock);
    const finalCount = vulnerabilityCount(after);
    core.info(`${label}: ${finalCount} vulnerabilidade(s) depois do fix; ${changes.length} pacote(s) atualizado(s).`);

    core.setOutput('had-vulnerabilities', beforeCount > 0 ? 'true' : 'false');
    core.setOutput('before', beforeCount);
    core.setOutput('after', finalCount);
    core.setOutput('audit-before-file', beforeAudit);
    if (changelogPath && beforeCount > 0) {
      updateChangelog(path.resolve(workspace, changelogPath), after, label);
    }
    core.summary.addHeading(label, 2);
    core.summary.addRaw(`**Antes do fix:** ${beforeCount} vulnerabilidade(s)`).addEOL();
    const beforeRows = vulnerabilityRows(before);
    if (beforeRows.length) {
      core.summary.addTable([
        [
          { data: 'Pacote', header: true },
          { data: 'Severidade', header: true },
          { data: 'Problema', header: true },
          { data: 'Faixa', header: true },
          { data: 'Correcao', header: true },
        ],
        ...beforeRows.map((row) => row.map((data) => ({ data }))),
      ]);
    } else {
      core.summary.addRaw('_Nenhuma vulnerabilidade encontrada._');
    }
    core.summary.addRaw(`**Depois do fix:** ${finalCount} vulnerabilidade(s)`).addEOL();
    const afterRows = vulnerabilityRows(after);
    if (afterRows.length) {
      core.summary.addTable([
        [
          { data: 'Pacote', header: true },
          { data: 'Severidade', header: true },
          { data: 'Problema', header: true },
          { data: 'Faixa', header: true },
          { data: 'Correcao', header: true },
        ],
        ...afterRows.map((row) => row.map((data) => ({ data }))),
      ]);
    } else {
      core.summary.addRaw('_Nenhuma vulnerabilidade restante._');
    }
    core.summary.addEOL().addHeading('Packages atualizados', 3);
    if (changes.length) {
      core.summary.addList(changes.map((change) => change.replace(/^- /, '')));
    } else {
      core.summary.addRaw('_Nenhuma mudanca_');
    }
    await core.summary.write();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Action falhou com erro desconhecido.');
  }
}

if (require.main === module) run();