import { Config } from './types';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from './constants';
import { isFileOnPath } from '../cli/CliStrictFileChecker';

type IsFileStrictConfig = {
  filePath: string;
  config: Config;
  isCommentPresent: (comment: string, filePath: string) => boolean;
  isFileOnPath: (currentFilePath: string, pathToStrictFiles: string) => boolean;
};

// Common logic determining whether file is strict or not
export function isFileStrict({
  filePath,
  config,
  isCommentPresent,
  isFileOnPath,
}: IsFileStrictConfig): boolean {
  const { paths: strictPaths = [] } = config;

  if (isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath)) {
    return false;
  }

  if (isCommentPresent(TS_STRICT_COMMENT, filePath)) {
    return true;
  }

  const isFileStrictByPath = strictPaths.some((strictPath) => isFileOnPath(filePath, strictPath));

  if (strictPaths.length > 0 && !isFileStrictByPath) {
    return false;
  }

  return true;
}

export function isFileStrictByPath(filePath: string, strictPaths: string[]) {
  return strictPaths.some((strictPath) => isFileOnPath(filePath, strictPath));
}
