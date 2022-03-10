import { getPosixFilePath, isFile } from '../common/utils';
import * as typescript from './typescript/typescript';
import { CliStrictFileChecker } from './CliStrictFileChecker';
import { getPluginConfig } from './getPluginConfig';

export async function findStrictFiles(): Promise<string[]> {
  const filesCheckedByTS = await getFilesCheckedByTs();

  const cliStrictFileChecker = new CliStrictFileChecker();
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    return [];
  }

  return filesCheckedByTS.filter((filePath) =>
    cliStrictFileChecker.isFileStrict(filePath, pluginConfig),
  );
}

const filterOutNodeModulesFiles = (files: string[]): string[] => {
  return files.filter((filePath) => !filePath.includes('/node_modules/'));
};

async function getFilesCheckedByTs(): Promise<string[]> {
  const filesCheckedByTs = await typescript.compile();
  const filePaths = filesCheckedByTs.split(/\r?\n/).filter(isFile).map(getPosixFilePath);

  return filterOutNodeModulesFiles(filePaths);
}
