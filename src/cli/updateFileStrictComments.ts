import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../common/constants';
import { readFileSync, writeFileSync } from 'fs';
import { isCommentPresent } from './lib/CliStrictFileChecker';

export async function updateFileStrictComments(fileName: string) {
  const strictCommentPresent = isCommentPresent(TS_STRICT_COMMENT, fileName);
  if (strictCommentPresent) {
    deleteStrictComment(fileName);
  }

  const ignoreCommentPresent = isCommentPresent(TS_STRICT_IGNORE_COMMENT, fileName);
  if (!ignoreCommentPresent) {
    insertIgnoreComment(fileName);
  }
}

function insertIgnoreComment(fileName: string) {
  const fileContent = readFileSync(fileName, 'utf-8');
  const data = '// ' + TS_STRICT_IGNORE_COMMENT + '\n' + fileContent;

  writeFileSync(fileName, data);
}

function deleteStrictComment(fileName: string) {
  const fileContent = readFileSync(fileName, 'utf-8');

  const data = fileContent
    .split('\n')
    .filter((line) => !line.includes(TS_STRICT_COMMENT))
    .join('\n');

  writeFileSync(fileName, data);
}
