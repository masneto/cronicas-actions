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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.packageStep = packageStep;
exports.commentStep = commentStep;
exports.run = run;
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const github = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/github'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const exec_1 = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/exec'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fs = __importStar(__nccwpck_require__(896));
const path = __importStar(__nccwpck_require__(928));
function packageStep() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 0. Inputs e contexto
            const artifactRepo = core.getInput("artifact_repo");
            const prNumber = core.getInput("pr_number");
            const artifactRunId = core.getInput("artifact_run_id");
            const token = core.getInput("token", { required: true });
            const { owner, repo } = github.context.repo;
            console.log("[DEBUG] Inputs:", { artifactRepo, prNumber, artifactRunId, owner, repo });
            // 1. Configurar usuário do Git para o bot
            core.startGroup('Configuração do usuário do Git');
            console.log('[DEBUG] Configurando git user.name e user.email para github-actions[bot]');
            yield (0, exec_1.exec)('git', ['config', 'user.name', 'github-actions[bot]']);
            yield (0, exec_1.exec)('git', ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
            core.endGroup();
            // 2. Checkout e preparação do branch gh-pages
            core.startGroup('Checkout e preparação do branch gh-pages');
            console.log("[DEBUG] Fetching and checking out gh-pages branch...");
            yield (0, exec_1.exec)("git", ["fetch", "origin", "gh-pages:gh-pages"], { ignoreReturnCode: true });
            yield (0, exec_1.exec)("git", ["checkout", "gh-pages"], { ignoreReturnCode: true });
            if (!fs.existsSync(".git/refs/heads/gh-pages")) {
                console.log("[DEBUG] gh-pages branch não existe, criando...");
                yield (0, exec_1.exec)("git", ["checkout", "--orphan", "gh-pages"]);
                fs.writeFileSync("index.html", "");
                yield (0, exec_1.exec)("git", ["add", "index.html"]);
                yield (0, exec_1.exec)("git", ["commit", "-m", "Initialize gh-pages branch"]);
                yield (0, exec_1.exec)("git", ["push", "origin", "gh-pages"]);
            }
            core.endGroup();
            // 3. Baixar artifact do PR
            core.startGroup('Baixando artifact do PR');
            const artifactDir = `./temp-preview`;
            fs.mkdirSync(artifactDir, { recursive: true });
            const octokit = github.getOctokit(token);
            // Usar owner/repo do artifactRepo para buscar o artifact
            const [artifactOwner, artifactRepoName] = artifactRepo.split("/");
            console.log("[DEBUG] Buscando artifacts do workflow run", artifactRunId, "em", artifactOwner, artifactRepoName);
            const artifacts = yield octokit.rest.actions.listWorkflowRunArtifacts({
                owner: artifactOwner,
                repo: artifactRepoName,
                run_id: parseInt(artifactRunId),
            });
            console.log("[DEBUG] Artifacts encontrados:", artifacts.data.artifacts.map(a => a.name));
            const match = artifacts.data.artifacts.find(a => a.name === `pr-${prNumber}`);
            if (!match)
                throw new Error(`Artifact pr-${prNumber} não encontrado`);
            console.log("[DEBUG] Baixando artifact id:", match.id);
            const download = yield octokit.rest.actions.downloadArtifact({
                owner: artifactOwner,
                repo: artifactRepoName,
                artifact_id: match.id,
                archive_format: "zip",
            });
            const zipPath = path.join(artifactDir, "artifact.zip");
            fs.writeFileSync(zipPath, Buffer.from(download.data));
            yield (0, exec_1.exec)("unzip", ["-o", zipPath, "-d", artifactDir]);
            // Remove o arquivo zip após descompactar
            if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
                console.log("[DEBUG] artifact.zip removido após descompactação");
            }
            core.endGroup();
            // 4. Copiar conteúdo do artifact para pasta do PR
            core.startGroup('Copiando conteúdo do artifact para pasta do PR');
            const targetDir = `./${path.basename(artifactRepo)}/pr-${prNumber}`;
            fs.mkdirSync(targetDir, { recursive: true });
            console.log("[DEBUG] Copiando arquivos do artifact para:", targetDir);
            // Copiar conteúdo de artifactDir (arquivos e subpastas) para targetDir
            const copyRecursiveSync = (src, dest) => {
                if (!fs.existsSync(src))
                    return;
                const stats = fs.statSync(src);
                if (stats.isDirectory()) {
                    fs.mkdirSync(dest, { recursive: true });
                    for (const file of fs.readdirSync(src)) {
                        const srcFile = path.join(src, file);
                        const destFile = path.join(dest, file);
                        copyRecursiveSync(srcFile, destFile);
                    }
                }
                else {
                    fs.copyFileSync(src, dest);
                }
            };
            // Copia cada item de dentro de artifactDir para targetDir
            for (const file of fs.readdirSync(artifactDir)) {
                const srcFile = path.join(artifactDir, file);
                const destFile = path.join(targetDir, file);
                copyRecursiveSync(srcFile, destFile);
            }
            // Remove a pasta temp-preview após a cópia, igual ao workflow shell
            fs.rmSync(artifactDir, { recursive: true, force: true });
            core.endGroup();
            // 5. Atualizar index.html com card do PR
            core.startGroup('Atualizando index.html com card do PR');
            const indexFile = "index.html";
            let indexContent = "";
            if (fs.existsSync(indexFile)) {
                indexContent = fs.readFileSync(indexFile, "utf-8");
                console.log("[DEBUG] index.html existente carregado");
            }
            else {
                // Busca index.template.html do branch main se não existir
                try {
                    yield (0, exec_1.exec)("git", ["fetch", "origin", "main:index-template"], { ignoreReturnCode: true });
                    yield (0, exec_1.exec)("git", ["checkout", "index-template", "--", "index.template.html"], { ignoreReturnCode: true });
                    if (fs.existsSync("index.template.html")) {
                        fs.copyFileSync("index.template.html", indexFile);
                        indexContent = fs.readFileSync(indexFile, "utf-8");
                        console.log("[DEBUG] index.template.html copiado para index.html");
                    }
                    else {
                        indexContent = "<div class=\"grid\"></div>";
                        console.log("[DEBUG] Nenhum template encontrado, usando grid vazio");
                    }
                }
                catch (_a) {
                    indexContent = "<div class=\"grid\"></div>";
                    console.log("[DEBUG] Erro ao buscar template, usando grid vazio");
                }
            }
            // Blocos delimitadores para cards de PR
            const PR_START = "<!-- PR_PLACEHOLDER -->";
            const PR_END = "<!-- END_PR_PLACEHOLDER -->";
            const newCard = `<div class='card'><h3><a href='${path.basename(artifactRepo)}/pr-${prNumber}/'>${path.basename(artifactRepo)}</a></h3><p>Pull Request #${prNumber}</p></div>`;
            // Extrai cards existentes entre os blocos
            let prBlock = "";
            let before = indexContent;
            let after = "";
            if (indexContent.includes(PR_START) && indexContent.includes(PR_END)) {
                const startIdx = indexContent.indexOf(PR_START) + PR_START.length;
                const endIdx = indexContent.indexOf(PR_END);
                prBlock = indexContent.substring(startIdx, endIdx);
                before = indexContent.substring(0, indexContent.indexOf(PR_START) + PR_START.length);
                after = indexContent.substring(indexContent.indexOf(PR_END));
            }
            else {
                // Se não existe bloco, cria um
                if (!indexContent.includes("<div class=\"grid\">")) {
                    indexContent = "<div class=\"grid\"></div>";
                }
                before = indexContent.replace("</div>", `${PR_START}\n`);
                after = `\n${PR_END}</div>`;
                prBlock = "";
            }
            // Remove card duplicado do mesmo PR
            const repoName = path.basename(artifactRepo);
            const prCardRegex = new RegExp(`<div class='card'><h3><a href='${repoName}/pr-${prNumber}/'>${repoName}</a></h3><p>Pull Request #${prNumber}</p></div>`, "g");
            prBlock = prBlock.replace(prCardRegex, "");
            // Adiciona o novo card
            prBlock += `\n${newCard}`;
            // Monta o novo conteúdo
            indexContent = `${before}\n${prBlock.trim()}\n${after}`;
            fs.writeFileSync(indexFile, indexContent);
            console.log("[DEBUG] index.html atualizado");
            core.endGroup();
            // 6. Commit e push das alterações
            core.startGroup('Commit e push das alterações');
            console.log("[DEBUG] Commitando e dando push no gh-pages...");
            yield (0, exec_1.exec)("git", ["add", "."]);
            yield (0, exec_1.exec)("git", ["commit", "-m", `Update preview for PR #${prNumber}`], { ignoreReturnCode: true });
            yield (0, exec_1.exec)("git", ["push", "origin", "gh-pages"]);
            core.endGroup();
        }
        catch (err) {
            core.setFailed(err instanceof Error ? err.message : String(err));
        }
    });
}
function commentStep() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const artifactRepo = core.getInput("artifact_repo");
            const prNumber = core.getInput("pr_number");
            const token = core.getInput("token", { required: true });
            const { owner, repo } = github.context.repo;
            const octokit = github.getOctokit(token);
            const previewUrl = `https://${owner}.github.io/${repo}/${path.basename(artifactRepo)}/pr-${prNumber}/`;
            console.log("[DEBUG] Preview URL:", previewUrl);
            // Remover comentários antigos do PR que não são do bot
            core.startGroup('Removendo comentários antigos do PR');
            const prOwner = artifactRepo.split("/")[0];
            const prRepo = artifactRepo.split("/")[1];
            const comments = yield octokit.rest.issues.listComments({
                owner: prOwner,
                repo: prRepo,
                issue_number: parseInt(prNumber),
            });
            console.log("[DEBUG] Comentários encontrados:", comments.data.length);
            for (const comment of comments.data) {
                const user = ((_a = comment.user) === null || _a === void 0 ? void 0 : _a.login) || "";
                if (user !== "github-actions[bot]" && user !== "copilot[bot]") {
                    try {
                        yield octokit.rest.issues.deleteComment({
                            owner: prOwner,
                            repo: prRepo,
                            comment_id: comment.id,
                        });
                        core.info(`Comentário ${comment.id} de ${user} removido.`);
                    }
                    catch (e) {
                        core.warning(`Falha ao remover comentário ${comment.id}: ${e}`);
                    }
                }
            }
            core.endGroup();
            // Postar novo comentário
            core.startGroup('Postando comentário de preview no PR');
            yield octokit.rest.issues.createComment({
                owner: prOwner,
                repo: prRepo,
                issue_number: parseInt(prNumber),
                body: `🚀 **Preview disponível!**\n\n📖 [Documentação](${previewUrl})`,
            });
            console.log("[DEBUG] Comentário de preview postado no PR");
            core.endGroup();
            core.setOutput("preview-url", previewUrl);
        }
        catch (err) {
            core.setFailed(err instanceof Error ? err.message : String(err));
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const step = core.getInput("step", { required: false }) || "package";
        if (step === "package") {
            yield packageStep();
        }
        else if (step === "comment") {
            yield commentStep();
        }
        else {
            core.setFailed(`Valor de step inválido: ${step}`);
        }
    });
}
if (require.main === require.cache[eval('__filename')]) {
    run();
}


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = require("fs");

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