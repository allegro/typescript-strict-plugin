import path from 'path';

export function getPosixFilePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

export function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}
