import { InMemoryProgram } from './InMemoryProgram';
import { PluginStrictFileChecker } from './PluginStrictFileChecker';
import { log, PluginInfo, setupProxy, turnOffStrictMode, turnOnStrictMode } from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

const init: ts.server.PluginModuleFactory = (mod) => {
  const ts = mod.typescript;

  function create(info: PluginInfo) {
    const inMemoryProgram = new InMemoryProgram(ts, info);

    const proxy = setupProxy(info);
    log(info, 'Plugin initialized');

    proxy.getSemanticDiagnostics = function (filePath) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(filePath);

      if (strictFile) {
        return inMemoryProgram.getSemanticDiagnostics(filePath);
      } else {
        return info.languageService.getSemanticDiagnostics(filePath);
      }
    };

    return proxy;
  }

  return { create };
};

module.exports = init;
