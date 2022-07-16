import { isFileStrictByPath } from '../../common/isFileStrictByPath';
import { getAbsolutePath } from '../../common/getAbsolutePath';
import { findStrictErrors } from '../findStrictErrors';

export const getFilePathsWithErrors = async (allFilePaths: string[]) => {
  const errors = await findStrictErrors(allFilePaths);

  const getFilePathFromErrorMessage = (error: string) =>
    getAbsolutePath(process.cwd(), error.split('(')[0]);

  return [...new Set(errors.map(getFilePathFromErrorMessage))];
};

export const getFilePathsOnPathWithoutErrors = (
  allFilePaths: string[],
  filePathsWithErrors: string[],
  configPaths?: string[],
) =>
  allFilePaths.filter(
    (filePath) =>
      isFileStrictByPath({ filePath, configPaths }) && !filePathsWithErrors.includes(filePath),
  );
