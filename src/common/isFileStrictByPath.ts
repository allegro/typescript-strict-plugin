import { isFileOnPath } from './isFileOnPath';

export const isFileStrictByPath = (filePath: string, configPaths?: string[]): boolean => {
  if (configPaths === undefined) {
    return true;
  }

  return configPaths?.some((strictPath) => isFileOnPath(filePath, strictPath));
};
