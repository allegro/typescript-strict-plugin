import ora from 'ora';
import { findStrictFiles } from './lib/findStrictFiles';
import { compile } from './lib/compile';
import path from 'path';
import { updateFileStrictComments } from './updateFileStrictComments';

export interface Args {
  updateCommentsFlag: boolean | undefined;
  onFoundChangedFiles: (changedFiles: string[]) => void;
  onCheckFile: (file: string, fileErrors: string[]) => void;
}

export interface Result {
  success: boolean;
  errors: number;
  updatedFiles: number;
}

export async function findStrictErrors(args: Args): Promise<Result> {
  const { onFoundChangedFiles, onCheckFile } = args;

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  onFoundChangedFiles(strictFilePaths);

  if (strictFilePaths.length === 0) {
    return { success: true, errors: 0, updatedFiles: 0 };
  }

  const tscErrorMap = await waitWithSpinner(compile, 'Compiling with strict mode...');

  let errorCount = 0;
  let fixedCommentFileCount = 0;

  strictFilePaths.forEach((fileName) => {
    const fileErrors = tscErrorMap.get(path.resolve(fileName)) ?? [];
    const fileErrorCount = fileErrors.length;

    onCheckFile(fileName, fileErrors);

    if (args.updateCommentsFlag && fileErrorCount > 0) {
      updateFileStrictComments(fileName);
      fixedCommentFileCount++;
    }

    errorCount += fileErrorCount;
  });

  return {
    success: errorCount === 0,
    errors: errorCount,
    updatedFiles: fixedCommentFileCount,
  };
}

async function waitWithSpinner<T>(callback: () => Promise<T>, message: string): Promise<T> {
  const spinner = ora(message).start();
  const callbackResult = await callback();
  spinner.stop();

  return callbackResult;
}
