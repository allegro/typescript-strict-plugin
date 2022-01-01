import { getAbsolutePath } from '../cli/CliStrictFileChecker';

export const getFilePathFromError = (error: string) =>
  getAbsolutePath(process.cwd(), error.split('(')[0]);
