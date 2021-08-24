import execa from 'execa';
import path, { join } from 'path';

const runInPath = async (path: string): Promise<string> => {
  const cwd = process.cwd();
  const cli = join(cwd, 'dist', 'compile-time-tool', 'cli.js');

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

test('files are detected correctly', async () => {
  jest.setTimeout(20000);
  const executionPath = path.join(process.cwd(), 'e2e', 'compile-time-tool-tests', 'repository');

  await runInPath(executionPath).then((stdout) => {
    expect(stdout).toMatch(/notOnPath.ts/);
    expect(stdout).toMatch(/onPath.ts/);
    expect(stdout).toMatch(/TS2532: Object is possibly \\?\\?'undefined\\?\\?'/);
    expect(stdout).toMatch(/Found 2 strict files/);
    expect(stdout).toMatch(/2 errors found/);
  });
});
