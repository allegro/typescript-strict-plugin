import { getProjectPathFromArgs } from '../utils';
import { getAbsolutePath } from '../getAbsolutePath';
import { mocked } from 'jest-mock';
import { isFileOnPath } from '../isFileOnPath';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getProjectPathFromArgs: jest.fn(),
}));

jest.mock('../getAbsolutePath', () => ({
  getAbsolutePath: jest.fn(),
}));

const getProjectPathFromArgsMock = mocked(getProjectPathFromArgs);
const getAbsolutePathMock = mocked(getAbsolutePath);

const projectPathFromArgs = './defined_project_path';

describe('isFileOnPath', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getProjectPathFromArgsMock.mockReturnValue(projectPathFromArgs);
    getAbsolutePathMock.mockReturnValue('/some_file_path/lib_dir');
  });

  it('when projectPath argument used, prefer argument value', () => {
    // given
    const projectPath = '/some_path';

    // when
    isFileOnPath({
      filePath: '/some_file_path/lib_dir/file.ts',
      targetPath: './lib_dir',
      projectPath,
    });

    // then
    expect(getAbsolutePathMock).toHaveBeenCalledTimes(1);
    expect(getAbsolutePathMock).toHaveBeenCalledWith(projectPath, './lib_dir');
  });

  it('when getProjectPathFromArgs is defined, use defined value', () => {
    //when
    isFileOnPath({ filePath: '/some_file_path/lib_dir/file.ts', targetPath: './lib_dir' });

    // then
    expect(getAbsolutePathMock).toHaveBeenCalledTimes(1);
    expect(getAbsolutePathMock).toHaveBeenCalledWith(projectPathFromArgs, './lib_dir');
    expect(projectPathFromArgs).not.toEqual(process.cwd());
  });

  it('when getProjectPathFromArgs is undefined, fallback to current working directory to match', () => {
    // given
    getProjectPathFromArgsMock.mockReturnValue(undefined);
    const cwd = process.cwd();

    // when
    isFileOnPath({ filePath: '/some_file_path/lib_dir/file.ts', targetPath: './lib_dir' });

    // then
    expect(getAbsolutePathMock).toHaveBeenCalledTimes(1);
    expect(getAbsolutePathMock).toHaveBeenCalledWith(cwd, './lib_dir');
  });
});
