import { ServerResponse, TSServer } from './TSServer';
import path from 'path';

interface FileInfo {
  fileContent: string;
  filePath: string;
}

function findResponses(responses: ServerResponse[], eventName: string) {
  return responses.filter((response) => response.event === eventName);
}

export async function getMultipleDiagnostics(fileInfoList: FileInfo[], projectPath: string) {
  const server = new TSServer();

  const openFiles = fileInfoList.map((fileInfo) => ({
    file: path.resolve(__dirname, projectPath, fileInfo.filePath),
    fileContent: fileInfo.fileContent,
    projectRootPath: projectPath,
    scriptKindName: 'TS',
  }));

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
