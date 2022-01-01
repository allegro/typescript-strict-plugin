import { compile } from './typescript/compile';
import path from 'path';
import { waitWithSpinner } from './waitWithSpinner';

export async function findStrictErrors(strictPaths: string[]): Promise<string[]> {
  if (strictPaths.length === 0) {
    return [];
  }

  const tscErrorMap = await waitWithSpinner(compile, 'Compiling with strict mode...');

  return strictPaths.flatMap((filePath) => {
    return tscErrorMap.get(path.resolve(filePath)) ?? [];
  });
}
