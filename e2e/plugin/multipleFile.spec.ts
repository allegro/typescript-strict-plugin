import { getMultipleDiagnostics } from './utils/getMultipleDiagnostics';
import { fixtureWithDefaultConfig, fixtureWithPathConfig } from '../fixtures/paths';

it('should show errors only on file with strict comment', async () => {
  // given
  const { projectPath, filePaths } = fixtureWithDefaultConfig;
  const fileList = [filePaths.strict, filePaths.ignored];

  // when
  const diagnostics = await getMultipleDiagnostics(projectPath, fileList);

  // then
  expect(diagnostics[0]).toHaveLength(1);
  expect(diagnostics[1]).toHaveLength(0);
});
