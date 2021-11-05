import path from 'path';
import { FILE_CONTENT_WITHOUT_STRICT, FILE_CONTENT_WITH_STRICT } from '../fileContents';
import { getMultipleDiagnostics } from '../getMultipleDiagnostics';

it('should show errors only on file with strict comment', async () => {
  // given
  const rootPath = path.resolve(__dirname, '../project-fixture/');
  const fileInfoList = [
    { fileName: 'src/notOnPath.ts', fileContent: FILE_CONTENT_WITH_STRICT },
    { fileName: 'src/otherFileNotOnPath.ts', fileContent: FILE_CONTENT_WITHOUT_STRICT },
  ];

  // when
  const diagnostics = await getMultipleDiagnostics(fileInfoList, rootPath);

  // then
  expect(diagnostics[0]).toHaveLength(1);
  expect(diagnostics[1]).toHaveLength(0);
});
