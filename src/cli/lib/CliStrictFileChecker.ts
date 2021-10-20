import { isFileStrict } from '../../common/isFileStrict';
import { Config, StrictFileChecker } from '../../common/types';
import * as typescript from './typescript';
import { PLUGIN_NAME } from '../../common/constants';
import fs from 'fs';
import { getPosixFilePath } from '../../common/utils';
import { isAbsolute, resolve } from 'path';

const COMMENT_START = '//';

export class CliStrictFileChecker implements StrictFileChecker {
  async isFileStrict(filePath: string): Promise<boolean> {
    const config = await this.getPluginConfig();

    return isFileStrict({
      filePath,
      config,
      isFileOnPath: this.isFileOnPath,
      isCommentPresent: this.isCommentPresent,
    });
  }

  async getPluginConfig(): Promise<Config> {
    const tscConfigRaw = await typescript.showConfig();
    const tscConfig = JSON.parse(tscConfigRaw);
    const plugins = tscConfig?.compilerOptions?.plugins;

    return plugins?.find((plugin: any) => plugin.name === PLUGIN_NAME);
  }

  private isCommentPresent(commentText: string, filePath: string): boolean {
    const allLines = fs.readFileSync(filePath).toString().split('\n');
    const comments = allLines.filter((line) => line.startsWith(COMMENT_START));

    return comments.some((comment) =>
      Array.from(comment)
        .filter((char) => char !== '/')
        .join('')
        .trim()
        .split(' ')
        .includes(commentText),
    );
  }

  private isFileOnPath(currentFilePath: string, pathToStrictFiles: string): boolean {
    const absolutePathToStrictFiles = this.getAbsolutePath(process.cwd(), pathToStrictFiles);

    return getPosixFilePath(currentFilePath).startsWith(
      getPosixFilePath(absolutePathToStrictFiles),
    );
  }

  private getAbsolutePath(projectRootPath: string, filePath: string): string {
    if (isAbsolute(filePath)) return filePath;
    return resolve(projectRootPath, filePath);
  }
}
