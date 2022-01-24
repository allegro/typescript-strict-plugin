import ora from 'ora';

export async function waitWithSpinner<T>(callback: () => Promise<T>, message: string): Promise<T> {
  const spinner = ora(message).start();
  const callbackResult = await callback();
  spinner.stop();

  return callbackResult;
}
