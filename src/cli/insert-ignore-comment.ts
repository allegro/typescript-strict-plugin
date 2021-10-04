import fs from 'fs';
import { TS_STRICT_IGNORE_COMMENT } from '../common/constants';

export const insertIgnoreComment = (fileName: string) => {
  const fileContent = fs.readFileSync(fileName, 'utf8');
  const data = '// ' + TS_STRICT_IGNORE_COMMENT + '\n' + fileContent;
  fs.writeFileSync(fileName, data);
};
