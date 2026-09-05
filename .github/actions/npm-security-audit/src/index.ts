import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type AuditResult = {
  metadata?: { vulnerabilities?: Record<string, number> };
  vulnerabilities?: Record<string, {
    severity?: string;
    via?: Array<{ title?: string; range?: string } | string>;
    fixAvailable?: { version?: string } | boolean;
  }>;
};

function vulnerabilityCount(audit: AuditResult): number {
  const vulnerabilities = audit.metadata?.vulnerabilities || {};
  return ['moderate', 'high', 'critical'].reduce(
    (total, severity) => total + (vulnerabilities[severity] || 0),
    0
  );
}

function vulnerabilityRows(audit: AuditResult): string[][] {
  return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
    const detail = vulnerability.via?.[0];
    const title = typeof detail === 'string' ? detail : detail?.title || 'sem detalhes';
    const range = typeof detail === 'string' ? '?' : detail?.range || '?';
    const fix = vulnerability.fixAvailable === false
      ? 'nao disponivel'
      : typeof vulnerability.fixAvailable === 'object'
        ? vulnerability.fixAvailable.version || 'disponivel'
        : 'disponivel';
    return [name, vulnerability.severity || 'unknown', title, range, fix];
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
    const detail = vulnerability.via?.[0];
    const range = typeof detail === 'string' ? '?' : detail?.range || '?';
    const title = typeof detail === 'string' ? detail : detail?.title || 'sem detalhes';
    const fix = typeof vulnerability.fixAvailable === 'object'
      ? vulnerability.fixAvailable.version || 'fixed'
      : 'fixed';
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

async function runCommand(command: string, args: string[], cwd: string, outputFile?: string): Promise<void> {
  let output = '';
  await exec(command, args, {
    cwd,
    ignoreReturnCode: true,
    silent: true,
    listeners: {
      stdout: (data: Buffer) => { output += data.toString(); }
    }
  });
  if (outputFile) fs.writeFileSync(outputFile, output || '{}');
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
    await runCommand('npm', ['ci', '--no-audit', '--loglevel', 'error'], cwd);
    await exec('git', ['show', `HEAD:${lockfilePath}`], {
      cwd: workspace,
      silent: true,
      listeners: { stdout: (data: Buffer) => fs.appendFileSync(beforeLock, data) }
    });
    await runCommand('npm', ['audit', '--json'], cwd, beforeAudit);

    const before = JSON.parse(fs.readFileSync(beforeAudit, 'utf8')) as AuditResult;
    const beforeCount = vulnerabilityCount(before);
    core.info(`${label}: ${beforeCount} vulnerabilidade(s) antes do fix.`);

    const force = core.getInput('force') !== 'false';
    await runCommand('npm', force ? ['audit', 'fix', '--force'] : ['audit', 'fix'], cwd);
    await runCommand('npm', ['audit', '--json'], cwd, afterAudit);

    const after = JSON.parse(fs.readFileSync(afterAudit, 'utf8')) as AuditResult;
    const afterCount = vulnerabilityCount(after);
    const changes = packageChanges(beforeLock, afterLock);
    core.info(`${label}: ${afterCount} vulnerabilidade(s) depois do fix; ${changes.length} pacote(s) atualizado(s).`);

    core.setOutput('had-vulnerabilities', beforeCount > 0 ? 'true' : 'false');
    core.setOutput('before', beforeCount);
    core.setOutput('after', afterCount);
    core.setOutput('audit-before-file', beforeAudit);
    if (changelogPath && beforeCount > 0) {
      updateChangelog(path.resolve(workspace, changelogPath), before, label);
    }
    core.summary.addHeading(label, 2);
    core.summary.addRaw(`**Antes do fix:** ${beforeCount} vulnerabilidade(s)`);
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
    core.summary.addRaw(`**Depois do fix:** ${afterCount} vulnerabilidade(s)`);
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
    core.summary.addHeading('Packages atualizados', 3);
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