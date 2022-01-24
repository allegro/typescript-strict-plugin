import { mocked } from 'jest-mock';
import { isIgnoreCommentPresent, isStrictCommentPresent } from '../../isCommentPresent';
import { getFilePathsWithErrors, getFilePathsWithoutErrors } from '../getFilePaths';
import { updateStrictComments } from '../updateStrictComments';
import { insertIgnoreComment, removeStrictComment } from '../commentOperations';

jest.mock('../../findStrictErrors', () => ({
  findStrictErrors: jest.fn(),
}));

jest.mock('../getFilePaths', () => ({
  getFilePathsWithErrors: jest.fn(),
  getFilePathsWithoutErrors: jest.fn(),
}));

jest.mock('../../isCommentPresent', () => ({
  isStrictCommentPresent: jest.fn(),
  isIgnoreCommentPresent: jest.fn(),
}));

jest.mock('../commentOperations', () => ({
  removeStrictComment: jest.fn(),
  insertIgnoreComment: jest.fn(),
}));

const getFilePathsWithErrorsMock = mocked(getFilePathsWithErrors);
const getFilePathsWithoutErrorsMock = mocked(getFilePathsWithoutErrors);

const isStrictCommentPresentMock = mocked(isStrictCommentPresent);
const isIgnoreCommentPresentMock = mocked(isIgnoreCommentPresent);

describe('updateStrictComments', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getFilePathsWithErrorsMock.mockResolvedValue([]);
    getFilePathsWithoutErrorsMock.mockReturnValue([]);
  });

  it('should not change comments when there is no strict errors in file', async () => {
    // when
    const { updatedFileCount } = await updateStrictComments(['/dir/file.ts']);

    // then
    expect(removeStrictComment).not.toBeCalled();
    expect(insertIgnoreComment).not.toBeCalled();
    expect(updatedFileCount).toBe(0);
  });

  it('should not change comments when file contains errors and is not on path', async () => {
    // given
    getFilePathsWithErrorsMock.mockResolvedValue(['/dir/file.ts']);

    // when
    const { updatedFileCount } = await updateStrictComments(['/dir/file.ts'], ['/other-dir']);

    // then
    expect(removeStrictComment).not.toBeCalled();
    expect(insertIgnoreComment).not.toBeCalled();
    expect(updatedFileCount).toBe(0);
  });

  it('should insert ignore comment when file contains errors', async () => {
    // given
    getFilePathsWithErrorsMock.mockResolvedValue(['/dir/file.ts']);
    isIgnoreCommentPresentMock.mockReturnValue(false);

    // when
    const { updatedFileCount } = await updateStrictComments(['/dir/file2.ts']);

    // then
    expect(removeStrictComment).not.toBeCalled();
    expect(insertIgnoreComment).toBeCalledTimes(1);
    expect(updatedFileCount).toBe(1);
  });

  it('should insert ignore comment when file contains errors and is on configured path', async () => {
    // given
    getFilePathsWithErrorsMock.mockResolvedValue(['/dir/file.ts']);
    isIgnoreCommentPresentMock.mockReturnValue(false);

    // when
    const { updatedFileCount } = await updateStrictComments(['/dir/file.ts'], ['/dir']);

    // then
    expect(removeStrictComment).not.toBeCalled();
    expect(insertIgnoreComment).toBeCalledTimes(1);
    expect(updatedFileCount).toBe(1);
  });

  it('should remove strict comment when file is on configured path', async () => {
    // given
    getFilePathsWithoutErrorsMock.mockReturnValue(['/dir/file.ts']);
    isStrictCommentPresentMock.mockReturnValue(true);
    isIgnoreCommentPresentMock.mockReturnValue(false);

    // when
    const { updatedFileCount } = await updateStrictComments(['/dir/file.ts'], ['/dir']);

    // then
    expect(removeStrictComment).toBeCalledTimes(1);
    expect(insertIgnoreComment).not.toBeCalled();
    expect(updatedFileCount).toBe(1);
  });
});
