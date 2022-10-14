import { getProjectPathFromArgs } from '../utils';

let globalProcessArgv: string[];

describe('utils', () => {
  describe('getProjectPathFromArgs', () => {
    beforeEach(() => {
      globalProcessArgv = process.argv;
    });

    afterEach(() => {
      process.argv = globalProcessArgv;
    });

    it('should return undefined if --project not present in path', () => {
      process.argv = [
        '/usr/bin/nodejs/18.7.0/bin/node',
        '/home/neenjaw/typescript-strict-plugin/node_modules/.bin/update-strict-comments',
      ];

      expect(getProjectPathFromArgs()).toEqual(undefined);
    });

    it('should return undefined if --project not present in path', () => {
      process.argv = [
        '/usr/bin/nodejs/18.7.0/bin/node',
        '/home/neenjaw/typescript-strict-plugin/node_modules/.bin/update-strict-comments',
        '--project',
        './some/inner/project/tsconfig.json',
      ];

      expect(getProjectPathFromArgs()).toEqual('./some/inner/project');
    });
  });
});
