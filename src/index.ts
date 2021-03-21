import { PluginInfo, setupProxy, turnOffStrictMode, turnOnStrictMode } from './utils';
import { StrictFileChecker } from './strictFiles';

const init: ts.server.PluginModuleFactory = () => {
  function create(info: PluginInfo) {
    const proxy = setupProxy(info);

    proxy.getSemanticDiagnostics = function (fileName) {
      const strictFile = new StrictFileChecker(info).isFileStrict(fileName);

      if (strictFile) {
        return getDiagnosticsWithStrictMode(info, fileName);
      }

      return info.languageService.getSemanticDiagnostics(fileName);
    };

    return proxy;
  }

  function getDiagnosticsWithStrictMode(info: PluginInfo, fileName: string) {
    turnOnStrictMode(info, info.project.getCompilerOptions());

    const diagnostics = info.languageService.getSemanticDiagnostics(fileName);

    turnOffStrictMode(info, info.project.getCompilerOptions());

    return diagnostics;
  }

  return { create };
};

module.exports = init;
