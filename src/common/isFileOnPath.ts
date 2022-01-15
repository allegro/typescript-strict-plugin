import { getPosixFilePath } from './utils';
import { getAbsolutePath } from '../cli/CliStrictFileChecker';

export function isFileOnPath(currentFilePath: string, pathToStrictFiles: string): boolean {
  const absolutePathToStrictFiles = getAbsolutePath(process.cwd(), pathToStrictFiles);

  return getPosixFilePath(currentFilePath).startsWith(getPosixFilePath(absolutePathToStrictFiles));
}
