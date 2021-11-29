import ora from 'ora';
import { findStrictFiles } from './lib/findStrictFiles';
import { compile } from './lib/compile';
import path from 'path';
import { updateFileStrictComments } from './updateFileStrictComments';

export interface Args {
  updateCommentsFlag: boolean | undefined;
  onFoundChangedFiles: (changedFiles: string[]) => void;
  onCheckFile: (file: string, hasErrors: boolean) => void;
}

export interface Result {
  success: boolean;
  errors: number;
}

export async function findStrictErrors(args: Args): Promise<Result> {
  const { onFoundChangedFiles, onCheckFile } = args;

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  onFoundChangedFiles(strictFilePaths);

  if (strictFilePaths.length === 0) {
    return { success: true, errors: 0 };
  }

  const tscErrorMap = await waitWithSpinner(compile, 'Compiling with strict mode...');

  const errorCount = strictFilePaths.reduce<number>((currentErrorCount, fileName) => {
    const fileErrors = tscErrorMap.get(path.resolve(fileName)) ?? [];
    const errorCount = fileErrors.length;
    const hasErrors = errorCount > 0;

    onCheckFile(fileName, hasErrors);

    if (hasErrors) {
      console.log(fileErrors.join('\n'));
    }

    if (args.updateCommentsFlag && hasErrors) {
      updateFileStrictComments(fileName);
    }

    return currentErrorCount + errorCount;
  }, 0);

  return {
    success: errorCount === 0,
    errors: errorCount,
  };
}

async function waitWithSpinner<T>(callback: () => Promise<T>, message: string): Promise<T> {
  const spinner = ora(message).start();
  const callbackResult = await callback();
  spinner.stop();

  return callbackResult;
}
