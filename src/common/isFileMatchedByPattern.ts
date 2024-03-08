import { getPosixFilePath } from './utils';
import { minimatch } from 'minimatch';

interface IsFileMatchedByPatternParams {
  filePath: string;
  pattern: string;
}

export function isFileMatchedByPattern({
  filePath,
  pattern,
}: IsFileMatchedByPatternParams): boolean {
  return minimatch(getPosixFilePath(filePath), pattern);
}
