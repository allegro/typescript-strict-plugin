import { getPluginConfig } from '../../getPluginConfig';
import { getFilesCheckedByTs, getStrictFilePaths } from '../../findStrictFiles';
import { isWorkspaceClean } from '../isWorkspaceClean';
import { insertIgnoreComment, removeIgnoreComment } from '../../commentOperations';
import { getFilePathsWithErrors } from '../../getFilePaths';
import { run } from '../index';

jest.mock('../isWorkspaceClean', () => ({
  isWorkspaceClean: jest.fn(),
}));

jest.mock('../../getPluginConfig', () => ({
  getPluginConfig: jest.fn(),
}));

jest.mock('../../findStrictFiles', () => ({
  getFilesCheckedByTs: jest.fn(),
  getStrictFilePaths: jest.fn(),
}));

jest.mock('../../commentOperations', () => ({
  insertIgnoreComment: jest.fn(),
  removeIgnoreComment: jest.fn(),
}));

jest.mock('../../getFilePaths', () => ({
  getFilePathsWithErrors: jest.fn(),
}));

const isWorkspaceCleanMock = jest.mocked(isWorkspaceClean);
const getPluginConfigMock = jest.mocked(getPluginConfig);

const getFilesCheckedByTsMock = jest.mocked(getFilesCheckedByTs);
const getStrictFilePathsMock = jest.mocked(getStrictFilePaths);
const getFilePathsWithErrorsMock = jest.mocked(getFilePathsWithErrors);

const removeIgnoreCommentMock = jest.mocked(removeIgnoreComment);
const insertIgnoreCommentMock = jest.mocked(insertIgnoreComment);

jest.spyOn(process, 'exit').mockImplementation();
jest.spyOn(console, 'log').mockImplementation();

describe('check-strict-comments root', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    isWorkspaceCleanMock.mockResolvedValue(true);
    getPluginConfigMock.mockResolvedValue({});

    removeIgnoreCommentMock.mockImplementation(() => {});
    insertIgnoreCommentMock.mockImplementation(() => {});
  });

  it('should display working directory not clean error', async () => {
    // given
    isWorkspaceCleanMock.mockResolvedValue(false);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(
        /Your working directory is not clean! Please commit or stash your changes before trying again/i,
      ),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should display no config error', async () => {
    // given
    getPluginConfigMock.mockResolvedValue(undefined);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/typescript-strict-plugin isn't configured in tsconfig.json/i),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should display the correct numbers with already strict file', async () => {
    // given
    getFilesCheckedByTsMock.mockResolvedValue(['1.ts', '2.ts', '3.ts', '4.ts', '5.ts']);
    getStrictFilePathsMock.mockReturnValue(['2.ts', '3.ts']);
    getFilePathsWithErrorsMock.mockResolvedValue(['1.ts', '4.ts']); // 5.ts is the already strict one

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files in project:/i), 5);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files already strict:/i), 2);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files not strict:/i), 3);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files with errors:/i), 2);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/Removed strict ignore comments in 1 file/i),
    );
  });

  it('should display the correct numbers without already strict file', async () => {
    // given
    getFilesCheckedByTsMock.mockResolvedValue(['1.ts', '2.ts', '3.ts', '4.ts']);
    getStrictFilePathsMock.mockReturnValue(['2.ts', '3.ts']);
    getFilePathsWithErrorsMock.mockResolvedValue(['1.ts', '4.ts']);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files in project:/i), 4);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files already strict:/i), 2);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files not strict:/i), 2);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/# files with errors:/i), 2);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/No strict ignore comments changed/i),
    );
  });
});
