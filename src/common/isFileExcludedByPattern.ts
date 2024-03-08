import { isFileMatchedByPattern } from './isFileMatchedByPattern';

interface IsFileExcludedByPathParams {
  filePath: string;
  configExcludePattern?: string[];
}

export function isFileExcludedByPattern({
  filePath,
  configExcludePattern,
}: IsFileExcludedByPathParams): boolean {
  if (configExcludePattern === undefined) {
    return false;
  }

  return configExcludePattern?.some((pattern) =>
    isFileMatchedByPattern({
      filePath,
      pattern,
    }),
  );
}
