import execa, { ExecaError } from 'execa';

export const showConfig = async (): Promise<string> => {
  const output = await execa('tsc', [...process.argv.slice(2), '--showConfig'], {
    all: true,
    preferLocal: true,
  });

  return output.stdout;
};

let compilerOutputCache = '';
export const compile = async (): Promise<string> => {
  if (compilerOutputCache) {
    return compilerOutputCache;
  }

  try {
    const compilerResult = await execa(
      'tsc',
      [...process.argv.slice(2), '--strict', '--noEmit', '--pretty', 'false', '--listFiles'],
      {
        all: true,
        preferLocal: true,
      },
    );

    compilerOutputCache = compilerResult.stdout;
  } catch (error) {
    if (isExecaError(error) && error.all) {
      if (wasCompileAborted(error)) {
        console.log(`💥 Typescript task was aborted. Full error log: `, error.all);
        process.exit(error.exitCode);
      }

      compilerOutputCache = error.all;
    }
  }

  return compilerOutputCache;
};

function isExecaError(error: unknown): error is ExecaError {
  return typeof (error as ExecaError)?.all === 'string';
}

function wasCompileAborted(error: ExecaError): boolean {
  return error.signal === 'SIGABRT' || error.exitCode === 134;
}
