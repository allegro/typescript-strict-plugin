import { ServerResponse, TSServer } from './TSServer';
import path from 'path';
import * as fs from 'fs';

function findResponses(responses: ServerResponse[], eventName: string) {
  return responses.filter((response) => response.event === eventName);
}

export async function getMultipleDiagnostics(projectPath: string, filePaths: string[]) {
  const server = new TSServer();

  const openFiles = filePaths.map((filePath) => {
    const file = path.resolve(projectPath, filePath);
    return {
      file,
      fileContent: fs.readFileSync(file, 'utf-8'),
      projectRootPath: projectPath,
      scriptKindName: 'TS',
    };
  });

  const openFilePaths = openFiles.map((file) => file.file);

  server.send({
    command: 'updateOpen',
    arguments: {
      changedFiles: [],
      closedFiles: [],
      openFiles,
    },
  });

  await server.waitEvent('projectLoadingFinish');

  server.send({ command: 'geterr', arguments: { files: openFilePaths, delay: 0 } });

  for (const openFile of openFiles) {
    await server.waitEvent('semanticDiag');
  }

  await server.close();

  return findResponses(server.responses, 'semanticDiag').map(
    (response) => response.body?.diagnostics,
  );
}
