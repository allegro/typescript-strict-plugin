import execa from 'execa';
import { join } from 'path';

describe('cli', () => {
  const runInPath = async (path: string, args: string[] = []): Promise<string> => {
    const cwd = process.cwd();
    const cliPath = join(cwd, 'dist/cli/cli.js');

    process.chdir(path);
    return execa('node', [cliPath, ...args], {
      env: {
        //the assertions break in an environment that supports color
        //override chalk color detection https://github.com/chalk/supports-color/blob/master/index.js
        FORCE_COLOR: 'false',
      },
    })
      .then((response) => response.stdout)
      .catch((error) => error.stdout)
      .finally(() => process.chdir(cwd));
  };

  it('files are detected correctly', async () => {
    // given
    const path = process.cwd() + '/test/cli/repository';

    // when
    const stdout = await runInPath(path, []);

    // then
    expect(stdout).toMatch(/notOnPath.ts/);
    expect(stdout).toMatch(/onPath.ts/);
    expect(stdout).toMatch(/TS2532: Object is possibly 'undefined'/);
    expect(stdout).toMatch(/Found 2 strict files/);
    expect(stdout).toMatch(/2 errors found/);
  }, 30000);

  it('files apply command line arguments to tsc', async () => {
    // given
    const path = process.cwd() + '/test/cli/repository';

    // when
    const stdout = await runInPath(path, ['--strictNullChecks', 'false']);

    // then
    expect(stdout).toMatch(/All files passed/);
  }, 30000);

  it('should not compile with wrong tsc arguments', async () => {
    // given
    const path = process.cwd() + '/test/cli/repository';

    // when
    const stdout = await runInPath(path, ['--strictNullChecks', 'notExistentValue']);

    // then
    expect(stdout).toMatch(/Typescript did not compile/);
  }, 30000);
});
