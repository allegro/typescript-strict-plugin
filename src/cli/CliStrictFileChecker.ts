import { isFileStrict } from '../common/isFileStrict';
import { Config } from '../common/types';
import * as typescript from './typescript/typescript';
import { PLUGIN_NAME } from '../common/constants';
import { isAbsolute, resolve } from 'path';
import { readFileSync } from 'fs';

export class CliStrictFileChecker {
  isFileStrict(filePath: string, config: Config): boolean {
    return isFileStrict({
      filePath,
      config,
      isCommentPresent,
    });
  }
}

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

export function isCommentPresent(commentText: string, filePath: string): boolean {
  const allLines = readFileSync(filePath).toString().split('\n');
  const comments = allLines.filter((line) => line.startsWith('//'));

  return comments.some((comment) =>
    Array.from(comment)
      .filter((char) => char !== '/')
      .join('')
      .trim()
      .split(' ')
      .includes(commentText),
  );
}

export function getAbsolutePath(projectRootPath: string, filePath: string): string {
  if (isAbsolute(filePath)) return filePath;
  return resolve(projectRootPath, filePath);
}
