import { ServerResponse, TSServer } from './TSServer';
import { resolve } from 'path';

function findResponse(responses: ServerResponse[], eventName: string) {
  return responses.find((response) => response.event === eventName);
}

export async function getDiagnostics(fileContent: string, projectPath: string, filePath: string) {
  const server = new TSServer();

  const file = resolve(__dirname, projectPath, filePath);

  server.send({ command: 'open', arguments: { file, fileContent, scriptKindName: 'TS' } });

  await server.waitEvent('projectLoadingFinish');

  server.send({ command: 'geterr', arguments: { files: [file], delay: 0 } });

  await server.waitEvent('semanticDiag');

  await server.close();

  const semanticDiagEvent = findResponse(server.responses, 'semanticDiag');

  return semanticDiagEvent?.body.diagnostics;
}
