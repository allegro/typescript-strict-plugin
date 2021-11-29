import { getPosixFilePath } from '../../common/utils';
import * as typescript from './typescript';
import { CliStrictFileChecker, getPluginConfig } from './CliStrictFileChecker';

export async function findStrictFiles(): Promise<string[]> {
  const filesCheckedByTS = await getFilesCheckedByTs();

  const cliStrictFileChecker = new CliStrictFileChecker();
  const pluginConfig = await getPluginConfig();

  return filesCheckedByTS.filter((filePath) =>
    cliStrictFileChecker.isFileStrict(filePath, pluginConfig),
  );
}

const filterOutNodeModulesFiles = (files: string[]): string[] => {
  return files.filter((fileName) => !fileName.includes('/node_modules/'));
};

async function getFilesCheckedByTs(): Promise<string[]> {
  const filesCheckedByTs = await typescript.listFilesOnly();
  const filePaths = filesCheckedByTs.split(/\r?\n/).map(getPosixFilePath);

  return filterOutNodeModulesFiles(filePaths);
}
