import { getDiagnostics } from '../getDiagnostics';
import {
  FILE_CONTENT_WITHOUT_STRICT,
  NULL_ERROR_MESSAGE,
  FILE_CONTENT_WITH_STRICT,
  FILE_CONTENT_WITH_IGNORE,
  FILE_CONTENT_WITH_STRICT_AND_IGNORE,
} from '../fileContents';

describe('single file diagnostics', () => {
  it('should not enable strict mode when file is not on path and does not contain strict comment', async () => {
    // when
    const diagnostics = await getDiagnostics(FILE_CONTENT_WITHOUT_STRICT, 'src/notOnPath.ts');

    // then
    expect(diagnostics).toHaveLength(0);
  });

  it('should enable strict mode when file is on path and does not contain strict comment', async () => {
    // when
    const diagnostics = await getDiagnostics(FILE_CONTENT_WITHOUT_STRICT, 'lib/onPath.ts');

    // then
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].text).toBe(NULL_ERROR_MESSAGE);
  });

  it('should enable strict mode when file is on path and contains strict comment', async () => {
    // given

    // when
    const diagnostics = await getDiagnostics(FILE_CONTENT_WITH_STRICT, 'lib/onPath.ts');

    // then
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].text).toBe(NULL_ERROR_MESSAGE);
  });

  it('should enable strict mode when file is not on path and contains strict comment', async () => {
    // given

    // when
    const diagnostics = await getDiagnostics(FILE_CONTENT_WITH_STRICT, 'src/notOnPath.ts');

    // then
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].text).toBe(NULL_ERROR_MESSAGE);
  });

  it('should not enable strict mode when file contains both strict and strict-ignore comments', async () => {
    // when
    const diagnostics = await getDiagnostics(
      FILE_CONTENT_WITH_STRICT_AND_IGNORE,
      'src/notOnPath.ts',
    );

    // then
    expect(diagnostics).toHaveLength(0);
  });

  it('should not enable strict mode when file is on path and contains strict-ignore comments', async () => {
    // when
    const diagnostics = await getDiagnostics(FILE_CONTENT_WITH_STRICT_AND_IGNORE, 'lib/onPath.ts');

    // then
    expect(diagnostics).toHaveLength(0);
  });
});
