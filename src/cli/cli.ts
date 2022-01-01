#!/usr/bin/env node

import chalk from 'chalk';
import { findStrictErrors } from './findStrictErrors';
import { getPluginConfig } from './CliStrictFileChecker';
import { findStrictFiles } from './findStrictFiles';
import { waitWithSpinner } from './waitWithSpinner';
import { notConfiguredError } from './errors';

(async () => {
  const pluginConfig = await getPluginConfig();

  if (!pluginConfig) {
    console.log(chalk.red(notConfiguredError));
    process.exit(1);
    return;
  }

  const strictFilePaths = await waitWithSpinner(findStrictFiles, 'Looking for strict files...');

  console.log(`🎯 Found ${chalk.bold(String(strictFilePaths.length))} strict files`);

  const errors = await findStrictErrors(strictFilePaths);

  errors.forEach((error) => {
    console.log(chalk.red(error));
  });

  if (errors.length === 1) {
    console.log(`💥 1 error found`);
    process.exit(1);
    return;
  }

  if (errors.length > 1) {
    console.log(`💥 ${errors.length} errors found`);
    process.exit(1);
    return;
  }

  console.log(`🎉 ${chalk.green('All files passed')}`);
})();
