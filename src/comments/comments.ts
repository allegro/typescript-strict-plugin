#!/usr/bin/env node

import { getPluginConfig } from '../cli/CliStrictFileChecker';
import { findStrictFiles } from '../cli/findStrictFiles';
import chalk from 'chalk';
import { updateFileStrictComments } from './updateFileStrictComments';
import { waitWithSpinner } from '../cli/waitWithSpinner';
import { findStrictErrors } from '../cli/findStrictErrors';
import { notConfiguredError } from '../cli/errors';
import { getFilePathFromError } from './getFilePathFromError';

(async () => {
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    console.log(chalk.red(notConfiguredError));
    return;
  }

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  console.log(`🎯  Found ${chalk.bold(String(strictFilePaths.length))} strict files`);

  const errors = await findStrictErrors(strictFilePaths);

  const strictFilesWithErrors = new Set(errors.map(getFilePathFromError));

  strictFilesWithErrors.forEach((filePath) => {
    updateFileStrictComments(filePath, pluginConfig.paths);
  });

  console.log(`🔧 Updated comments in ${strictFilesWithErrors.size} files`);
})();
