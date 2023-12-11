import { PluginInfo } from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

export class InMemoryProgram {
  private program: undefined | ts.SemanticDiagnosticsBuilderProgram = undefined;

  constructor(
    private readonly _ts: typeof ts,
    private readonly info: PluginInfo,
  ) {}

  private getSourceFile(
    fileName: string,
    languageVersionOrOptions?: ts.ScriptTarget | ts.CreateSourceFileOptions,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ) {
    const path = fileName as ts.Path;
    const sourceFile = this.info.project.getSourceFile(path);
    return sourceFile;
  }

  public getSemanticDiagnostics(filePath: string): ts.Diagnostic[] {
    const currentProgram = this.info.languageService.getProgram();
    if (!currentProgram) {
      return this.info.languageService.getSemanticDiagnostics(filePath);
    }

    const rootFiles = [...currentProgram.getRootFileNames()];
    const options = { ...currentProgram.getCompilerOptions(), strict: true };
    const compilerHost: ts.CompilerHost = {
      ...this._ts.createCompilerHost(options),
      getSourceFile: (...args) => this.getSourceFile(...args),
      getSourceFileByPath: (fileName, filePath, ...args) => this.getSourceFile(fileName, ...args),
    };
    this.program = this._ts.createSemanticDiagnosticsBuilderProgram(
      rootFiles,
      options,
      compilerHost,
      this.program,
    );

    const strictDiags = this.program.getSemanticDiagnostics(this.getSourceFile(filePath));
    return [...strictDiags];
  }
}
