import path from 'path';

export const fixtureWithDefaultConfig = {
  projectPath: path.resolve(__dirname, 'default-config'),
  filePaths: {
    strict: 'strict.ts',
    ignored: 'ignored.ts',
  },
};

export const fixtureWithPathConfig = {
  projectPath: path.resolve(__dirname, 'path-config'),
  filePaths: {
    included: 'included/included.ts',
    included2: 'included/included2.ts',
    excluded: 'excluded/excluded.ts',
    excluded2: 'excluded/excluded2.ts',
    excludedWithStrictComment: 'excluded/excludedWithStrictComment.ts',
  },
};

export const fixtureWithNonRootConfig = {
  projectPath: path.resolve(__dirname, 'non-root-config'),
  filePaths: {
    strict: 'strict.ts',
    ignored: 'ignored.ts',
  },
  args: ['--project', './nested/tsconfig.json'],
};
