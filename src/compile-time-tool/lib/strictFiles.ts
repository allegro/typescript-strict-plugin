import {
  filterFilesWithStrictComment,
  getStrictFilePaths,
  isFileOnStrictPath,
} from './strictFilesUtils';
import * as typescript from './typescript';

const filterNodeModulesFiles = (files: string[]): string[] =>
  files.filter((fileName) => !fileName.includes('/node_modules/'));

const getFilesCheckedByTs = async (): Promise<string[]> => {
  const filesCheckedByTs = await typescript.listFilesOnly();

  return filterNodeModulesFiles(filesCheckedByTs.split('\n'));
};

export const findStrictFiles = async (): Promise<string[]> => {
  const strictPaths = await getStrictFilePaths();
  const filesCheckedByTS = await getFilesCheckedByTs();
  const filesWithTsStrictComment = filterFilesWithStrictComment(filesCheckedByTS);
  const filesOnStrictPath = filesCheckedByTS.filter((fileName) => {
    return strictPaths.some((strictPath) => isFileOnStrictPath(fileName, strictPath));
  });

  return Array.from(new Set([...filesWithTsStrictComment, ...filesOnStrictPath]));
};
