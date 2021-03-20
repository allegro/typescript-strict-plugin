import * as ts_module from 'typescript/lib/tsserverlibrary';
import {
  getProjectRootPath,
  isTsStrictCommentPresent,
  setupProxy,
  turnOffStrictMode,
  turnOnStrictMode,
} from './utils';

function init(): { create: (info: ts.server.PluginCreateInfo) => ts.LanguageService } {
  function create(info: ts_module.server.PluginCreateInfo) {
    function log(name: string, message: string) {
      info.project.projectService.logger.info('dupa ' + name);
      info.project.projectService.logger.info(message);
    }

    const proxy = setupProxy(info);

    proxy.getSemanticDiagnostics = function (fileName) {
      const tsStrictPresent = isTsStrictCommentPresent(info, fileName);
      log('dupa', getProjectRootPath(info));

      if (!tsStrictPresent) {
        return info.languageService.getSemanticDiagnostics(fileName);
      }

      return getDiagnosticsWithStrictMode(info, fileName);
    };

    return proxy;
  }

  function getDiagnosticsWithStrictMode(info: ts_module.server.PluginCreateInfo, fileName: string) {
    const currentOptions = info.project.getCompilerOptions();

    turnOnStrictMode(info, currentOptions);

    const diagnostics = info.languageService.getSemanticDiagnostics(fileName);

    turnOffStrictMode(info, currentOptions);

    return diagnostics;
  }

  return { create };
}

export = init;
