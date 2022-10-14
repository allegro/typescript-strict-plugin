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

export function getProjectPathFromArgs(): string | undefined {
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--project') {
      return path.dirname(args[index + 1]);
    }
  }
}
