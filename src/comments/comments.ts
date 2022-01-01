#!/usr/bin/env node

import { getPluginConfig, isFileOnPath } from '../cli/CliStrictFileChecker';
import { findStrictFiles } from '../cli/findStrictFiles';
import chalk from 'chalk';
import { updateIgnoreComment, updateStrictComment } from './updateFileStrictComments';
import { waitWithSpinner } from '../cli/waitWithSpinner';
import { findStrictErrors } from '../cli/findStrictErrors';
import { notConfiguredError } from '../cli/errors';
import { getFilePathFromError } from './getFilePathFromError';
import { isFileStrictByPath } from '../common/isFileStrict';

(async () => {
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    console.log(chalk.red(notConfiguredError));
    return;
  }

  const strictPaths = pluginConfig.paths ?? [];

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  console.log(`🎯 Found ${chalk.bold(String(strictFilePaths.length))} strict files`);

  const errors = await findStrictErrors(strictFilePaths);

  const strictFilePathsWithErrors = new Set(errors.map(getFilePathFromError));

  strictFilePaths
    .filter((filePath) => isFileStrictByPath(filePath, strictPaths))
    .filter((filePath) => !strictFilePathsWithErrors.has(filePath))
    .forEach((filePath) => updateStrictComment(filePath, strictPaths));

  strictFilePathsWithErrors.forEach((filePath) => {
    updateStrictComment(filePath, strictPaths);
    updateIgnoreComment(filePath, strictPaths);
  });

  console.log(`🔧 Updated comments in ${strictFilePathsWithErrors.size} files`);
})();
