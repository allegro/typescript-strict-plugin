import { Config, PluginInfo } from './utils';
import path from 'path';
import { TS_STRICT_COMMENT } from '../common/constants';
import { getPosixFilePath } from '../common/utils';

export class StrictFileChecker {
  private readonly currentDirectory: string;

  public constructor(private readonly info: PluginInfo) {
    this.currentDirectory = info.project.getCurrentDirectory();
  }

  public isFileStrict(filePath: string): boolean {
    const { paths: pathsToTurnOnStrictMode = [] } = this.info.config as Config;

    if (this.isTsStrictCommentPresent(filePath)) {
      return true;
    }

    return pathsToTurnOnStrictMode.some((strictPath) => this.isFileOnPath(filePath, strictPath));
  }

  private isFileOnPath(currentFilePath: string, pathToStrictFiles: string) {
    const absolutePathToStrictFiles = getAbsolutePath(this.currentDirectory, pathToStrictFiles);

    return getPosixFilePath(currentFilePath).startsWith(getPosixFilePath(absolutePathToStrictFiles));
  }

  private isTsStrictCommentPresent(fileName: string): boolean {
    const tsStrictComments = this.info.languageService.getTodoComments(fileName, [
      { text: TS_STRICT_COMMENT, priority: 0 },
    ]);

    return tsStrictComments.length > 0;
  }
}

function getAbsolutePath(projectRootPath: string, filePath: string) {
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(projectRootPath, filePath);
}
