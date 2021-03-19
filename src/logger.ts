export class LanguageServiceLogger {
  constructor(private readonly info: ts.server.PluginCreateInfo) {}

  public log(msg: string) {
    this.info.project.projectService.logger.info(
      `[scoped-typescript-plugin] ${msg}`,
    );
  }
}
