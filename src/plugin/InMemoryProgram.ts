import { PluginInfo } from './utils';
import * as ts from 'typescript/lib/tsserverlibrary';

/**
 * djb2 hashing algorithm
 * http://www.cse.yorku.ca/~oz/hash.html
 */
function generateDjb2Hash(data: string): string {
  let acc = 5381;
  for (let i = 0; i < data.length; i++) {
    acc = (acc << 5) + acc + data.charCodeAt(i);
  }
  return acc.toString();
}

export class InMemoryProgram {
  private host: undefined | ts.CompilerHost = undefined;
  private program: undefined | ts.SemanticDiagnosticsBuilderProgram = undefined;

  constructor(
    private readonly _ts: typeof ts,
    private readonly info: PluginInfo,
  ) {}

  private getSourceFile(
    fileName: string,
    languageVersionOrOptions?: ts.ScriptTarget | ts.CreateSourceFileOptions,
  ) {
    // Assume the file is canonicalized and absolute.
    const path = fileName as ts.Path;
    let sourceFile = this.info.project.getSourceFile(path);

    // This case occurs when trying to resolve .d.ts outputs of project references.
    if (!sourceFile && languageVersionOrOptions) {
      sourceFile = this.host?.getSourceFile(fileName, languageVersionOrOptions);

      if (sourceFile) {
        // SemanticDiagnosticBuilder requires that the file has a version.
        // We use the same hashing function that is used in the TypeScript repo as fallback.
        (sourceFile as ts.SourceFile & { version: string }).version = generateDjb2Hash(
          sourceFile.text,
        );
      }
    }

    return sourceFile;
  }

  public getSemanticDiagnostics(filePath: string): ts.Diagnostic[] {
    const currentProgram = this.info.languageService.getProgram();
    if (!currentProgram) {
      return this.info.languageService.getSemanticDiagnostics(filePath);
    }

    const rootFiles = [...currentProgram.getRootFileNames()];
    const options = { ...currentProgram.getCompilerOptions(), strict: true };
    this.host = this._ts.createCompilerHost(options);
    const compilerHost: ts.CompilerHost = {
      ...this.host,

      // Assume we can ignore the other arguments to these function.
      getSourceFile: (fileName, languageVersionOrOptions) =>
        this.getSourceFile(fileName, languageVersionOrOptions),
      getSourceFileByPath: (fileName, path, languageVersionOrOptions) =>
        this.getSourceFile(fileName, languageVersionOrOptions),
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
