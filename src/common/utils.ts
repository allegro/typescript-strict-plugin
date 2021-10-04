import path from 'path';

export function getPosixFilePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}
