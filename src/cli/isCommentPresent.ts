import { readFileSync } from 'fs';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../common/constants';

export function isCommentPresent(commentText: string, filePath: string): boolean {
  const allLines = readFileSync(filePath).toString().split('\n');
  const comments = allLines.filter((line) => line.startsWith('//'));

  return comments.some((comment) =>
    Array.from(comment)
      .filter((char) => char !== '/')
      .join('')
      .trim()
      .split(' ')
      .includes(commentText),
  );
}

export function isStrictCommentPresent(filePath: string): boolean {
  return isCommentPresent(TS_STRICT_COMMENT, filePath);
}

export function isIgnoreCommentPresent(filePath: string): boolean {
  return isCommentPresent(TS_STRICT_IGNORE_COMMENT, filePath);
}
