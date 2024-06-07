import { PluginStrictFileChecker } from './PluginStrictFileChecker';
import {
  log,
  PluginInfo,
  setupLanguageServiceProxy,
  setupStrictLanguageServiceHostProxy,
} from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

const isDiagnosticChainEquals = (
  a: ts.Diagnostic['messageText'] | undefined,
  b: ts.Diagnostic['messageText'] | undefined,
): boolean => {
  if (a === undefined || b === undefined) {
    return a === b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  } else if (typeof a === 'string' || typeof b === 'string') {
    return false;
  } else {
    const allChainsEqual: boolean =
      a.next?.every((n, i) => isDiagnosticChainEquals(n, b.next?.[i])) ?? a === b;
    return (
      a.category === b.category &&
      a.code === b.code &&
      a.messageText === b.messageText &&
      allChainsEqual
    );
  }
};

const isDiagnosticEquals = (a: ts.Diagnostic, b: ts.Diagnostic) => {
  return (
    a.category == b.category &&
    a.code === b.code &&
    a.source === b.source &&
    a.length === b.length &&
    a.messageText === b.messageText &&
    isDiagnosticChainEquals(a.messageText, b.messageText)
  );
};

const init: ts.server.PluginModuleFactory = () => {
  function create(info: PluginInfo) {
    const proxy = setupLanguageServiceProxy(info);

    const strictLanguageServiceHost = setupStrictLanguageServiceHostProxy(info);
    const strictLanguageService = ts.createLanguageService(strictLanguageServiceHost);

    log(info, 'Plugin initialized');

    proxy.getSemanticDiagnostics = function (filePath) {
      const strictFile = new PluginStrictFileChecker(info).isFileStrict(filePath);

      const convertStrictErrorsToWarnings = !!info?.config?.convertStrictErrorsToWarnings;

      if (strictFile && convertStrictErrorsToWarnings) {
        //To find which errors are strict errors, we check if we find the the same error when we are running nonstrict.
        //If we do not, we can be sure that error only occurs when we run with strict
        const strictDiagnostics = strictLanguageService.getSemanticDiagnostics(filePath);
        const nonStrictDiagnostics = info.languageService.getSemanticDiagnostics(filePath);

        return strictDiagnostics.map((strict) => {
          const isInNonStrict = nonStrictDiagnostics.some((nonStrict) =>
            isDiagnosticEquals(nonStrict, strict),
          );
          if (isInNonStrict || strict.category !== ts.DiagnosticCategory.Error) {
            return strict;
          } else {
            return { ...strict, category: ts.DiagnosticCategory.Warning };
          }
        });
      } else if (strictFile) {
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
