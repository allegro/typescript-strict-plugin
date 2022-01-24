import { getFilePathsWithErrors, getFilePathsWithoutErrors } from './getFilePaths';
import { isIgnoreCommentPresent, isStrictCommentPresent } from '../isCommentPresent';
import { isFileStrictByPath } from '../../common/isFileStrictByPath';
import { file } from 'tmp-promise';
import { insertIgnoreComment, removeStrictComment } from './commentOperations';

interface UpdateStrictCommentsResult {
  updatedFileCount: number;
}

export async function updateStrictComments(
  filePaths: string[],
  configPaths?: string[],
): Promise<UpdateStrictCommentsResult> {
  const filesWithErrors = await getFilePathsWithErrors(filePaths);
  const filesOnPathWithoutErrors = getFilePathsWithoutErrors(
    filePaths,
    filesWithErrors,
    configPaths,
  );

  let updatedFileCount = 0;

  filesOnPathWithoutErrors.forEach((filePath) => {
    if (shouldRemoveStrictComment(filePath, configPaths)) {
      removeStrictComment(filePath);
      updatedFileCount++;
    }
  });

  filesWithErrors.forEach((filePath) => {
    const insertIgnore = shouldInsertIgnoreComment(filePath, configPaths);
    const removeStrict = shouldRemoveStrictComment(filePath, configPaths);

    if (insertIgnore) {
      insertIgnoreComment(filePath);
    }

    if (removeStrict) {
      removeStrictComment(filePath);
    }

    if (removeStrict || insertIgnore) {
      updatedFileCount++;
    }
  });

  return { updatedFileCount };
}

function shouldInsertIgnoreComment(filePath: string, strictPaths?: string[]): boolean {
  return isFileStrictByPath(filePath, strictPaths) && !isIgnoreCommentPresent(filePath);
}

function shouldRemoveStrictComment(filePath: string, strictPaths?: string[]): boolean {
  return isFileStrictByPath(filePath, strictPaths) && isStrictCommentPresent(filePath);
}
