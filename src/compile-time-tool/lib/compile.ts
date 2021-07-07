import { resolve } from 'path';
import * as typescript from './typescript';

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
    '/Users/User/project/src/fileA.ts' => [
      "fileA(10,15): error TS2532: Object is possibly 'undefined'.",
      "fileA(11,15): error TS2532: Object is possibly 'undefined'."
    ],
    '/Users/User/project/src/fileB.ts' => [
      "fileB(14,15): error TS2532: Object is possibly 'undefined'.",
      "fileB(15,15): error TS2532: Object is possibly 'undefined'."
    ]
}
 */
const getPathToErrorsMap = (tscOutput: string[]): Map<string, string[]> => {
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
};

export const compile = async (): Promise<Map<string, string[]>> => {
  let tscOutput: string[] = [];
  try {
    await typescript.compile();
  } catch (error) {
    const { all } = error;
    tscOutput = (all as string).split('\n');
  }

  return getPathToErrorsMap(tscOutput);
};
