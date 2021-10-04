#!/usr/bin/env node
import chalk from 'chalk';
import { findStrictErrors } from './find-strict-errors';

const run = async (): Promise<void> => {
  const result = await findStrictErrors({
    onFoundChangedFiles: (strictFiles) => {
      console.log(`🎯  Found ${chalk.bold(String(strictFiles.length))} strict files`);
    },
    onCheckFile: (file, hasError) =>
      hasError
        ? console.log(`❌  ${chalk.bold(file)} failed`)
        : console.log(`✅  ${chalk.bold(file)} passed`),
  });

  if (result.errors) {
    console.log(`💥  ${result.errors} errors found`);
    process.exit(1);
  } else {
    console.log(`🎉  ${chalk.green('All files passed')}`);
  }
};

run();
