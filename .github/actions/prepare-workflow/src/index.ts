import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

export async function run() {
  try {
    const sourceFile = core.getInput("source-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const token = core.getInput("token", { required: true });

    const octokit = github.getOctokit(token);
    const tempBranch = `${branch}-temp`;

    await exec("git", ["init"]);
    const repoUrl = `https://x-access-token:${token}@github.com/masneto/cronicas-monitor.git`;
    await exec("git", ["remote", "add", "origin", repoUrl]);
    await exec("git", ["fetch", "origin"]);
    await exec("git", ["checkout", "-b", tempBranch, "origin/main"]);

    await fs.promises.mkdir(".github/workflows", { recursive: true });
    const workflowFileName = sourceFile.split("/").pop()!;
    await fs.promises.copyFile(sourceFile, `.github/workflows/${workflowFileName}`);

    await exec("git", ["config", "user.name", "github-actions"]);
    await exec("git", ["config", "user.email", "github-actions@github.com"]);
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", `add workflow ${workflowFileName}`]);
    await exec("git", ["push", "origin", tempBranch, "--force"]);

    core.setOutput("workflow-file", workflowFileName);
    core.setOutput("temp-branch", tempBranch);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
