import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

// Mock all modules
jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("@actions/exec");

describe("Workflow Dispatcher Action", () => {
  const mockGetInput = core.getInput as jest.Mock;
  const mockSetFailed = core.setFailed as jest.Mock;
  const mockInfo = core.info as jest.Mock;
  const mockExec = exec as jest.Mock;
  const mockMkdir = jest.fn();
  const mockCopyFile = jest.fn();

  const mockCreateWorkflowDispatch = jest.fn();
  const mockDeleteRef = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock inputs
    mockGetInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        "source-file": "source.yml",
        "workflow-file": "target.yml",
        "branch": "main",
        "inputs-json": '{"foo":"bar"}',
        "token": "token123",
      };
      return inputs[name];
    });

    // Mock exec to resolve always
    mockExec.mockResolvedValue(0);

    // Mock apenas os métodos necessários de fs.promises
    jest.spyOn(fs.promises, "mkdir").mockImplementation(mockMkdir);
    jest.spyOn(fs.promises, "copyFile").mockImplementation(mockCopyFile);

    // Mock octokit
    (github.getOctokit as jest.Mock).mockReturnValue({
      rest: {
        actions: {
          createWorkflowDispatch: mockCreateWorkflowDispatch.mockResolvedValue({}),
        },
        git: {
          deleteRef: mockDeleteRef.mockResolvedValue({}),
        },
      },
    });

    // Mock repo context
    (github.context as any).repo = {
      owner: "owner",
      repo: "repo",
    };
  });

  it("should run the workflow dispatcher successfully", async () => {
    // Mock setTimeout para executar imediatamente
    jest.spyOn(global, "setTimeout").mockImplementation((fn) => {
      fn();
      return 0 as any;
    });
    const { run } = await import("../src/index");
    await run();
    // Checa a ordem das chamadas
    expect(mockExec).toHaveBeenNthCalledWith(1, "git", ["init"]);
    expect(mockExec).toHaveBeenNthCalledWith(2, "git", [
      "remote",
      "add",
      "origin",
      "https://x-access-token:token123@github.com/owner/repo.git",
    ]);
    expect(mockExec).toHaveBeenNthCalledWith(3, "git", ["fetch", "origin"]);
    expect(mockExec).toHaveBeenNthCalledWith(4, "git", [
      "checkout",
      "-b",
      "main-temp",
      "origin/main",
    ]);
    expect(mockMkdir).toHaveBeenCalledWith(".github/workflows", { recursive: true });
    expect(mockCopyFile).toHaveBeenCalledWith("source.yml", ".github/workflows/target.yml");
    expect(mockExec).toHaveBeenNthCalledWith(5, "git", ["config", "user.name", "github-actions"]);
    expect(mockExec).toHaveBeenNthCalledWith(6, "git", ["config", "user.email", "github-actions@github.com"]);
    expect(mockExec).toHaveBeenNthCalledWith(7, "git", ["add", "."]);
    expect(mockExec).toHaveBeenNthCalledWith(8, "git", ["commit", "-m", "add workflow target.yml"]);
    expect(mockExec).toHaveBeenNthCalledWith(9, "git", ["push", "origin", "main-temp", "--force"]);
    expect(mockCreateWorkflowDispatch).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      workflow_id: "target.yml",
      ref: "main-temp",
      inputs: { foo: "bar" },
    });
    expect(mockDeleteRef).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      ref: "heads/main-temp",
    });
    expect(mockInfo).toHaveBeenCalledWith("Workflow target.yml disparado na branch main-temp");
    expect(mockInfo).toHaveBeenCalledWith("Branch temporária main-temp removida");
  });

  it("should setFailed on error", async () => {
    mockExec.mockRejectedValueOnce(new Error("git error"));
    const { run } = await import("../src/index");
    await run();
    // Aguarda o flush de todas as promises
    await new Promise(process.nextTick);
    expect(mockSetFailed).toHaveBeenCalledWith("git error");
  });
});