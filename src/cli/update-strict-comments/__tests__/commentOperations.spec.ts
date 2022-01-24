import { mocked } from 'jest-mock';
import { readFileSync, writeFileSync } from 'fs';
import { insertIgnoreComment, removeStrictComment } from '../commentOperations';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const readFileSyncMock = mocked(readFileSync);
const writeFileSyncMock = mocked(writeFileSync);

describe('insertIgnoreComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should insert comment', () => {
    // given
    readFileSyncMock.mockReturnValue('const x = 0;');

    // when
    insertIgnoreComment('file.ts');

    // then
    expect(writeFileSyncMock).toBeCalledWith('file.ts', '// @ts-strict-ignore\nconst x = 0;');
  });
});

describe('removeStrictComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove comment', () => {
    // given
    readFileSyncMock.mockReturnValue('// @ts-strict\nconst x = 0;');

    // when
    removeStrictComment('file.ts');

    // then
    expect(writeFileSyncMock).toBeCalledWith('file.ts', 'const x = 0;');
  });

  it('should not change file content without strict comment', () => {
    // given
    readFileSyncMock.mockReturnValue('const x = 0;');

    // when
    removeStrictComment('file.ts');

    // then
    expect(writeFileSyncMock).not.toBeCalled();
  });
});
