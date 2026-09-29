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

type LockfilePackages = Record<string, { version?: string } | undefined>;

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
};

type FixTarget = { name: string; version: string };

type Vulnerability = NonNullable<NonNullable<AuditResult['vulnerabilities']>[string]>;

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'] as const;

const SEVERITY_WEIGHT: Record<string, number> = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };

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
  return ['info', 'low', 'moderate', 'high', 'critical'].reduce(
    (total, severity) => total + (vulnerabilities[severity] || 0),
    0
  );
}

function installedVersion(lock: LockfilePackages, name: string): string {
  const key = Object.keys(lock).find((packagePath) =>
    packagePath === `node_modules/${name}` || packagePath.endsWith(`/node_modules/${name}`));
  return (key && lock[key]?.version) || 'não informado';
}

function readLockfile(file: string): LockfilePackages {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).packages || {};
  } catch {
    return {};
  }
}

function isConcreteVersion(value: string): boolean {
  return /^\d+\.\d+\.\d+/.test(value);
}

function pinnedVersion(spec: string): string {
  return spec.trim().replace(/^[\^~>=<\s]+/, '');
}

function isNewerVersion(candidate: string, current: string): boolean {
  if (!isConcreteVersion(candidate) || !isConcreteVersion(current)) return false;
  const parse = (version: string) => version.split('-')[0].split('.').map((part) => Number.parseInt(part, 10) || 0);
  const left = parse(candidate);
  const right = parse(current);
  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference > 0;
  }
  return false;
}

function fixedPackageChanges(before: AuditResult, after: AuditResult, beforeLock: LockfilePackages, afterLock: LockfilePackages): string[] {
  const afterVulnerabilities = after.vulnerabilities || {};

  return Object.keys(before.vulnerabilities || {})
    .filter((name) => !afterVulnerabilities[name])
    .sort()
    .map((name) => {
      const from = installedVersion(beforeLock, name);
      const to = installedVersion(afterLock, name);
      return `- \`${name}\`: \`${from}\` -> \`${to}\``;
    });
}

function changelogEntries(
  before: AuditResult,
  after: AuditResult,
  beforeLock: LockfilePackages,
  afterLock: LockfilePackages,
  label: string
): string[] {
  const beforeVulnerabilities = before.vulnerabilities || {};
  const remaining = after.vulnerabilities || {};
  const lines = Object.entries(remaining).map(([name, vulnerability]) => {
    const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?' };
    const fix = fixVersion(vulnerability);
    return `- **${label}:** ${name} \`${detail.range}\` → \`${fix}\` — _${detail.title}_ (${vulnerability.severity || 'unknown'}, remanescente)`;
  });

  for (const name of Object.keys(beforeVulnerabilities).filter((key) => !remaining[key]).sort()) {
    const detail = advisoryDetails(beforeVulnerabilities[name])[0] || { title: 'sem detalhes', range: '?' };
    const from = installedVersion(beforeLock, name);
    const to = installedVersion(afterLock, name);
    const change = from === to ? `\`${from}\`` : `\`${from}\` → \`${to}\``;
    lines.push(
      `- **${label}:** ${name} ${change} — _${detail.title}_ (${beforeVulnerabilities[name].severity || 'unknown'}, corrigida)`
    );
  }

  if (lines.length === 0) lines.push(`- **${label}:** sem vulnerabilidades`);
  return lines;
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

function parseViewVersion(output: string): string | null {
  const lines = output.split('\n').map((line) => line.trim()).filter(Boolean);
  const last = lines[lines.length - 1];
  if (!last) return null;
  const quoted = last.match(/'([^']+)'\s*$/);
  return quoted ? quoted[1] : (last.split(/\s+/).pop() ?? null);
}

const latestVersionCache = new Map<string, string | null>();

async function latestVersion(packageName: string, cwd: string, major?: string): Promise<string | null> {
  const spec = major ? `${packageName}@${major}` : packageName;
  if (latestVersionCache.has(spec)) return latestVersionCache.get(spec) ?? null;
  let output = '';
  const exitCode = await exec('npm', ['view', spec, 'version'], {
    cwd,
    ignoreReturnCode: true,
    silent: true,
    listeners: { stdout: (data: Buffer) => { output += data.toString(); } }
  });
  const version = exitCode === 0 ? parseViewVersion(output) : null;
  latestVersionCache.set(spec, version);
  return version;
}

async function candidateVersions(name: string, fix: FixTarget, installed: string, cwd: string): Promise<string[]> {
  const candidates: Array<string | null> = fix.version ? [fix.version] : [];
  const major = installed.split('.')[0];
  // Prefere a correcao dentro do mesmo major para nao forcar breaking change em transitiva.
  if (major && /^\d+$/.test(major)) candidates.push(await latestVersion(name, cwd, major));
  candidates.push(await latestVersion(name, cwd));
  return [...new Set(candidates.filter((version): version is string => Boolean(version)))];
}

function fixTarget(name: string, vulnerability: Vulnerability): FixTarget | null {
  const fix = vulnerability.fixAvailable;
  if (fix === false) return null;
  if (fix && typeof fix === 'object') {
    return fix.name && fix.version ? { name: fix.name, version: fix.version } : null;
  }
  // Vulnerabilidades transitivas vem com fixAvailable booleano, sem versao.
  // A versao corrigida precisa ser resolvida no registro do pacote.
  return { name, version: '' };
}

function dependencyField(packageJson: PackageJson, name: string): typeof DEPENDENCY_FIELDS[number] | null {
  for (const field of DEPENDENCY_FIELDS) {
    if (packageJson[field]?.[name]) return field;
  }
  return null;
}

function buildResolution(packageJson: PackageJson, name: string, version: string): PackageJson | null {
  const next: PackageJson = { ...packageJson, overrides: { ...(packageJson.overrides || {}) } };
  const field = dependencyField(packageJson, name);

  if (field) {
    const spec = `^${version}`;
    if (packageJson[field]![name] === spec) return null;
    (next as Record<string, unknown>)[field] = { ...packageJson[field], [name]: spec };
    if (packageJson.overrides && name in packageJson.overrides) next.overrides![name] = spec;
    return next;
  }

  if (next.overrides![name] === version) return null;
  next.overrides![name] = version;
  return next;
}

async function writeResolution(cwd: string, packageJson: PackageJson): Promise<void> {
  fs.writeFileSync(path.join(cwd, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
  await runCommand('npm', ['install', '--package-lock-only', '--force', '--ignore-scripts', '--no-audit'], cwd);
}

type PackageState = { manifest: string; lockfile: string };

// npm install --package-lock-only e incremental: reaproveita a versao que ja
// satisfaz a range. Por isso a reversao restaura os arquivos exatos, sem rodar npm.
function snapshotState(cwd: string): PackageState {
  const lockfile = path.join(cwd, 'package-lock.json');
  return {
    manifest: fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'),
    lockfile: fs.existsSync(lockfile) ? fs.readFileSync(lockfile, 'utf8') : '',
  };
}

function restoreState(cwd: string, state: PackageState): void {
  fs.writeFileSync(path.join(cwd, 'package.json'), state.manifest);
  fs.writeFileSync(path.join(cwd, 'package-lock.json'), state.lockfile);
}

function withOverrides(packageJson: PackageJson, overrides: Record<string, string>): PackageJson {
  const next: PackageJson = { ...packageJson, overrides: { ...overrides } };
  if (Object.keys(overrides).length === 0) delete next.overrides;
  return next;
}

async function auditCountIn(cwd: string, auditFile: string): Promise<number> {
  await runCommand('npm', ['audit', '--json'], cwd, auditFile);
  return vulnerabilityCount(JSON.parse(fs.readFileSync(auditFile, 'utf8')) as AuditResult);
}

async function pruneObsoleteOverrides(cwd: string, auditFile: string, remaining: number): Promise<string[]> {
  const lockFile = path.join(cwd, 'package-lock.json');
  let current = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) as PackageJson;
  const names = Object.keys(current.overrides || {});
  if (names.length === 0) return [];

  const pruned: string[] = [];
  let currentCount = remaining;
  for (const name of names) {
    const pinned = pinnedVersion(current.overrides![name]);
    if (!isConcreteVersion(pinned)) continue;
    if (!isConcreteVersion(installedVersion(readLockfile(lockFile), name))) continue;

    const state = snapshotState(cwd);
    const attempt = withOverrides(current, { ...current.overrides });
    delete attempt.overrides![name];
    await writeResolution(cwd, attempt);

    const resolved = installedVersion(readLockfile(lockFile), name);
    const attemptCount = await auditCountIn(cwd, auditFile);

    // So remove o pin quando ele deixa de ser necessario: a arvore passa a resolver
    // uma versao mais nova sem reintroduzir vulnerabilidades.
    if (attemptCount <= currentCount && isNewerVersion(resolved, pinned)) {
      core.info(`Override ${name}@${pinned} removido: a arvore agora resolve ${resolved} sem vulnerabilidades.`);
      current = attempt;
      currentCount = attemptCount;
      pruned.push(`${name}@${pinned} -> ${resolved}`);
      continue;
    }

    restoreState(cwd, state);
    core.info(`Override ${name}@${pinned} mantido: ainda necessario para o estado atual da arvore.`);
  }

  return pruned;
}

async function resolveRemaining(audit: AuditResult, cwd: string, auditFile: string): Promise<AuditResult> {
  let current = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) as PackageJson;
  let currentCount = vulnerabilityCount(audit);

  const targets = Object.entries(audit.vulnerabilities || {})
    .map(([name, vulnerability]) => ({
      severity: SEVERITY_WEIGHT[vulnerability.severity || 'info'] ?? 5,
      target: fixTarget(name, vulnerability),
    }))
    .filter((entry): entry is { severity: number; target: FixTarget } => entry.target !== null)
    .sort((a, b) => a.severity - b.severity);

  for (const { target } of targets) {
    if (currentCount === 0) break;

    const installed = installedVersion(readLockfile(path.join(cwd, 'package-lock.json')), target.name);
    const candidates = await candidateVersions(target.name, target, installed, cwd);
    if (candidates.length === 0) {
      core.warning(`Nao foi possivel determinar a versao corrigida de ${target.name}.`);
      continue;
    }

    for (const version of candidates) {
      const state = snapshotState(cwd);
      const resolution = buildResolution(current, target.name, version);
      if (!resolution) continue;

      await writeResolution(cwd, resolution);
      await runCommand('npm', ['audit', '--json'], cwd, auditFile);
      const attempt = JSON.parse(fs.readFileSync(auditFile, 'utf8')) as AuditResult;
      const attemptCount = vulnerabilityCount(attempt);

      if (attemptCount < currentCount) {
        currentCount = attemptCount;
        current = resolution;
        core.info(`${target.name} fixado em ${version} (de ${installed}): restam ${currentCount} vulnerabilidade(s).`);
        break;
      }

      restoreState(cwd, state);
      core.warning(`Resolucao de ${target.name}@${version} revertida: nao reduziu as vulnerabilidades.`);
    }
  }

  await runCommand('npm', ['audit', '--json'], cwd, auditFile);
  return JSON.parse(fs.readFileSync(auditFile, 'utf8')) as AuditResult;
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
    for (let round = 0; round < MAX_FIX_ROUNDS && previousCount > 0; round++) {
      await runCommand('npm', ['audit', 'fix', '--force'], cwd);
      await runCommand('npm', ['audit', '--json'], cwd, afterFixAudit);
      const roundResult = readAudit(afterFixAudit);
      const roundCount = vulnerabilityCount(roundResult);
      if (roundCount === 0 || roundCount >= previousCount) {
        final = roundResult;
        break;
      }
      final = await resolveRemaining(roundResult, cwd, afterExplicitAudit);
      previousCount = vulnerabilityCount(final);
    }

    if (vulnerabilityCount(final) > 0) {
      final = await resolveRemaining(final, cwd, afterExplicitAudit);
    }

    const prunedOverrides = await pruneObsoleteOverrides(cwd, afterExplicitAudit, vulnerabilityCount(final));
    await runCommand('npm', ['audit', '--json'], cwd, afterExplicitAudit);
    final = readAudit(afterExplicitAudit);

    const beforeLockPackages = readLockfile(beforeLock);
    const afterLockPackages = readLockfile(afterLock);
    const changes = fixedPackageChanges(before, final, beforeLockPackages, afterLockPackages);
    const finalCount = vulnerabilityCount(final);
    core.info(`${label}: ${finalCount} vulnerabilidade(s) depois do fix; ${changes.length} pacote(s) atualizado(s).`);

    core.setOutput('had-vulnerabilities', beforeCount > 0 ? 'true' : 'false');
    core.setOutput('before', beforeCount);
    core.setOutput('after', finalCount);
    core.setOutput('audit-before-file', beforeAudit);
    core.setOutput('changelog-entries', changelogEntries(before, final, beforeLockPackages, afterLockPackages, label).join('\n'));
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
    if (prunedOverrides.length) {
      summaryLines.push('- Overrides obsoletos removidos:');
      summaryLines.push(...prunedOverrides.map((entry) => `  - \`${entry}\``));
    }
    core.summary.addRaw(`${summaryLines.join('\n')}\n\n`);
    await core.summary.write();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Action falhou com erro desconhecido.');
  }
}

run();