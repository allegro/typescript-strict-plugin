import * as ts from 'typescript/lib/tsserverlibrary';
import { PLUGIN_NAME } from '../common/constants';

export type PluginInfo = ts.server.PluginCreateInfo;

export function setupLanguageServiceProxy(info: PluginInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
    const serviceFunction = info.languageService[k];
    // @ts-ignore
    proxy[k] = (...args: Array<unknown>) => serviceFunction!.apply(info.languageService, args);
  }

  return proxy;
}

export function setupStrictLanguageServiceHostProxy(info: PluginInfo): ts.LanguageServiceHost {
  const host = info.languageServiceHost;
  const strictGetCompilationSettings = () => {
    const settings = info.languageServiceHost.getCompilationSettings();
    return { ...settings, strict: true };
  };
  const proxy = new Proxy(host, {
    get(target, prop, receiver) {
      if (prop === 'getCompilationSettings') {
        return strictGetCompilationSettings;
      }
      return Reflect.get(target, prop, receiver);
    },
  });
  return proxy;
}

export function log(info: PluginInfo, message: string) {
  info.project.projectService.logger.info(`[${PLUGIN_NAME}]: ` + message);
}
