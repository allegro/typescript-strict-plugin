export interface Config {
  paths?: string[];
  strictByDefault?: boolean;
}

export interface StrictFileChecker {
  isFileStrict: (filePath: string) => boolean | Promise<boolean>;
}
