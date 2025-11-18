import { readFileSync, writeFileSync } from 'fs';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../common/constants';

export const insertIgnoreComment = (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf-8');
  const data = '// ' + TS_STRICT_IGNORE_COMMENT + '\n' + fileContent;

  writeFileSync(filePath, data);
};

const removeComment = (filePath: string, comment: string) => {
  const fileContent = readFileSync(filePath, 'utf-8');

  const data = fileContent
    .split('\n')
    .filter((line) => !line.includes(comment))
    .join('\n');

  if (data !== fileContent) {
    writeFileSync(filePath, data);
  }
};

export const removeIgnoreComment = (filePath: string) => {
  removeComment(filePath, TS_STRICT_IGNORE_COMMENT);
};

export const removeStrictComment = (filePath: string) => {
  removeComment(filePath, TS_STRICT_COMMENT);
};
