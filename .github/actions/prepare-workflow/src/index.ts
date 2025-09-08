import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

export async function run() {
  try {
    console.log("[DEBUG] Iniciando prepare-workflow run()");
    const sourceFile = core.getInput("source-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const token = core.getInput("token", { required: true });

    console.log("[DEBUG] Inputs recebidos:", { sourceFile, branch, token: token ? '[OK]' : '[FALTANDO]' });
    const octokit = github.getOctokit(token);
    const tempBranch = `${branch}-temp`;
    console.log("[DEBUG] tempBranch:", tempBranch);

    await exec("git", ["init"]);
    console.log("[DEBUG] git init executado");
    const repoUrl = `https://x-access-token:${token}@github.com/masneto/cronicas-monitor.git`;
    console.log("[DEBUG] repoUrl:", repoUrl);
    await exec("git", ["remote", "add", "origin", repoUrl]);
    console.log("[DEBUG] git remote add origin executado");
    await exec("git", ["fetch", "origin"]);
    console.log("[DEBUG] git fetch origin executado");
    await exec("git", ["checkout", "-b", tempBranch, "origin/main"]);
    console.log("[DEBUG] git checkout -b", tempBranch, "origin/main executado");

    await fs.promises.mkdir(".github/workflows", { recursive: true });
    console.log("[DEBUG] mkdir .github/workflows executado");
    const workflowFileName = sourceFile.split("/").pop()!;
    await fs.promises.copyFile(sourceFile, `.github/workflows/${workflowFileName}`);
    console.log("[DEBUG] copyFile", sourceFile, `.github/workflows/${workflowFileName}`);

    await exec("git", ["config", "user.name", "github-actions"]);
    await exec("git", ["config", "user.email", "github-actions@github.com"]);
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", `add workflow ${workflowFileName}`]);
    await exec("git", ["push", "origin", tempBranch, "--force"]);
    console.log("[DEBUG] Commit e push executados");

    core.setOutput("workflow-file", workflowFileName);
    core.setOutput("temp-branch", tempBranch);
    console.log("[DEBUG] Outputs setados:", { workflowFileName, tempBranch });
  } catch (error: any) {
    console.log("[DEBUG][ERRO]", error);
    core.setFailed(error.message);
  }
}

run();
