#!/usr/bin/env node
import chalk from 'chalk';
import { findStrictErrors } from './findStrictErrors';
import yargs from 'yargs';
import { getPluginConfig } from './lib/CliStrictFileChecker';

yargs(process.argv.slice(2)).command(
  '$0',
  "Check for strict files' errors",
  (addYarg) => {
    return addYarg.option('updateComments', {
      type: 'boolean',
      description: 'Adds @ts-strict-ignore comment to files that have at least one strict error',
    });
  },
  async (args) => {
    const pluginConfig = await getPluginConfig();

    if (!pluginConfig) {
      console.log(chalk.red(notConfiguredError));
      process.exit(1);
      return;
    }

    const result = await findStrictErrors({
      updateCommentsFlag: args.updateComments,
      onFoundChangedFiles: (strictFiles) => {
        console.log(`🎯  Found ${chalk.bold(String(strictFiles.length))} strict files`);
      },
      onCheckFile: (file, fileErrors) => {
        if (fileErrors.length > 0) {
          console.log(`❌  ${chalk.bold(file)} failed`);
          console.log(fileErrors.join('\n'));
        }
      },
    });

    if (result.updatedFiles > 0) {
      console.log(`🔧  Updated comments in ${result.updatedFiles} files`);
      return;
    }

    if (result.errors > 0) {
      console.log(`💥  ${result.errors} errors found`);
      return;
    }

    console.log(`🎉  ${chalk.green('All files passed')}`);
  },
).argv;

const notConfiguredError = `typescript-strict-plugin is configured in tsconfig.json
        
Please add following configuration:
{
  "compilerOptions": {
    ...
    "plugins": [{
      "name": "typescript-strict-plugin"
    }]
  },
}
`;
