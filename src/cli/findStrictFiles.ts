import { getPosixFilePath, isFile } from '../common/utils';
import * as typescript from './typescript/typescript';
import { CliStrictFileChecker } from './CliStrictFileChecker';
import { getPluginConfig } from './getPluginConfig';
import { Config } from '../common/types';

export async function findStrictFiles(): Promise<string[]> {
  const filesCheckedByTS = await getFilesCheckedByTs();

  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    return [];
  }

  return getStrictFilePaths(filesCheckedByTS, pluginConfig);
}

export const getStrictFilePaths = (filePaths: string[], config: Config): string[] => {
  const cliStrictFileChecker = new CliStrictFileChecker();
  return filePaths.filter((filePath) => cliStrictFileChecker.isFileStrict(filePath, config));
};

const filterOutNodeModulesFiles = (files: string[]): string[] => {
  return files.filter((filePath) => !filePath.includes('/node_modules/'));
};

export async function getFilesCheckedByTs(): Promise<string[]> {
  const filesCheckedByTs = await typescript.compile();
  const filePaths = filesCheckedByTs.split(/\r?\n/).filter(isFile).map(getPosixFilePath);

  return filterOutNodeModulesFiles(filePaths);
}
