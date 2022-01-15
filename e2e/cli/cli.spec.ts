import execa from 'execa';
import { join } from 'path';
import { fixtureWithDefaultConfig } from '../fixtures/paths';

const runInPath = async (path: string, args: string[] = []): Promise<string> => {
  const cwd = process.cwd();
  const cli = join(cwd, 'dist/tsc-strict/tsc-strict.js');

  process.chdir(path);
  return execa('node', [cli, ...args], {
    env: {
      //the assertions break in an environment that supports color
      //override chalk color detection https://github.com/chalk/supports-color/blob/master/index.js
      FORCE_COLOR: 'false',
    },
  })
    .then((response) => {
      return response.stdout;
    })
    .catch((error) => error.stdout)
    .finally(() => process.chdir(cwd));
};

it('should detect strict file errors', async () => {
  //given
  const { projectPath, filePaths } = fixtureWithDefaultConfig;

  // when
  const stdout = await runInPath(projectPath);

  // then
  expect(stdout).toEqual(expect.stringContaining(filePaths.strict));
  expect(stdout).not.toEqual(expect.stringContaining(filePaths.ignored));
  expect(stdout).toMatch(/error TS2322: Type 'null' is not assignable to type 'string'\./i);
  expect(stdout).toMatch(/Found 1 strict file/i);
  expect(stdout).toMatch(/Found 1 error/i);
});
