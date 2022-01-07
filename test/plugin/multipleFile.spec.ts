import { FILE_CONTENT_WITH_IGNORE, FILE_CONTENT_WITHOUT_STRICT } from './fileContents';
import { getMultipleDiagnostics } from './getMultipleDiagnostics';

it('should show errors only on file with strict comment', async () => {
  // given
  const fileInfoList = [
    { filePath: 'lib/onPath.ts', fileContent: FILE_CONTENT_WITHOUT_STRICT },
    { filePath: 'lib/otherFileOnPath.ts', fileContent: FILE_CONTENT_WITH_IGNORE },
  ];

  // when
  const diagnostics = await getMultipleDiagnostics(fileInfoList, 'project-fixture');

  // then
  expect(diagnostics[0]).toHaveLength(1);
  expect(diagnostics[1]).toHaveLength(0);
});
