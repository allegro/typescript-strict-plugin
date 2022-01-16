import { Config } from './types';
import { isFileStrictByPath } from './isFileStrictByPath';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from './constants';

type IsFileStrictConfig = {
  filePath: string;
  config?: Config;
  isCommentPresent: (comment: string, filePath: string) => boolean;
};

// Common logic determining whether file is strict or not
export function isFileStrict({ filePath, config, isCommentPresent }: IsFileStrictConfig): boolean {
  if (isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath)) {
    return false;
  }

  if (isCommentPresent(TS_STRICT_COMMENT, filePath)) {
    return true;
  }

  const strictPaths = config?.paths ?? [];

  if (strictPaths.length > 0 && !isFileStrictByPath(filePath, strictPaths)) {
    return false;
  }

  return true;
}
