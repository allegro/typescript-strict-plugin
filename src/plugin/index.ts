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
    proxy.cleanupSemanticCache = function () {
      strictLanguageService.cleanupSemanticCache();
      info.languageService.cleanupSemanticCache();
    };
    proxy.dispose = function () {
      strictLanguageService.dispose();
      info.languageService.dispose();
    };
    proxy.getQuickInfoAtPosition = function (filePath, position) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(filePath);

      if (strictFile) {
        return strictLanguageService.getQuickInfoAtPosition(filePath, position);
      } else {
        return info.languageService.getQuickInfoAtPosition(filePath, position);
      }
    };

    return proxy;
  }

  return { create };
};

module.exports = init;
