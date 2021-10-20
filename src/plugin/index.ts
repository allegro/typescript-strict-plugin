import { PluginStrictFileChecker } from './PluginStrictFileChecker';
import { log, PluginInfo, setupProxy, turnOffStrictMode, turnOnStrictMode } from './utils';

const init: ts.server.PluginModuleFactory = () => {
  function create(info: PluginInfo) {
    const proxy = setupProxy(info);
    log(info, 'Plugin initialized');

    proxy.getSemanticDiagnostics = function (fileName) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(fileName);

      if (strictFile) {
        turnOnStrictMode(info, info.project.getCompilerOptions());
      } else {
        turnOffStrictMode(info, info.project.getCompilerOptions());
      }

      return info.languageService.getSemanticDiagnostics(fileName);
    };

    return proxy;
  }

  return { create };
};

module.exports = init;
