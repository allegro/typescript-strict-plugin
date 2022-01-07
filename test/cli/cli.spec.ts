import execa from 'execa';
import { join } from 'path';

const runInPath = async (path: string, args: string[] = []): Promise<string> => {
  const cwd = process.cwd();
  const cli = join(cwd, 'dist/cli/cli.js');

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
  // given
  const path = process.cwd() + '/test/cli/repository';

  // when
  const stdout = await runInPath(path);

  // then
  expect(stdout).toMatch(/onPath\.ts/i);
  expect(stdout).toMatch(/notOnPathStrict\.ts/i);
  expect(stdout).toMatch(/error TS2322: Type 'null' is not assignable to type 'string'\./i);
  expect(stdout).toMatch(/Found 3 strict files/i);
  expect(stdout).toMatch(/Found 2 errors/i);
});
