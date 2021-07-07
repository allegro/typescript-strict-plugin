import { ServerResponse, TSServer } from './fixtures/lang-server';

const assert = require('assert');
const path = require('path');

function findResponse(responses: ServerResponse[], eventName: string) {
  return responses.find((response) => response.event === eventName);
}

async function it(
  fileName: string,
  server: TSServer,
  fileContent: string,
  assertionCallback: (args: any[]) => void,
) {
  const file = path.resolve(__dirname, './project-fixture/' + fileName);

  server.send({ command: 'open', arguments: { file, fileContent, scriptKindName: 'TS' } });

  await server.waitEvent('projectLoadingFinish');

  server.send({ command: 'geterr', arguments: { files: [file], delay: 0 } });

  await server.waitEvent('semanticDiag');

  return server.close().then(() => {
    const semanticDiagEvent = findResponse(server.responses, 'semanticDiag');
    assert(!!semanticDiagEvent);
    assertionCallback(semanticDiagEvent?.body.diagnostics);
  });
}

module.exports = it;
