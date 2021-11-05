import execa from 'execa';
import { join } from 'path';

const runInPath = async (path: string): Promise<string> => {
  const cwd = process.cwd();
  const cli = join(cwd, 'dist/cli/cli.js');

  process.chdir(path);
  return execa('node', [cli], {
    env: {
      //the assertions break in an environment that supports color
      //override chalk color detection https://github.com/chalk/supports-color/blob/master/index.js
      FORCE_COLOR: 'false',
    },
  })
    .then((response) => {
      console.log('Response', response);
      return response.stdout;
    })
    .catch((error) => error.stdout)
    .finally(() => process.chdir(cwd));
};

it('files are detected correctly', async () => {
  // given
  const path = process.cwd() + '/test/cli/repository';

  // when
  const stdout = await runInPath(path);

  // then
  expect(stdout).toMatch(/notOnPath.ts/);
  expect(stdout).toMatch(/onPath.ts/);
  expect(stdout).toMatch(/TS2532: Object is possibly 'undefined'/);
  expect(stdout).toMatch(/Found 2 strict files/);
  expect(stdout).toMatch(/2 errors found/);
}, 30000);
