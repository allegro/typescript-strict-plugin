import { isAbsolute, resolve } from 'path';

export function getAbsolutePath(projectRootPath: string, filePath: string): string {
  if (isAbsolute(filePath)) return filePath;
  return resolve(projectRootPath, filePath);
}
