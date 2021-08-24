import { isAbsolute, resolve } from 'path';
import fs from 'fs';
import * as typescript from './typescript';
import { PLUGIN_NAME, TS_STRICT_COMMENT } from '../../common/constants';
import { getPosixFilePath } from '../../common/utils';

const COMMENT_START = '//';

const getAbsolutePath = (projectRootPath: string, filePath: string) => {
  if (isAbsolute(filePath)) return filePath;
  return resolve(projectRootPath, filePath);
};

export const isFileOnStrictPath = (currentFilePath: string, pathToStrictFiles: string) => {
  const absolutePathToStrictFiles = getAbsolutePath(process.cwd(), pathToStrictFiles);

  return getPosixFilePath(currentFilePath).startsWith(getPosixFilePath(absolutePathToStrictFiles));
};

export const getStrictFilePaths = async (): Promise<string[]> => {
  const tscConfigRaw = await typescript.showConfig();
  const tscConfig = JSON.parse(tscConfigRaw);
  const plugins = tscConfig?.compilerOptions?.plugins;

  return plugins?.find((plugin: any) => plugin.name === PLUGIN_NAME)?.paths ?? [];
};

export const filterFilesWithStrictComment = (filesCheckedByTS: string[]) => {
  return filesCheckedByTS.filter((fileName) => {
    const allLines = fs.readFileSync(fileName).toString().split('\n');
    const comments = allLines.filter((line) => line.startsWith(COMMENT_START));

    return comments.some((comment) =>
      Array.from(comment)
        .filter((char) => char !== '/')
        .join('')
        .trim()
        .startsWith(TS_STRICT_COMMENT),
    );
  });
};
