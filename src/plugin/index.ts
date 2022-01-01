import { PluginStrictFileChecker } from './PluginStrictFileChecker';
import { log, PluginInfo, setupProxy, turnOffStrictMode, turnOnStrictMode } from './utils';

const init: ts.server.PluginModuleFactory = () => {
  function create(info: PluginInfo) {
    const proxy = setupProxy(info);
    log(info, 'Plugin initialized');

    proxy.getSemanticDiagnostics = function (filePath) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(filePath);

      if (strictFile) {
        turnOnStrictMode(info, info.project.getCompilerOptions());
      } else {
        turnOffStrictMode(info, info.project.getCompilerOptions());
      }

      return info.languageService.getSemanticDiagnostics(filePath);
    };

    return proxy;
  }

  return { create };
};

module.exports = init;
