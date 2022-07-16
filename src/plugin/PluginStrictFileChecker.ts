import { PluginInfo } from './utils';
import { Config } from '../common/types';
import { isFileStrict } from '../common/isFileStrict';

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
      isCommentPresent: this.isCommentPresent,
      projectPath: this.currentDirectory,
    });
  }

  private isCommentPresent = (comment: string, filePath: string): boolean => {
    const tsStrictComments = this.info.languageService.getTodoComments(filePath, [
      { text: comment, priority: 0 },
    ]);

    return tsStrictComments.length > 0;
  };
}
