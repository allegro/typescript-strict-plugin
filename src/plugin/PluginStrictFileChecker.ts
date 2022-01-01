import { PluginInfo } from './utils';
import { getPosixFilePath } from '../common/utils';
import { Config } from '../common/types';
import { isFileStrict } from '../common/isFileStrict';
import path from 'path';

export class PluginStrictFileChecker {
  private readonly currentDirectory: string;
  private readonly config: Config;

  public constructor(private readonly info: PluginInfo) {
    this.currentDirectory = info.project.getCurrentDirectory();
    this.config = info.config as Config;
  }

  public isFileStrict(filePath: string): boolean {
    return isFileStrict({
      filePath,
      config: this.config,
      isFileOnPath: this.isFileOnPath,
      isCommentPresent: this.isCommentPresent,
    });
  }

  private isFileOnPath = (currentFilePath: string, pathToStrictFiles: string) => {
    const absolutePathToStrictFiles = this.getAbsolutePath(
      this.currentDirectory,
      pathToStrictFiles,
    );

    return getPosixFilePath(currentFilePath).startsWith(
      getPosixFilePath(absolutePathToStrictFiles),
    );
  };

  private isCommentPresent = (comment: string, filePath: string): boolean => {
    const tsStrictComments = this.info.languageService.getTodoComments(filePath, [
      { text: comment, priority: 0 },
    ]);

    return tsStrictComments.length > 0;
  };

  private getAbsolutePath(projectRootPath: string, filePath: string) {
    if (path.isAbsolute(filePath)) return filePath;
    return path.resolve(projectRootPath, filePath);
  }
}
