import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../common/constants';
import { isCommentPresent } from '../cli/CliStrictFileChecker';
import { findStrictErrors } from '../cli/findStrictErrors';
import { getFilePathsFromErrors, getFilesOnPathWithoutErrors } from './getFilePaths';
import { readFileSync, writeFileSync } from 'fs';
import { isFileOnPath } from '../common/isFileOnPath';

interface UpdateStrictCommentsResult {
  updatedFileCount: number;
}

export async function updateStrictComments(
  filePaths: string[],
  configPaths: string[],
): Promise<UpdateStrictCommentsResult> {
  const errors = await findStrictErrors(filePaths);

  const filesWithStrictErrors = getFilePathsFromErrors(errors);
  const filesOnPathWithoutErrors = getFilesOnPathWithoutErrors(
    filePaths,
    filesWithStrictErrors,
    configPaths,
  );

  let updatedFileCount = 0;

  filesOnPathWithoutErrors.forEach((filePath) => {
    const updated = removeStrictCommentIfNotNecessary(filePath, configPaths);

    if (updated) {
      updatedFileCount++;
    }
  });

  filesWithStrictErrors.forEach((filePath) => {
    const removedStrict = removeStrictCommentIfNotNecessary(filePath, configPaths);
    const insertedIgnore = insertIgnoreCommentIfNotPresent(filePath, configPaths);

    if (removedStrict || insertedIgnore) {
      updatedFileCount++;
    }
  });

  return { updatedFileCount };
}

function insertIgnoreCommentIfNotPresent(filePath: string, strictPaths: string[]): boolean {
  const isFileStrictByPath = strictPaths?.some((strictPath) => isFileOnPath(filePath, strictPath));

  const ignoreCommentPresent = isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath);
  if (isFileStrictByPath && !ignoreCommentPresent) {
    insertIgnoreComment(filePath);
    return true;
  }

  return false;
}

function removeStrictCommentIfNotNecessary(filePath: string, strictPaths: string[]): boolean {
  const isFileStrictByPath = strictPaths?.some((strictPath) => isFileOnPath(filePath, strictPath));

  const strictCommentPresent = isCommentPresent(TS_STRICT_COMMENT, filePath);
  if (isFileStrictByPath && strictCommentPresent) {
    deleteStrictComment(filePath);
    return true;
  }

  return false;
}

function insertIgnoreComment(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const data = '// ' + TS_STRICT_IGNORE_COMMENT + '\n' + fileContent;

  writeFileSync(filePath, data);
}

function deleteStrictComment(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');

  const data = fileContent
    .split('\n')
    .filter((line) => !line.includes(TS_STRICT_COMMENT))
    .join('\n');

  writeFileSync(filePath, data);
}
