import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

export async function run() {
  try {
    const sourceFile = core.getInput("source-file", { required: true });
    const workflowFile = core.getInput("workflow-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const inputsJson = core.getInput("inputs-json", { required: true });
    const token = core.getInput("token", { required: true });

    const octokit = github.getOctokit(token);
    const tempBranch = `${branch}-temp`;

    // 1. Git init + fetch
    await exec("git", ["init"]);
    // Corrigido: monta a URL do repositório com token
    const repoUrl = `https://x-access-token:${token}@github.com/${github.context.repo.owner}/${github.context.repo.repo}.git`;
    await exec("git", ["remote", "add", "origin", repoUrl]);
    await exec("git", ["fetch", "origin"]);
    await exec("git", ["checkout", "-b", tempBranch, "origin/main"]);

    // 2. Move arquivo para workflows
    await fs.promises.mkdir(".github/workflows", { recursive: true });
    await fs.promises.copyFile(sourceFile, `.github/workflows/${workflowFile}`);

    // 3. Commit e push branch temporária
    await exec("git", ["config", "user.name", "github-actions"]);
    await exec("git", ["config", "user.email", "github-actions@github.com"]);
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", `add workflow ${workflowFile}`]);
    await exec("git", ["push", "origin", tempBranch, "--force"]);

    // 4. Espera 20 segundos
    await new Promise((r) => setTimeout(r, 20000));

    // 5. Dispara workflow
    await octokit.rest.actions.createWorkflowDispatch({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      workflow_id: workflowFile,
      ref: tempBranch,
      inputs: JSON.parse(inputsJson),
    });

    core.info(`Workflow ${workflowFile} disparado na branch ${tempBranch}`);

    // 6. Remove a branch temporária
    await octokit.rest.git.deleteRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `heads/${tempBranch}`,
    });

    core.info(`Branch temporária ${tempBranch} removida`);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}