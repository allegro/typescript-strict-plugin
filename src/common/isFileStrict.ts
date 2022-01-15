import { Config } from './types';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from './constants';
import { isFileOnPath } from './isFileOnPath';

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
  const isFileStrictByPath = strictPaths.some((strictPath) => isFileOnPath(filePath, strictPath));

  if (strictPaths.length > 0 && !isFileStrictByPath) {
    return false;
  }

  return true;
}

export function isFileStrictByPath(filePath: string, strictPaths: string[]) {
  return strictPaths.some((strictPath) => isFileOnPath(filePath, strictPath));
}
