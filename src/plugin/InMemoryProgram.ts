import { PluginInfo } from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

export class InMemoryProgram {
  private program: undefined | ts.SemanticDiagnosticsBuilderProgram = undefined;

  constructor(
    private readonly _ts: typeof ts,
    private readonly info: PluginInfo,
  ) {}

  private getSourceFile(fileName: string) {
    // Assume the file is canonicalized and absolute.
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

      // Assume we can ignore the other arguments to these function.
      getSourceFile: (fileName) => this.getSourceFile(fileName),
      getSourceFileByPath: (fileName) => this.getSourceFile(fileName),
    };
    const configFileParsingDiagnostics = currentProgram.getConfigFileParsingDiagnostics();
    const projectReferences = currentProgram.getProjectReferences();

    // Always create a new program since we assume the file has changed if diagnostics are requested.
    this.program = this._ts.createSemanticDiagnosticsBuilderProgram(
      rootFiles,
      options,
      compilerHost,
      this.program,
      configFileParsingDiagnostics,
      projectReferences,
    );

    const strictDiags = this.program.getSemanticDiagnostics(this.getSourceFile(filePath));

    // Assume the diagnostics won't be mutated.
    return strictDiags as ts.Diagnostic[];
  }
}
