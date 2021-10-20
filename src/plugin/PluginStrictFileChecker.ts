import { PluginInfo } from './utils';
import path from 'path';
import { getPosixFilePath } from '../common/utils';
import { Config, StrictFileChecker } from '../common/types';
import { isFileStrict } from '../common/isFileStrict';

export class PluginStrictFileChecker implements StrictFileChecker {
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
      isFileOnPath: this.isFileOnPath.bind(this),
      isCommentPresent: this.isCommentPresent.bind(this),
    });
  }

  private isFileOnPath(currentFilePath: string, pathToStrictFiles: string) {
    const absolutePathToStrictFiles = getAbsolutePath(this.currentDirectory, pathToStrictFiles);

    return getPosixFilePath(currentFilePath).startsWith(
      getPosixFilePath(absolutePathToStrictFiles),
    );
  }

  private isCommentPresent(comment: string, fileName: string): boolean {
    const tsStrictComments = this.info.languageService.getTodoComments(fileName, [
      { text: comment, priority: 0 },
    ]);

    return tsStrictComments.length > 0;
  }
}

function getAbsolutePath(projectRootPath: string, filePath: string) {
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(projectRootPath, filePath);
}
