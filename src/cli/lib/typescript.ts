import execa from 'execa';

export async function listFilesOnly(): Promise<string> {
  const output = await execa('tsc', ['--listFilesOnly'], {
    all: true,
    preferLocal: true,
  });

  return output.stdout;
}

export async function showConfig(): Promise<string> {
  const output = await execa('tsc', ['--showConfig'], {
    all: true,
    preferLocal: true,
  });

  return output.stdout;
}

export function compile() {
  return execa('tsc', ['--strict', '--noEmit'], { all: true, preferLocal: true });
}
