import { isFileOnPath } from './isFileOnPath';

interface IsFileExcludedByPathParams {
  filePath: string;
  projectPath?: string;
  configExclude?: string[];
}

export function isFileExcludedByPath({
  filePath,
  projectPath,
  configExclude,
}: IsFileExcludedByPathParams): boolean {
  if (configExclude === undefined) {
    return false;
  }

  return configExclude?.some((path) =>
    isFileOnPath({
      filePath,
      targetPath: path,
      projectPath,
    }),
  );
}
