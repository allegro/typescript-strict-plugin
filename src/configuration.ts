export interface PluginConfiguration {
  readonly tags: ReadonlyArray<string>;
  readonly validate: boolean;
  readonly lint: { [key: string]: any };
  readonly emmet: { [key: string]: any };
}

export class ConfigurationManager {
  private static readonly defaultConfiguration: PluginConfiguration = {
    tags: ['styled', 'css', 'extend', 'injectGlobal', 'createGlobalStyle'],
    validate: true,
    lint: {
      emptyRules: 'ignore',
    },
    emmet: {},
  };

  // @ts-ignore
  private readonly _configUpdatedListeners = new Set<() => void>();

  public get config(): PluginConfiguration {
    return this._configuration;
  }
  private _configuration: PluginConfiguration =
    ConfigurationManager.defaultConfiguration;

  public updateFromPluginConfig(config: PluginConfiguration) {
    // @ts-ignore
    const lint = Object.assign(
      {},
      ConfigurationManager.defaultConfiguration.lint,
      config.lint || {},
    );

    this._configuration = {
      tags: config.tags || ConfigurationManager.defaultConfiguration.tags,
      validate:
        typeof config.validate !== 'undefined'
          ? config.validate
          : ConfigurationManager.defaultConfiguration.validate,
      lint,
      emmet: config.emmet || ConfigurationManager.defaultConfiguration.emmet,
    };

    for (const listener of this._configUpdatedListeners) {
      listener();
    }
  }

  public onUpdatedConfig(listener: () => void) {
    this._configUpdatedListeners.add(listener);
  }
}
