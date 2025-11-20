import { isFileStrictByPath } from '../../common/isFileStrictByPath';
import { getAbsolutePath } from '../../common/getAbsolutePath';
import { findStrictErrors } from '../findStrictErrors';

export const getFilePathsWithErrors = async (allFilePaths: string[]) => {
  const errors = await findStrictErrors(allFilePaths);
  console.log(errors);

  const getFilePathFromErrorMessage = (error: string) => {
    const match = error.match(/^(.*?)(?=\(\d+,\d+\))/);
    const beforePattern = match ? match[1] : error;
    return getAbsolutePath(process.cwd(), beforePattern);
  };

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
