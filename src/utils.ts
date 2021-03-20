import path from 'path';
import * as ts_module from 'typescript/lib/tsserverlibrary';
import { CompilerOptions } from 'typescript';

const TS_STRICT_COMMENT = '@ts-strict';

export function isTsStrictCommentPresent(
  info: ts_module.server.PluginCreateInfo,
  fileName: string,
): boolean {
  const tsStrictComments = info.languageService.getTodoComments(fileName, [
    { text: TS_STRICT_COMMENT, priority: 0 },
  ]);

  return tsStrictComments.length > 0;
}

export function turnOnStrictMode(
  info: ts_module.server.PluginCreateInfo,
  currentOptions: CompilerOptions,
): void {
  if (!currentOptions.strict) {
    info.project.setCompilerOptions({
      ...currentOptions,
      strict: true,
    });
  }
}

export function turnOffStrictMode(
  info: ts_module.server.PluginCreateInfo,
  currentOptions: CompilerOptions,
): void {
  if (currentOptions.strict) {
    info.project.setCompilerOptions({
      ...currentOptions,
      strict: false,
    });
  }
}

export function setupProxy(info: ts_module.server.PluginCreateInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
    const serviceFunction = info.languageService[k];
    // @ts-ignore
    proxy[k] = (...args: Array<unknown>) => serviceFunction!.apply(info.languageService, args);
  }

  return proxy;
}

export function getProjectRootPath(info: ts_module.server.PluginCreateInfo) {
  return path.dirname(info.project.getProjectName());
}
