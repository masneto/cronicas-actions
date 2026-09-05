import * as core from '@actions/core';
import * as fs from 'fs';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import { run } from '../src/index';

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  setOutput: jest.fn(),
  getInput: jest.fn()
}));
jest.mock('fs');
jest.mock('@actions/github', () => ({
  context: { repo: { owner: 'masneto', repo: 'cronicas-actions' } },
  getOctokit: jest.fn(),
}), { virtual: true });
jest.mock('@actions/exec', () => ({ exec: jest.fn() }));

describe('GitHub Action - Docs Preview Deploy', () => {
  const mockOctokit = {
    rest: {
      actions: {
        listWorkflowRunArtifacts: jest.fn(),
        downloadArtifact: jest.fn(),
      },
      issues: {
        listComments: jest.fn(),
        deleteComment: jest.fn(),
        createComment: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (core.getInput as jest.Mock).mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        artifact_repo: 'masneto/cronicas-actions',
        pr_number: '123',
        artifact_run_id: '456',
        token: 'token',
      };
      return inputs[name];
    });
    (github.getOctokit as jest.Mock).mockReturnValue(mockOctokit);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('<div class="grid"></div>');
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.copyFileSync as jest.Mock).mockImplementation(() => {});
      (fs.readdirSync as jest.Mock).mockReturnValue(['file1.txt', 'file2.txt']);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
    (exec as jest.Mock).mockResolvedValue(0);
  });

  test.skip('Executa fluxo completo de deploy de preview', async () => {
    mockOctokit.rest.actions.listWorkflowRunArtifacts.mockResolvedValue({
      data: { artifacts: [{ name: 'pr-123', id: 1 }] },
    });
    mockOctokit.rest.actions.downloadArtifact.mockResolvedValue({
      data: new ArrayBuffer(8) });
    mockOctokit.rest.issues.listComments.mockResolvedValue({ data: [] });
    mockOctokit.rest.issues.createComment.mockResolvedValue({});

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith(
      'preview-url',
      expect.stringContaining('github.io')
    );
    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalled();
  });

  test('Falha se não encontrar artifact do PR', async () => {
    mockOctokit.rest.actions.listWorkflowRunArtifacts.mockResolvedValue({
      data: { artifacts: [] },
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Artifact pr-123 não encontrado')
    );
  });

  test('Falha com erro inesperado', async () => {
    mockOctokit.rest.actions.listWorkflowRunArtifacts.mockImplementation(() => {
      throw new Error('Erro inesperado');
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Erro inesperado');
  });
});