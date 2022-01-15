import { isFileStrict } from '../../common/isFileStrict';
import { Config } from '../../common/types';
import { isCommentPresent } from '../isCommentPresent';

export class CliStrictFileChecker {
  isFileStrict(filePath: string, config: Config): boolean {
    return isFileStrict({
      filePath,
      config,
      isCommentPresent,
    });
  }
}
