import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "@actions/exec";
import * as fs from "fs";

// Mock all modules
jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("@actions/exec");

describe("Prepare Workflow Action", () => {
  const mockGetInput = core.getInput as jest.Mock;
  const mockSetFailed = core.setFailed as jest.Mock;
  const mockSetOutput = core.setOutput as jest.Mock;
  const mockExec = exec as jest.Mock;
  const mockMkdir = jest.fn();
  const mockCopyFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock inputs
    mockGetInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        "source-file": "python/workflow.yml",
        "branch": "feature",
        "token": "token123",
      };
      return inputs[name];
    });

    // Mock exec to resolve always
    mockExec.mockResolvedValue(0);

    // Mock fs.promises methods
    jest.spyOn(fs.promises, "mkdir").mockImplementation(mockMkdir);
    jest.spyOn(fs.promises, "copyFile").mockImplementation(mockCopyFile);

    // Mock octokit (mesmo não sendo usado diretamente, é importado)
    (github.getOctokit as jest.Mock).mockReturnValue({});
  });

  // it("should prepare workflow successfully", async () => {
  //   const { run } = await import("../src/index");
  //   await run();
  //
  //   // Verifica as operações git
  //   expect(mockExec).toHaveBeenNthCalledWith(1, "git", ["init"]);
  //   expect(mockExec).toHaveBeenNthCalledWith(2, "git", [
  //     "remote",
  //     "add",
  //     "origin",
  //     "https://x-access-token:token123@github.com/masneto/cronicas-monitor.git",
  //   ]);
  //   expect(mockExec).toHaveBeenNthCalledWith(3, "git", ["init"]);
  //   expect(mockExec).toHaveBeenNthCalledWith(4, "git", ["fetch", "origin"]);
  //   expect(mockExec).toHaveBeenNthCalledWith(5, "git", [
  //     "remote",
  //     "add",
  //     "origin",
  //     "https://x-access-token:token123@github.com/masneto/cronicas-monitor.git",
  //   ]);
  //   expect(mockExec).toHaveBeenNthCalledWith(6, "git", [
  //     "checkout",
  //     "-b",
  //     "feature-temp",
  //     "origin/main",
  //   ]);
  //
  //   // Verifica as operações de arquivo
  //   expect(mockMkdir).toHaveBeenCalledWith(".github/workflows", { recursive: true });
  //   expect(mockCopyFile).toHaveBeenCalledWith(
  //     "python/workflow.yml",
  //     ".github/workflows/workflow.yml"
  //   );
  //
  //   // Verifica as configurações git e commit
  // expect(mockExec).toHaveBeenNthCalledWith(7, "git", ["fetch", "origin"]);
  // expect(mockExec).toHaveBeenNthCalledWith(8, "git", ["config", "user.name", "github-actions"]);
  // expect(mockExec).toHaveBeenNthCalledWith(9, "git", ["config", "user.email", "github-actions@github.com"]);
  // expect(mockExec).toHaveBeenNthCalledWith(10, "git", ["add", "."]);
  // expect(mockExec).toHaveBeenNthCalledWith(11, "git", ["commit", "-m", "add workflow workflow.yml"]);
  // expect(mockExec).toHaveBeenNthCalledWith(12, "git", ["push", "origin", "feature-temp", "--force"]);
  //
  //   // Verifica os outputs
  //   expect(mockSetOutput).toHaveBeenCalledWith("workflow-file", "workflow.yml");
  //   expect(mockSetOutput).toHaveBeenCalledWith("temp-branch", "feature-temp");
  // });

  it("should handle git errors properly", async () => {
    mockExec.mockRejectedValueOnce(new Error("git error"));

    const { run } = await import("../src/index");
    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("git error");
  });

  it("should handle filesystem errors properly", async () => {
    mockMkdir.mockRejectedValueOnce(new Error("fs error"));

    const { run } = await import("../src/index");
    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("fs error");
  });
});
