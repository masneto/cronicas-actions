import * as core from "@actions/core";
import * as github from "@actions/github";

export async function run() {
  try {
    const workflowFile = core.getInput("workflow-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const inputsJson = core.getInput("inputs-json", { required: true });
    const token = core.getInput("token", { required: true });

    const octokit = github.getOctokit(token);
    const owner = "masneto";
    const repo = "cronicas-monitor";

    // Aguarda 10 segundos para garantir indexação
    await new Promise((r) => setTimeout(r, 10000));

    await octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowFile,
      ref: branch,
      inputs: JSON.parse(inputsJson),
    });
    core.info(`Workflow ${workflowFile} disparado na branch ${branch}`);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
