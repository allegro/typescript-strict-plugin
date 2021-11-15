import { readFileSync } from 'fs';

export const isCommentPresent = (commentText: string, filePath: string): boolean => {
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
};
