import { getPosixFilePath } from '../../common/utils';
import { filterFilesWithComment, getStrictFilePaths, isFileOnStrictPath } from './strictFilesUtils';
import * as typescript from './typescript';
import { TS_STRICT_COMMENT, TS_STRICT_IGNORE_COMMENT } from '../../common/constants';

const filterOutNodeModulesFiles = (files: string[]): string[] =>
  files.filter((fileName) => !fileName.includes('/node_modules/'));

const getFilesCheckedByTs = async (): Promise<string[]> => {
  const filesCheckedByTs = await typescript.listFilesOnly();
  const filePaths = filesCheckedByTs.split(/\r?\n/).map(getPosixFilePath);

  return filterOutNodeModulesFiles(filePaths);
};

export const findStrictFiles = async (): Promise<string[]> => {
  const strictPaths = (await getStrictFilePaths()).map(getPosixFilePath);
  const filesCheckedByTS = await getFilesCheckedByTs();

  const filesWithTsStrictComment = filterFilesWithComment(TS_STRICT_COMMENT, filesCheckedByTS);
  const ignoredFiles = filterFilesWithComment(TS_STRICT_IGNORE_COMMENT, filesCheckedByTS);

  const filesOnStrictPath = filesCheckedByTS.filter((fileName) => {
    return strictPaths.some((strictPath) => isFileOnStrictPath(fileName, strictPath));
  });

  const strictFiles = [...filesWithTsStrictComment, ...filesOnStrictPath].filter(
    (fileName) => !ignoredFiles.includes(fileName),
  );

  return Array.from(new Set([...strictFiles]));
};
