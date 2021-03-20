import { PluginInfo, setupProxy, turnOffStrictMode, turnOnStrictMode } from './utils';
import { StrictFileChecker } from './strictFiles';

function init(): { create: (info: PluginInfo) => ts.LanguageService } {
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
    const currentOptions = info.project.getCompilerOptions();

    turnOnStrictMode(info, currentOptions);

    const diagnostics = info.languageService.getSemanticDiagnostics(fileName);

    turnOffStrictMode(info, currentOptions);

    return diagnostics;
  }

  return { create };
}

export = init;
