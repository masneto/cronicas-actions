import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

export async function run() {
  try {
    console.log("[DEBUG] Iniciando run()");
    const sourceFile = core.getInput("source-file", { required: true });
    const workflowFile = core.getInput("workflow-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const inputsJson = core.getInput("inputs-json", { required: true });
    const token = core.getInput("token", { required: true });

    console.log("[DEBUG] Inputs recebidos:", {
      sourceFile,
      workflowFile,
      branch,
      inputsJson,
      token: token ? "[OK]" : "[FALTANDO]",
    });

    const octokit = github.getOctokit(token);
    const tempBranch = `${branch}-temp`;
    console.log("[DEBUG] tempBranch:", tempBranch);

    // 1. Git init + fetch
    await exec("git", ["init"]);
    console.log("[DEBUG] git init executado");
    const repoUrl = `https://x-access-token:${token}@github.com/masneto/cronicas-monitor.git`;
    // const repoUrl = `https://x-access-token:${token}@github.com/${github.context.repo.owner}/${github.context.repo.repo}.git`;
    console.log("[DEBUG] repoUrl:", repoUrl);
    await exec("git", ["remote", "add", "origin", repoUrl]);
    console.log("[DEBUG] git remote add origin executado");
    await exec("git", ["fetch", "origin"]);
    console.log("[DEBUG] git fetch origin executado");
    await exec("git", ["checkout", "-b", tempBranch, "origin/main"]);
    console.log(
      "[DEBUG] git checkout -b",
      tempBranch,
      "origin/main executado"
    );

    // 2. Move arquivo para workflows
    await fs.promises.mkdir(".github/workflows", { recursive: true });
    console.log("[DEBUG] mkdir .github/workflows executado");
    await fs.promises.copyFile(
      sourceFile,
      `.github/workflows/${workflowFile}`
    );
    console.log(
      "[DEBUG] copyFile",
      sourceFile,
      `.github/workflows/${workflowFile}`
    );

    // 3. Commit e push branch temporária
    await exec("git", ["config", "user.name", "github-actions"]);
    await exec("git", ["config", "user.email", "github-actions@github.com"]);
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", `add workflow ${workflowFile}`]);
    await exec("git", ["push", "origin", tempBranch, "--force"]);
    console.log("[DEBUG] Commit e push executados");

    // 4. Espera 20 segundos
    console.log("[DEBUG] Esperando 20 segundos antes de disparar o workflow...");
    await new Promise((r) => setTimeout(r, 20000));
    console.log("[DEBUG] Espera finalizada");

    // 5. Dispara workflow
    const dispatchPayload = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      workflow_id: workflowFile,
      ref: tempBranch,
      inputs: JSON.parse(inputsJson),
    };
    console.log(
      "[DEBUG] Payload para createWorkflowDispatch:",
      dispatchPayload
    );
    await octokit.rest.actions.createWorkflowDispatch(dispatchPayload);
    core.info(`Workflow ${workflowFile} disparado na branch ${tempBranch}`);
    console.log("[DEBUG] Workflow disparado");

    // 6. Remove a branch temporária
    const deletePayload = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `heads/${tempBranch}`,
    };
    console.log("[DEBUG] Payload para deleteRef:", deletePayload);
    await octokit.rest.git.deleteRef(deletePayload);
    core.info(`Branch temporária ${tempBranch} removida`);
    console.log("[DEBUG] Branch temporária removida");
  } catch (error: any) {
    console.log("[DEBUG][ERRO]", error);
    core.setFailed(error.message);
  }
}

run();