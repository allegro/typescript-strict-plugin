// @ts-ignore
import { TSServer, ServerResponse } from './TSServer';
import path, { resolve } from 'path';
import { readFileSync } from 'fs';

function findResponse(responses: ServerResponse[], eventName: string) {
  return responses.find((response) => response.event === eventName);
}

export async function getDiagnostics(projectPath: string, filePath: string) {
  const server = new TSServer(projectPath);

  const file = resolve(projectPath, filePath);

  const fileContent = readFileSync(file, 'utf-8');

  server.send({
    command: 'updateOpen',
    arguments: {
      openFiles: [{ file: file, fileContent, scriptKindName: 'TS', projectRootPath: projectPath }],
    },
  });

  await server.waitEvent('projectLoadingFinish');

  server.send({ command: 'geterr', arguments: { files: [file], delay: 10 } });

  await server.waitEvent('semanticDiag');

  await server.close();

  const semanticDiagEvent = findResponse(server.responses, 'semanticDiag');

  return semanticDiagEvent?.body.diagnostics;
}
