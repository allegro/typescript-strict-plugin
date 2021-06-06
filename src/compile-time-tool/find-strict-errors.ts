import { findStrictFiles } from './lib/strictFiles';
import { compile } from './lib/compile';

export interface Args {
  onFoundChangedFiles: (changedFiles: string[]) => void;
  onCheckFile: (file: string, hasErrors: boolean) => void;
}

export interface Result {
  success: boolean;
  errors: number;
}

export const findStrictErrors = async (args: Args): Promise<Result> => {
  const { onFoundChangedFiles, onCheckFile } = args;

  const strictFilePaths = await findStrictFiles();

  onFoundChangedFiles(strictFilePaths);

  if (strictFilePaths.length === 0) {
    console.log('No strict files were found');

    return { success: true, errors: 0 };
  }

  const tscErrorMap = await compile();

  const errorCount = strictFilePaths.reduce<number>((currentErrorCount, fileName) => {
    const fileErrors = tscErrorMap.get(fileName) ?? [];
    const errorCount = fileErrors.length;
    const hasErrors = errorCount > 0;

    onCheckFile(fileName, hasErrors);

    hasErrors && console.log(fileErrors.join('\n'));

    return currentErrorCount + errorCount;
  }, 0);

  return {
    success: errorCount === 0,
    errors: errorCount,
  };
};
