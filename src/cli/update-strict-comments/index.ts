#!/usr/bin/env node

import { findStrictFiles } from '../tsc-strict/findStrictFiles';
import chalk from 'chalk';
import { updateStrictComments } from './updateStrictComments';
import { waitWithSpinner } from '../waitWithSpinner';
import { notConfiguredError } from '../errorMessages';
import { pluralize } from '../../common/utils';
import { getPluginConfig } from '../getPluginConfig';

export const run = async () => {
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    console.log(chalk.red(notConfiguredError));
    process.exit(1);
    return;
  }

  const configPaths = pluginConfig.paths ?? [];

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  console.log(
    `🎯 Found ${strictFilePaths.length} strict ${pluralize('file', strictFilePaths.length)}`,
  );

  const { updatedFileCount } = await updateStrictComments(strictFilePaths, configPaths);

  console.log(
    `🔧 Updated comments in ${updatedFileCount} ${pluralize('file', strictFilePaths.length)}`,
  );
};

run();
