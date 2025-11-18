import { execFile } from 'child_process';

export const isWorkspaceClean = (): Promise<boolean> => {
  return new Promise((resolve) => {
    let isWorkspaceClean = true;
    const childProcess = execFile('git', ['status', '--porcelain'], { cwd: process.cwd() });

    childProcess.stdout?.on('data', () => {
      isWorkspaceClean = false;
    });

    childProcess.on('close', () => {
      resolve(isWorkspaceClean);
    });
  });
};
