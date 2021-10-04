#!/usr/bin/env node
import chalk from 'chalk';
import { findStrictErrors } from './find-strict-errors';
import yargs from 'yargs';

yargs(process.argv.slice(2)).command(
  '$0',
  "Check for strict files' errors",
  (addYarg) => {
    return addYarg.option('init', {
      type: 'boolean',
      description: 'Adds @ts-strict-ignore comment to files that have at least one strict error',
    });
  },
  async (args) => {
    const result = await findStrictErrors({
      insertIgnoreComment: args.init,
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
  },
).argv;
