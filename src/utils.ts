import * as ts_module from 'typescript/lib/tsserverlibrary';
import { CompilerOptions } from 'typescript';

export interface Config {
  paths?: string[];
}

export type PluginInfo = ts_module.server.PluginCreateInfo;

export function turnOnStrictMode(info: PluginInfo, currentOptions: CompilerOptions): void {
  if (!currentOptions.strict) {
    info.project.setCompilerOptions({
      ...currentOptions,
      strict: true,
    });
  }
}

export function turnOffStrictMode(info: PluginInfo, currentOptions: CompilerOptions): void {
  if (currentOptions.strict) {
    info.project.setCompilerOptions({
      ...currentOptions,
      strict: false,
    });
  }
}

export function setupProxy(info: PluginInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
    const serviceFunction = info.languageService[k];
    // @ts-ignore
    proxy[k] = (...args: Array<unknown>) => serviceFunction!.apply(info.languageService, args);
  }

  return proxy;
}

export function log(info: PluginInfo, message: string) {
  info.project.projectService.logger.info('[strict-typescript-plugin]: ' + message);
}
