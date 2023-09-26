import { isFileOnPath } from './isFileOnPath';

interface IsFileStrictByPathParams {
  filePath: string;
  projectPath?: string;
  configPaths?: string[];
}

export function isFileStrictByPath({
  filePath,
  projectPath,
  configPaths,
}: IsFileStrictByPathParams): boolean {
  if (configPaths === undefined) {
    return true;
  }

  return configPaths.some((strictPath) =>
    isFileOnPath({
      filePath,
      targetPath: strictPath,
      projectPath,
    }),
  );
}
