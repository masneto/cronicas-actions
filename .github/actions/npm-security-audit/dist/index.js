/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 407:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const exec_1 = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/exec'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fs = __importStar(__nccwpck_require__(896));
const os = __importStar(__nccwpck_require__(857));
const path = __importStar(__nccwpck_require__(928));
function advisoryDetails(vulnerability) {
    return (vulnerability.via || []).map((detail) => {
        if (typeof detail === 'string')
            return { title: detail, range: '?', url: '' };
        return {
            title: detail.title || 'sem detalhes',
            range: detail.range || '?',
            url: detail.url || '',
        };
    });
}
function fixVersion(vulnerability) {
    if (vulnerability.fixAvailable === false)
        return 'nao disponivel';
    if (typeof vulnerability.fixAvailable === 'object') {
        return vulnerability.fixAvailable.version || 'disponivel';
    }
    return vulnerability.fixAvailable ? 'disponivel' : 'nao informado';
}
function vulnerabilityCount(audit) {
    const vulnerabilities = audit.metadata?.vulnerabilities || {};
    return ['moderate', 'high', 'critical'].reduce((total, severity) => total + (vulnerabilities[severity] || 0), 0);
}
function vulnerabilityRows(audit) {
    return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
        const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?', url: '' };
        const title = detail.url ? `${detail.title} (${detail.url})` : detail.title;
        return [name, vulnerability.severity || 'unknown', title, detail.range, fixVersion(vulnerability)];
    });
}
function packageChanges(beforeFile, afterFile) {
    const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8')).packages || {};
    const after = JSON.parse(fs.readFileSync(afterFile, 'utf8')).packages || {};
    return Object.keys(after).sort().flatMap((packagePath) => {
        if (!packagePath.startsWith('node_modules/'))
            return [];
        const oldVersion = before[packagePath]?.version;
        const newVersion = after[packagePath]?.version;
        if (!oldVersion || !newVersion || oldVersion === newVersion)
            return [];
        return [`- **${packagePath.slice('node_modules/'.length)}**: \`${oldVersion}\` -> \`${newVersion}\``];
    });
}
function changelogEntries(audit, label) {
    return Object.entries(audit.vulnerabilities || {}).map(([name, vulnerability]) => {
        const detail = advisoryDetails(vulnerability)[0] || { title: 'sem detalhes', range: '?' };
        const fix = fixVersion(vulnerability);
        const { range, title } = detail;
        return `- **${label}:** ${name} \`${range}\` -> \`${fix}\` - _${title}_ (${vulnerability.severity || 'unknown'})`;
    });
}
function updateChangelog(file, audit, label) {
    const date = new Date().toISOString().slice(0, 10);
    const pipeline = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`;
    const entries = changelogEntries(audit, label);
    if (!entries.length)
        return;
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
    }
    else {
        const firstSection = content.indexOf('\n## ');
        const block = `\n${heading}\n\n${entryText}\n- Pipeline: ${pipeline}\n`;
        content = firstSection >= 0
            ? content.slice(0, firstSection) + block + content.slice(firstSection)
            : `${content.trimEnd()}${block}\n`;
    }
    fs.writeFileSync(file, content);
}
async function runCommand(command, args, cwd, outputFile) {
    let output = '';
    const exitCode = await (0, exec_1.exec)(command, args, {
        cwd,
        ignoreReturnCode: true,
        silent: true,
        listeners: {
            stdout: (data) => { output += data.toString(); }
        }
    });
    if (outputFile)
        fs.writeFileSync(outputFile, output || '{}');
    return exitCode;
}
async function run() {
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
        const gitShowExitCode = await (0, exec_1.exec)('git', ['show', `HEAD:${lockfilePath}`], {
            cwd: workspace,
            ignoreReturnCode: true,
            silent: true,
            listeners: { stdout: (data) => fs.appendFileSync(beforeLock, data) }
        });
        if (gitShowExitCode !== 0) {
            throw new Error(`Nao foi possivel ler ${lockfilePath} no commit atual.`);
        }
        await runCommand('npm', ['audit', '--json'], cwd, beforeAudit);
        const before = JSON.parse(fs.readFileSync(beforeAudit, 'utf8'));
        const beforeCount = vulnerabilityCount(before);
        core.info(`${label}: ${beforeCount} vulnerabilidade(s) antes do fix.`);
        const force = core.getInput('force') !== 'false';
        await runCommand('npm', force ? ['audit', 'fix', '--force'] : ['audit', 'fix'], cwd);
        await runCommand('npm', ['audit', '--json'], cwd, afterAudit);
        const after = JSON.parse(fs.readFileSync(afterAudit, 'utf8'));
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
        }
        else {
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
        }
        else {
            core.summary.addRaw('_Nenhuma vulnerabilidade restante._');
        }
        core.summary.addEOL().addHeading('Packages atualizados', 3);
        if (changes.length) {
            core.summary.addList(changes.map((change) => change.replace(/^- /, '')));
        }
        else {
            core.summary.addRaw('_Nenhuma mudanca_');
        }
        await core.summary.write();
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : 'Action falhou com erro desconhecido.');
    }
}
if (require.main === require.cache[eval('__filename')])
    run();


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 857:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/asset-relocator-loader */
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(407);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;