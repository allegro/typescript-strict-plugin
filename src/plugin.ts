import * as ts from 'typescript/lib/tsserverlibrary';
import { ConfigurationManager } from './configuration';
import { LanguageServiceLogger } from './logger';

export class Plugin {
  private _logger?: LanguageServiceLogger;
  private readonly _configManager = new ConfigurationManager();

  public constructor(private readonly typescript: typeof ts) {}

  public create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    this._logger = new LanguageServiceLogger(info);
    this._configManager.updateFromPluginConfig(info.config);
    this._logger.log(
      'dupa config: ' + JSON.stringify(this._configManager.config),
    );

    if (!isValidTypeScriptVersion(this.typescript)) {
      this._logger.log(
        'Invalid typescript version detected. TypeScript >= 3 required.',
      );
      return info.languageService;
    }

    return this.createProxy(info);
  }

  public createProxy(info: ts.server.PluginCreateInfo): ts.LanguageService {
    const proxy: ts.LanguageService = Object.create(null);

    for (let k of Object.keys(info.languageService)) {
      const x = info.languageService[k];
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    this._logger.log(`info.config: ${info.config}`);

    return {
      ...proxy,
      getCompletionsAtPosition: (fileName, position, options) => {
        const prior = info.languageService.getCompletionsAtPosition(
          fileName,
          position,
          options,
        );

        const oldLength = prior.entries.length;

        // Sample logging for diagnostic purposes
        if (oldLength !== prior.entries.length) {
          const entriesRemoved = oldLength - prior.entries.length;
          info.project.projectService.logger.info(
            `Removed ${entriesRemoved} entries from the completion list`,
          );
        }

        return prior;
      },
    };
  }

  public onConfigurationChanged(config: any) {
    if (this._logger) {
      this._logger.log('onConfigurationChanged');
    }
    this._configManager.updateFromPluginConfig(config);
  }
}

function isValidTypeScriptVersion(typescript: typeof ts): boolean {
  const [major] = typescript.version.split('.');
  return +major >= 3;
}
