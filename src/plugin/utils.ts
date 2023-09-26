import * as ts from 'typescript/lib/tsserverlibrary';
import { PLUGIN_NAME } from '../common/constants';

export type PluginInfo = ts.server.PluginCreateInfo;

export function turnOnStrictMode(info: PluginInfo): void {
  info.project['compilerOptions'].strict = true;
}

export function turnOffStrictMode(info: PluginInfo): void {
  info.project['compilerOptions'].strict = false;
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
  info.project.projectService.logger.info(`[${PLUGIN_NAME}]: ` + message);
}
