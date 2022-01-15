import { isFileStrict } from '../isFileStrict';
import { Config } from '../types';
import { isFileOnPath } from '../isFileOnPath';
import { mocked } from 'jest-mock';

jest.mock('../isFileOnPath', () => ({
  isFileOnPath: jest.fn(),
}));

const isFileOnPathMock = mocked(isFileOnPath);
const isCommentPresent = jest.fn();
const filePath = 'filePath';

describe('isFileStrict', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    isFileOnPathMock.mockImplementation((_, path) => path === filePath);
    isCommentPresent.mockReturnValue(false);
  });

  it('should return false when ignore comment is present', () => {
    // given
    isCommentPresent.mockImplementation((comment) => comment === '@ts-strict-ignore');

    // when
    const result = isFileStrict({ filePath, isCommentPresent });

    // then
    expect(result).toBe(false);
  });

  it('should return true when strict comment is present', () => {
    // given
    isCommentPresent.mockImplementation((comment) => comment === '@ts-strict');

    // when
    const result = isFileStrict({ filePath, isCommentPresent });

    // then
    expect(result).toBe(true);
  });

  it('should return false when both strict and ignore comments are present', () => {
    // given
    isCommentPresent.mockImplementation(
      (comment) => comment === '@ts-strict' || comment === '@ts-strict-ignore',
    );

    // when
    const result = isFileStrict({ filePath, isCommentPresent });

    // then
    expect(result).toBe(false);
  });

  it('should return true when file is on path', () => {
    // given
    const config: Config = {
      paths: ['otherFilePath', filePath, 'otherFilePath'],
    };

    // when
    const result = isFileStrict({ filePath, isCommentPresent, config });

    // then
    expect(result).toBe(true);
  });

  it('should return false when file is not on path', () => {
    // given
    const config: Config = {
      paths: ['otherFilePath', 'otherFilePath'],
    };

    // when
    const result = isFileStrict({ filePath, isCommentPresent, config });

    // then
    expect(result).toBe(false);
  });

  it('should return true when file is not on path and contains strict comment', () => {
    // given
    isCommentPresent.mockImplementation((comment) => comment === '@ts-strict');

    const config: Config = {
      paths: ['otherFilePath', 'otherFilePath'],
    };

    // when
    const result = isFileStrict({ filePath, isCommentPresent, config });

    // then
    expect(result).toBe(true);
  });

  it('should return false when file is on path and contains ignore comment', () => {
    // given
    isCommentPresent.mockImplementation((comment) => comment === '@ts-strict-ignore');

    const config: Config = {
      paths: ['otherFilePath', filePath, 'otherFilePath'],
    };

    // when
    const result = isFileStrict({ filePath, isCommentPresent, config });

    // then
    expect(result).toBe(false);
  });

  it('should return true when path config is empty', () => {
    // given
    const config: Config = {
      paths: [],
    };

    // when
    const result = isFileStrict({ filePath, isCommentPresent, config });

    // then
    expect(result).toBe(true);
  });
});
