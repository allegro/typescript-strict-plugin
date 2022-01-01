import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../common/constants';
import { readFileSync, writeFileSync } from 'fs';
import { getAbsolutePath, isCommentPresent, isFileOnPath } from '../cli/CliStrictFileChecker';
import { getPosixFilePath } from '../common/utils';

export async function updateIgnoreComment(filePath: string, strictPaths: string[]) {
  const isFileStrictByPath = strictPaths?.some((strictPath) => isFileOnPath(filePath, strictPath));

  const ignoreCommentPresent = isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath);
  if (isFileStrictByPath && !ignoreCommentPresent) {
    insertIgnoreComment(filePath);
  }
}

export async function updateStrictComment(filePath: string, strictPaths: string[]) {
  const isFileStrictByPath = strictPaths?.some((strictPath) => isFileOnPath(filePath, strictPath));

  const strictCommentPresent = isCommentPresent(TS_STRICT_COMMENT, filePath);
  if (isFileStrictByPath && strictCommentPresent) {
    deleteStrictComment(filePath);
  }
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
