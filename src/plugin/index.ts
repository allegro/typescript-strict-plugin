import { PluginStrictFileChecker } from './PluginStrictFileChecker';
import {
  log,
  PluginInfo,
  setupLanguageServiceProxy,
  setupStrictLanguageServiceHostProxy,
} from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

const init: ts.server.PluginModuleFactory = ({ typescript }) => {
  function create(info: PluginInfo) {
    const proxy = setupLanguageServiceProxy(info);

    const strictLanguageServiceHost = setupStrictLanguageServiceHostProxy(info);
    const strictLanguageService = typescript.createLanguageService(strictLanguageServiceHost);

    log(info, 'Plugin initialized');

    proxy.getSemanticDiagnostics = function (filePath) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(filePath);

      if (strictFile) {
        return strictLanguageService.getSemanticDiagnostics(filePath);
      } else {
        return info.languageService.getSemanticDiagnostics(filePath);
      }
    };

    return proxy;
  }

  return { create };
};

module.exports = init;
