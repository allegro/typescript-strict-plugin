#!/usr/bin/env node

import { getPluginConfig } from '../cli/CliStrictFileChecker';
import { findStrictFiles } from '../cli/findStrictFiles';
import chalk from 'chalk';
import { updateStrictComments } from './updateStrictComments';
import { waitWithSpinner } from '../cli/waitWithSpinner';
import { notConfiguredError } from '../cli/errors';

(async () => {
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    console.log(chalk.red(notConfiguredError));
    process.exit(1);
    return;
  }

  const configPaths = pluginConfig.paths ?? [];

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  console.log(`🎯 Found ${chalk.bold(String(strictFilePaths.length))} strict files`);

  const { updatedFileCount } = await updateStrictComments(strictFilePaths, configPaths);

  console.log(`🔧 Updated comments in ${updatedFileCount} files`);
})();
