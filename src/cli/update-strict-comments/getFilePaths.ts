import { isFileStrictByPath } from '../../common/isFileStrict';
import { getAbsolutePath } from '../../common/getAbsolutePath';

export const getFilePathsFromErrors = (errors: string[]) =>
  new Set(errors.map((error) => getAbsolutePath(process.cwd(), error.split('(')[0])));

export const getFilesOnPathWithoutErrors = (
  filePaths: string[],
  filesWithStrictErrors: Set<string>,
  configPaths: string[],
) =>
  filePaths.filter(
    (filePath) =>
      !isFileStrictByPath(filePath, configPaths) && !filesWithStrictErrors.has(filePath),
  );
