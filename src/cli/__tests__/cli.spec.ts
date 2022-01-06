import { findStrictErrors } from '../findStrictErrors';
import { findStrictFiles } from '../findStrictFiles';
import { getPluginConfig } from '../CliStrictFileChecker';
import { run } from '../cli';

jest.mock('../CliStrictFileChecker', () => ({
  getPluginConfig: jest.fn(),
}));

jest.mock('../findStrictFiles', () => ({
  findStrictFiles: jest.fn(),
}));

jest.mock('../findStrictErrors', () => ({
  findStrictErrors: jest.fn(),
}));

const getPluginConfigMock = getPluginConfig as jest.MockedFunction<typeof getPluginConfig>;
const findStrictFilesMock = findStrictFiles as jest.MockedFunction<typeof findStrictFiles>;
const findStrictErrorsMock = findStrictErrors as jest.MockedFunction<typeof findStrictErrors>;

jest.spyOn(process, 'exit').mockImplementation();
jest.spyOn(console, 'log').mockImplementation();

describe('tsc-strict root', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  it('should display no strict files error', async () => {
    // given
    getPluginConfigMock.mockResolvedValue({});
    findStrictFilesMock.mockResolvedValue([]);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/Project does not contain any strict files/i),
    );
  });

  it('should display a correct number of found strict files and errors', async () => {
    // given
    findStrictFilesMock.mockResolvedValue(['1.ts', '2.ts']);
    findStrictErrorsMock.mockResolvedValue(['error1', 'error2', 'error3']);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Found 2 strict files/i));
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/error1/i));
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/error2/i));
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/error3/i));
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Found 3 errors/i));
  });

  it('should display a singular file and error', async () => {
    // given
    findStrictFilesMock.mockResolvedValue(['1.ts']);
    findStrictErrorsMock.mockResolvedValue(['error1']);

    // when
    await run();

    // then
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Found 1 strict file/i));
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Found 1 error/i));
  });
});
