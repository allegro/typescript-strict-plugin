import { ServerResponse, TSServer } from '../fixtures/lang-server';

const assert = require('assert');
const path = require('path');

const fileContent = `
//@ts-strict
interface TestType { bar: string; }
const foo: TestType | undefined = undefined;
const boo = foo.bar;
`;

const otherFileContent = `
interface TestType {
  bar: string;
}

const foo1: TestType | undefined = undefined;

const boo1 = foo1.bar;
`;

function findResponse(responses: ServerResponse[], eventName: string) {
  return responses.filter((response) => response.event === eventName);
}

async function run(server: TSServer) {
  const projectFixture = path.join('..', 'project-fixture');
  const rootPath = path.resolve(__dirname, projectFixture);
  const file = path.resolve(__dirname, path.join(projectFixture, 'src', 'notOnPath.ts'));
  const otherFile = path.resolve(
    __dirname,
    path.join(projectFixture, 'src', 'otherFileNotOnPath.ts'),
  );

  // open two files
  server.send({
    command: 'updateOpen',
    arguments: {
      changedFiles: [],
      closedFiles: [],
      openFiles: [
        {
          file,
          fileContent,
          projectRootPath: rootPath,
          scriptKindName: 'TS',
        },
        {
          file: otherFile,
          fileContent: otherFileContent,
          projectRootPath: rootPath,
          scriptKindName: 'TS',
        },
      ],
    },
  });

  await server.waitEvent('projectLoadingFinish');

  server.send({ command: 'geterr', arguments: { files: [file, otherFile], delay: 0 } });

  // and wait for both files diagnostics errors
  await server.waitEvent('semanticDiag');
  await server.waitEvent('semanticDiag');

  return server.close().then(() => {
    const semanticDiagEvent = findResponse(server.responses, 'semanticDiag');
    const fileEvent = semanticDiagEvent.find((it) => toFileSystemSlash(it.body.file) === file);
    const otherFileEvent = semanticDiagEvent.find(
      (it) => toFileSystemSlash(it.body.file) === otherFile,
    );

    assert(!!fileEvent);
    assert(!!otherFileEvent);

    assert.strictEqual(fileEvent!.body.diagnostics.length, 1);
    assert.strictEqual(otherFileEvent!.body.diagnostics.length, 0);
  });
}

module.exports = run;

function toFileSystemSlash(file: string): string {
  return file.split('/').join(path.sep);
}
