import { readFileSync, writeFileSync } from 'fs';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../../common/constants';

export function insertIgnoreComment(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const data = '// ' + TS_STRICT_IGNORE_COMMENT + '\n' + fileContent;

  writeFileSync(filePath, data);
}

export function removeStrictComment(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf-8');

  const data = fileContent
    .split('\n')
    .filter((line) => !line.includes(TS_STRICT_COMMENT))
    .join('\n');

  if (data !== fileContent) {
    writeFileSync(filePath, data);
  }
}
