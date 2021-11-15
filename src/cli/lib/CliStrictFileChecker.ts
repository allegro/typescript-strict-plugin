import { isFileStrict } from '../../common/isFileStrict';
import { Config } from '../../common/types';
import * as typescript from './typescript';
import { PLUGIN_NAME } from '../../common/constants';
import { getPosixFilePath } from '../../common/utils';
import { isAbsolute, resolve } from 'path';
import { isCommentPresent } from './isCommentPresent';

export class CliStrictFileChecker {
  isFileStrict(filePath: string, config: Config): boolean {
    return isFileStrict({
      filePath,
      config,
      isFileOnPath: this.isFileOnPath,
      isCommentPresent,
    });
  }

  getPluginConfig = async (): Promise<Config> => {
    const tscConfigRaw = await typescript.showConfig();
    const tscConfig = JSON.parse(tscConfigRaw);
    const plugins = tscConfig?.compilerOptions?.plugins;

    return plugins?.find((plugin: { name: string }) => plugin.name === PLUGIN_NAME);
  };

  private isFileOnPath = (currentFilePath: string, pathToStrictFiles: string): boolean => {
    const absolutePathToStrictFiles = this.getAbsolutePath(process.cwd(), pathToStrictFiles);

    return getPosixFilePath(currentFilePath).startsWith(
      getPosixFilePath(absolutePathToStrictFiles),
    );
  };

  private getAbsolutePath = (projectRootPath: string, filePath: string): string => {
    if (isAbsolute(filePath)) return filePath;
    return resolve(projectRootPath, filePath);
  };
}
