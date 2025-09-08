import * as core from "@actions/core";
import * as github from "@actions/github";

export async function run() {
  try {
    console.log("[DEBUG] Iniciando dispatch-workflow run()");
    const workflowFile = core.getInput("workflow-file", { required: true });
    const branch = core.getInput("branch", { required: true });
    const inputsJson = core.getInput("inputs-json", { required: true });
    const token = core.getInput("token", { required: true });

    console.log("[DEBUG] Inputs recebidos:", { workflowFile, branch, inputsJson, token: token ? '[OK]' : '[FALTANDO]' });
    const octokit = github.getOctokit(token);
    const owner = "masneto";
    const repo = "cronicas-monitor";

    // Aguarda 10 segundos para garantir indexação
    console.log("[DEBUG] Esperando 10 segundos antes de disparar o workflow...");
    await new Promise((r) => setTimeout(r, 10000));
    console.log("[DEBUG] Espera finalizada");

    const dispatchPayload = {
      owner,
      repo,
      workflow_id: workflowFile,
      ref: branch,
      inputs: JSON.parse(inputsJson),
    };
    console.log("[DEBUG] Payload para createWorkflowDispatch:", dispatchPayload);
    await octokit.rest.actions.createWorkflowDispatch(dispatchPayload);
    core.info(`Workflow ${workflowFile} disparado na branch ${branch}`);
    console.log("[DEBUG] Workflow disparado");
  } catch (error: any) {
    console.log("[DEBUG][ERRO]", error);
    core.setFailed(error.message);
  }
}

run();
