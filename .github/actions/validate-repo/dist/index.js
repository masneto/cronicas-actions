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
exports.run = run;
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const fs = __importStar(__nccwpck_require__(896));
const path = __importStar(__nccwpck_require__(928));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Lista dos arquivos que precisam estar no repo
            const requiredFiles = [
                'package.json',
                'Dockerfile',
                'src/app.js',
                'src/server.js',
                'src/public/index.html',
                'src/public/styles.css',
                'test/app.test.js'
            ];
            // Processo para validar cada arquivo
            const missingFiles = [];
            for (const file of requiredFiles) {
                const filePath = path.join(process.env.GITHUB_WORKSPACE || '', file);
                if (!fs.existsSync(filePath)) {
                    missingFiles.push(file);
                }
            }
            // Em caso de arquivo faltante, falha a action 
            if (missingFiles.length > 0) {
                const errorMessage = `Os seguintes arquivos necessários estão faltando: ${missingFiles.join(', ')}`;
                core.setFailed(errorMessage);
                return;
            }
            // Verificando o package.json da aplicação
            const packageJsonPath = path.join(process.env.GITHUB_WORKSPACE || '', 'package.json');
            const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (!packageJsonContent.scripts ||
                !packageJsonContent.scripts.test ||
                !packageJsonContent.scripts.start) {
                core.setFailed('O arquivo package.json não contém os scripts necessários (test e start)');
                return;
            }
            // Verificação do arquivo Dockerfile
            const dockerfilePath = path.join(process.env.GITHUB_WORKSPACE || '', 'Dockerfile');
            const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
            if (!dockerfileContent.includes('HEALTHCHECK')) {
                core.warning('O Dockerfile não contém instrução HEALTHCHECK. Isso é recomendado para containers em produção.');
            }
            core.info('Todos os arquivos necessários foram encontrados e validados com sucesso.');
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(`Action falhou com erro: ${error.message}`);
            }
            else {
                core.setFailed(`Action falhou com um erro desconhecido.`);
            }
        }
    });
}
run();


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