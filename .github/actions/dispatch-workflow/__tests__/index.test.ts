import * as core from "@actions/core";
import * as github from "@actions/github";

// Mock all modules
jest.mock("@actions/core");
jest.mock("@actions/github");

describe("Dispatch Workflow Action", () => {
  const mockGetInput = core.getInput as jest.Mock;
  const mockSetFailed = core.setFailed as jest.Mock;
  const mockInfo = core.info as jest.Mock;
  const mockCreateWorkflowDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock inputs
    mockGetInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        "workflow-file": "workflow.yml",
        "branch": "feature-temp",
        "inputs-json": '{"param":"value"}',
        "token": "token123",
      };
      return inputs[name];
    });

    // Mock octokit
    (github.getOctokit as jest.Mock).mockReturnValue({
      rest: {
        actions: {
          createWorkflowDispatch: mockCreateWorkflowDispatch.mockResolvedValue({}),
        },
      },
    });
  });

  it("should dispatch workflow successfully", async () => {
    // Mock setTimeout para executar imediatamente
    jest.spyOn(global, "setTimeout").mockImplementation((fn) => {
      fn();
      return 0 as any;
    });

    const { run } = await import("../src/index");
    await run();

    expect(mockCreateWorkflowDispatch).toHaveBeenCalledWith({
      owner: "masneto",
      repo: "cronicas-monitor",
      workflow_id: "workflow.yml",
      ref: "feature-temp",
      inputs: { param: "value" },
    });

    expect(mockInfo).toHaveBeenCalledWith(
      "Workflow workflow.yml disparado na branch feature-temp"
    );
  });

  it("should handle errors properly", async () => {
    const errorMessage = "API Error";
    mockCreateWorkflowDispatch.mockRejectedValueOnce(new Error(errorMessage));

    const { run } = await import("../src/index");
    await run();

    expect(mockSetFailed).toHaveBeenCalledWith(errorMessage);
  });
});
