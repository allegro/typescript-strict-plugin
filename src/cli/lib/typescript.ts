import execa from 'execa';

export const listFilesOnly = async (): Promise<string> => {
  const output = await execa('tsc', ['--listFilesOnly'], {
    all: true,
    preferLocal: true,
  });

  return output.stdout;
};

export const showConfig = async (): Promise<string> => {
  const output = await execa('tsc', ['--showConfig'], {
    all: true,
    preferLocal: true,
  });

  return output.stdout;
};

export const compile = () =>
  execa('tsc', ['--strict', '--noEmit', ...process.argv.slice(2)], {
    all: true,
    preferLocal: true,
  });
