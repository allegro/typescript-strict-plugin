import { Config } from '../common/types';
import * as typescript from './typescript/typescript';
import { PLUGIN_NAME } from '../common/constants';

export async function getPluginConfig(): Promise<Config | undefined> {
  const tscConfigRaw = await typescript.showConfig();
  const tscConfig = JSON.parse(tscConfigRaw);
  const plugins = tscConfig?.compilerOptions?.plugins;

  return plugins?.find(
    (plugin: { name: string }) =>
      plugin.name === PLUGIN_NAME ||
      (process.env.NODE_ENV === 'test' && plugin.name === '../../dist/plugin'),
  );
}
