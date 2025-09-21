import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";
import * as path from "path";

export async function run() {
  try {
    // 1. Inputs e contexto
  const artifactRepo = core.getInput("artifact_repo");
  const prNumber = core.getInput("pr_number");
  const artifactRunId = core.getInput("artifact_run_id");
  const token = core.getInput("token", { required: true });
  const { owner, repo } = github.context.repo;
  console.log("[DEBUG] Inputs:", { artifactRepo, prNumber, artifactRunId, owner, repo });

    // 2. Checkout e preparação do branch gh-pages
    core.startGroup('Checkout e preparação do branch gh-pages');
    console.log("[DEBUG] Fetching and checking out gh-pages branch...");
    await exec("git", ["fetch", "origin", "gh-pages:gh-pages"], { ignoreReturnCode: true });
    await exec("git", ["checkout", "gh-pages"], { ignoreReturnCode: true });
    if (!fs.existsSync(".git/refs/heads/gh-pages")) {
      console.log("[DEBUG] gh-pages branch não existe, criando...");
      await exec("git", ["checkout", "--orphan", "gh-pages"]);
      fs.writeFileSync("index.html", "");
      await exec("git", ["add", "index.html"]);
      await exec("git", ["commit", "-m", "Initialize gh-pages branch"]);
      await exec("git", ["push", "origin", "gh-pages"]);
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
    const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({
      owner: artifactOwner,
      repo: artifactRepoName,
      run_id: parseInt(artifactRunId),
    });
    console.log("[DEBUG] Artifacts encontrados:", artifacts.data.artifacts.map(a => a.name));
    const match = artifacts.data.artifacts.find(a => a.name === `pr-${prNumber}`);
    if (!match) throw new Error(`Artifact pr-${prNumber} não encontrado`);
    console.log("[DEBUG] Baixando artifact id:", match.id);
    const download = await octokit.rest.actions.downloadArtifact({
      owner: artifactOwner,
      repo: artifactRepoName,
      artifact_id: match.id,
      archive_format: "zip",
    });
    const zipPath = path.join(artifactDir, "artifact.zip");
    fs.writeFileSync(zipPath, Buffer.from(download.data as ArrayBuffer));
    await exec("unzip", ["-o", zipPath, "-d", artifactDir]);
    core.endGroup();

    // 4. Copiar conteúdo do artifact para pasta do PR
    core.startGroup('Copiando conteúdo do artifact para pasta do PR');
    const targetDir = `./${path.basename(artifactRepo)}/pr-${prNumber}`;
    fs.mkdirSync(targetDir, { recursive: true });
    console.log("[DEBUG] Copiando arquivos do artifact para:", targetDir);
    // Copiar arquivos do artifactDir para targetDir recursivamente
    const copyRecursiveSync = (src: string, dest: string) => {
      if (!fs.existsSync(src)) return;
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
          const srcFile = path.join(src, file);
          const destFile = path.join(dest, file);
          copyRecursiveSync(srcFile, destFile);
        }
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    copyRecursiveSync(artifactDir, targetDir);
    core.endGroup();

    // 5. Atualizar index.html com card do PR
    core.startGroup('Atualizando index.html com card do PR');
    const indexFile = "index.html";
    let indexContent = "";
    if (fs.existsSync(indexFile)) {
      indexContent = fs.readFileSync(indexFile, "utf-8");
      console.log("[DEBUG] index.html existente carregado");
    } else {
      // Busca index.template.html do branch main se não existir
      try {
        await exec("git", ["fetch", "origin", "main:index-template"], { ignoreReturnCode: true });
        await exec("git", ["checkout", "index-template", "--", "index.template.html"], { ignoreReturnCode: true });
        if (fs.existsSync("index.template.html")) {
          fs.copyFileSync("index.template.html", indexFile);
          indexContent = fs.readFileSync(indexFile, "utf-8");
          console.log("[DEBUG] index.template.html copiado para index.html");
        } else {
          indexContent = "<div class=\"grid\"></div>";
          console.log("[DEBUG] Nenhum template encontrado, usando grid vazio");
        }
      } catch (e) {
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
    } else {
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
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", `Update preview for PR #${prNumber}`], { ignoreReturnCode: true });
    await exec("git", ["push", "origin", "gh-pages"]);
    core.endGroup();

    // 7. Comentar no PR
    const previewUrl = `https://${owner}.github.io/${repo}/${path.basename(artifactRepo)}/pr-${prNumber}/`;
    console.log("[DEBUG] Preview URL:", previewUrl);
    // Remover comentários antigos do PR que não são do bot
    core.startGroup('Removendo comentários antigos do PR');
    const prOwner = artifactRepo.split("/")[0];
    const prRepo = artifactRepo.split("/")[1];
    const comments = await octokit.rest.issues.listComments({
      owner: prOwner,
      repo: prRepo,
      issue_number: parseInt(prNumber),
    });
    console.log("[DEBUG] Comentários encontrados:", comments.data.length);
    for (const comment of comments.data) {
      const user = comment.user?.login || "";
      if (user !== "github-actions[bot]" && user !== "copilot[bot]") {
        try {
          await octokit.rest.issues.deleteComment({
            owner: prOwner,
            repo: prRepo,
            comment_id: comment.id,
          });
          core.info(`Comentário ${comment.id} de ${user} removido.`);
        } catch (e) {
          core.warning(`Falha ao remover comentário ${comment.id}: ${e}`);
        }
      }
    }
    core.endGroup();
    // Postar novo comentário
    core.startGroup('Postando comentário de preview no PR');
    await octokit.rest.issues.createComment({
      owner: prOwner,
      repo: prRepo,
      issue_number: parseInt(prNumber),
      body: `🚀 **Preview disponível!**\n\n📖 [Documentação](${previewUrl})`,
    });
    console.log("[DEBUG] Comentário de preview postado no PR");
    core.endGroup();
    core.setOutput("preview-url", previewUrl);
  } catch (err: any) {
    core.setFailed(err.message);
  }
}

if (require.main === module) {
  run();
}
