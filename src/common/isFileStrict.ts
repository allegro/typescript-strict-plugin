import { Config } from './types';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from './constants';

type IsFileStrictConfig = {
  filePath: string;
  config: Config;
  isCommentPresent: (comment: string, filePath: string) => boolean;
  isFileOnPath: (currentFilePath: string, pathToStrictFiles: string) => boolean;
};

export function isFileStrict({
  filePath,
  config,
  isCommentPresent,
  isFileOnPath,
}: IsFileStrictConfig): boolean {
  const { paths: pathsToTurnOnStrictMode = [], strictByDefault = false } = config;

  if (isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath)) {
    return false;
  }

  if (isCommentPresent(TS_STRICT_COMMENT, filePath)) {
    return true;
  }

  const isFileStrictByPath = pathsToTurnOnStrictMode.some((strictPath) =>
    isFileOnPath(filePath, strictPath),
  );

  if (isFileStrictByPath) {
    return true;
  }

  if (strictByDefault) {
    return true;
  }

  return false;
}
