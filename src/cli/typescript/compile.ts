import { resolve } from 'path';
import * as typescript from './typescript';
import { ExecaError } from 'execa';

/**
 * @param tscOutput
 * Converts
 * TscOutput [
 "fileA(10,15): error TS2532: Object is possibly 'undefined'.",
 "fileA(11,15): error TS2532: Object is possibly 'undefined'.",
 "fileB(14,15): error TS2532: Object is possibly 'undefined'.",
 "fileB(15,15): error TS2532: Object is possibly 'undefined'."
 ]
 to:
 Map(2) {
    '/Users/User/project/excluded/fileA.ts' => [
      "fileA(10,15): error TS2532: Object is possibly 'undefined'.",
      "fileA(11,15): error TS2532: Object is possibly 'undefined'."
    ],
    '/Users/User/project/excluded/fileB.ts' => [
      "fileB(14,15): error TS2532: Object is possibly 'undefined'.",
      "fileB(15,15): error TS2532: Object is possibly 'undefined'."
    ]
}
 */
function getPathToErrorsMap(tscOutput: string[]): Map<string, string[]> {
  const result = new Map<string, string[]>();

  tscOutput.forEach((error) => {
    const path = resolve(process.cwd(), error.split('(')[0]);

    if (result.has(path)) {
      result.set(path, [...result.get(path)!, error]);
    } else {
      result.set(path, [error]);
    }
  });

  return result;
}

export async function compile(): Promise<Map<string, string[]>> {
  let tscOutput: string[] = [];
  try {
    await typescript.compile();
  } catch (error) {
    if (isExecaError(error) && error.all) {
      tscOutput = error.all.split(/\r?\n/);
    }
  }

  if (tscOutput.some((it) => it.startsWith('error'))) {
    console.log(`💥 Typescript did not compile due to some errors. Errors: `, tscOutput);
    process.exit(1);
  }

  return getPathToErrorsMap(tscOutput);
}

function isExecaError(error: unknown): error is ExecaError {
  return typeof (error as ExecaError)?.all === 'string';
}
