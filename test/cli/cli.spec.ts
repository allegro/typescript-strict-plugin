import execa from 'execa';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

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
  expect(stdout).toMatch(/onPath.ts/);
  expect(stdout).toMatch(/TS2322: Type 'null' is not assignable to type 'string'/);
  expect(stdout).toMatch(/Found 3 strict files/);
  expect(stdout).toMatch(/2 errors found/);
});

describe('with --updateComments flag', () => {
  let repositoryPath: string;

  let strictFilePath: string;
  let initialStrictFileContent: string;

  let noStrictErrorsFilePath: string;
  let initialNoStrictErrorsFilePath: string;

  beforeEach(async () => {
    repositoryPath = process.cwd() + '/test/cli/repository';

    strictFilePath = join(repositoryPath, 'src', 'notOnPathStrict.ts');
    initialStrictFileContent = await readFile(strictFilePath, 'utf-8');

    noStrictErrorsFilePath = join(repositoryPath, 'lib', 'onPathNoStrictErrors.ts');
    initialNoStrictErrorsFilePath = await readFile(noStrictErrorsFilePath, 'utf-8');
  });

  afterEach(async () => {
    await writeFile(strictFilePath, initialStrictFileContent, 'utf-8');
    await writeFile(strictFilePath, initialNoStrictErrorsFilePath, 'utf-8');
  });

  it('should append @ts-strict-ignore comment to files with errors', async () => {
    // when
    await runInPath(repositoryPath, ['--updateComments']);

    // then
    const file = await readFile(strictFilePath, 'utf-8');

    expect(file).toContain('// @ts-strict-ignore\n');
  });

  it('should leave files without strict errors as is', async () => {
    // when
    await runInPath(repositoryPath, ['--updateComments']);

    // then
    const file = await readFile(noStrictErrorsFilePath, 'utf-8');

    expect(file).not.toContain('// @ts-strict-ignore\n');
  });

  it('should remove @ts-strict comment from files with errors', async () => {
    // when
    await runInPath(repositoryPath, ['--updateComments']);

    // then
    const file = await readFile(strictFilePath, 'utf-8');

    expect(file).not.toContain('// @ts-strict\n');
  });
});
