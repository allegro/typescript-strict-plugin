import { getPosixFilePath } from '../../common/utils';
import * as typescript from './typescript';
import { CliStrictFileChecker } from './CliStrictFileChecker';

const filterOutNodeModulesFiles = (files: string[]): string[] =>
  files.filter((fileName) => !fileName.includes('/node_modules/'));

const getFilesCheckedByTs = async (): Promise<string[]> => {
  const filesCheckedByTs = await typescript.listFilesOnly();
  const filePaths = filesCheckedByTs.split(/\r?\n/).map(getPosixFilePath);

  return filterOutNodeModulesFiles(filePaths);
};

export const findStrictFiles = async (): Promise<string[]> => {
  const filesCheckedByTS = await getFilesCheckedByTs();

  const cliStrictFileChecker = new CliStrictFileChecker();

  return filesCheckedByTS.filter(
    async (filePath) => await cliStrictFileChecker.isFileStrict(filePath),
  );
};
