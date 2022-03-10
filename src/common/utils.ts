import path from 'path';
import fs from 'fs';

export function getPosixFilePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

export function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}

export function isFile(path: string) {
  try {
    const stats = fs.statSync(path);

    return stats.isFile();
  } catch {
    return false;
  }
}
