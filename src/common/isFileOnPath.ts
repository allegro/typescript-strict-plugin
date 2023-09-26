import { getPosixFilePath } from './utils';
import { getAbsolutePath } from './getAbsolutePath';
import { getProjectPathFromArgs } from './utils';

interface IsFileOnPathParams {
  filePath: string;
  targetPath: string;
  projectPath?: string;
}

export function isFileOnPath({
  filePath,
  targetPath,
  projectPath = getProjectPathFromArgs() ?? process.cwd(),
}: IsFileOnPathParams): boolean {
  if (!projectPath) {
    return false;
  }

  const absolutePathToStrictFiles = getAbsolutePath(projectPath, targetPath);

  return getPosixFilePath(filePath).startsWith(getPosixFilePath(absolutePathToStrictFiles));
}
