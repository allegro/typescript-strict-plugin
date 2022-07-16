import { getDiagnostics } from './utils/getDiagnostics';
import { fixtureWithDefaultConfig, fixtureWithPathConfig } from '../fixtures/paths';

describe('single file diagnostics', () => {
  it('should enable strict mode by default in project without config', async () => {
    // given
    const { projectPath, filePaths } = fixtureWithDefaultConfig;

    // when
    const diagnostics = await getDiagnostics(projectPath, filePaths.strict);

    // then
    expect(diagnostics).toHaveLength(1);
  });

  it('should not enable strict mode in ignored file', async () => {
    // given
    const { projectPath, filePaths } = fixtureWithDefaultConfig;

    // when
    const diagnostics = await getDiagnostics(projectPath, filePaths.ignored);

    // then
    expect(diagnostics).toHaveLength(0);
  });

  it('should not enable strict mode when file is not on path', async () => {
    // given
    const { projectPath, filePaths } = fixtureWithPathConfig;

    // when
    const diagnostics = await getDiagnostics(projectPath, filePaths.excluded);

    // then
    expect(diagnostics).toHaveLength(0);
  });

  it('should enable strict mode when file is not on path and contains strict comment', async () => {
    // given
    const { projectPath, filePaths } = fixtureWithPathConfig;

    // when
    const diagnostics = await getDiagnostics(projectPath, filePaths.excludedWithStrictComment);

    // then
    expect(diagnostics).toHaveLength(1);
  });

  it('should enable strict mode with a relative path config', async () => {
    // given
    const { projectPath, filePaths } = fixtureWithPathConfig;

    // when
    const diagnosticsIncluded = await getDiagnostics(projectPath, filePaths.included);
    const diagnosticsExcluded = await getDiagnostics(projectPath, filePaths.excluded);

    // then
    expect(diagnosticsIncluded).toHaveLength(1);
    expect(diagnosticsExcluded).toHaveLength(0);
  });
});
