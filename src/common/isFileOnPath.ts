import { getPosixFilePath } from './utils';
import { getAbsolutePath } from './getAbsolutePath';

interface IsFileOnPathParams {
  filePath: string;
  targetPath: string;
  projectPath?: string;
}

export function isFileOnPath({
  filePath,
  targetPath,
  projectPath = process.cwd(),
}: IsFileOnPathParams): boolean {
  const absolutePathToStrictFiles = getAbsolutePath(projectPath, targetPath);

  return getPosixFilePath(filePath).startsWith(getPosixFilePath(absolutePathToStrictFiles));
}
