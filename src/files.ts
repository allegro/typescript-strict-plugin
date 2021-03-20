import { isTsStrictCommentPresent } from './utils';
import * as ts_module from 'typescript/lib/tsserverlibrary';

export function isFileStrict(info: ts_module.server.PluginCreateInfo, fileName: string) {
  const config = info.config;
  const isTsStrict = isTsStrictCommentPresent(info, fileName);

  if (isTsStrict) {
    return true;
  }
}

// getBaseSchema() {
//     if (!this._schemaPath || typeof this._schemaPath !== 'string') return null;
//     try {
//         const resolvedSchmaPath = this.getAbsoluteSchemaPath(this._host.getProjectRootPath(), this._schemaPath);
//         this.log('Read schema from ' + resolvedSchmaPath);
//         const isExists = this._host.fileExists(resolvedSchmaPath);
//         if (!isExists) return null;
//         if (this._schemaPath.endsWith('.graphql') || this._schemaPath.endsWith('.gql')) {
//             const sdl = this._host.readFile(resolvedSchmaPath, 'utf-8');
//             return sdl ? buildSchema(sdl) : null;
//         } else {
//             const introspectionContents = this._host.readFile(resolvedSchmaPath, 'utf-8');
//             return introspectionContents
//                 ? buildClientSchema(extractIntrospectionContentFromJson(JSON.parse(introspectionContents)))
//                 : null;
//         }
//     } catch (e) {
//         this.log('Fail to read schema file...');
//         this.log(e.message);
//         return null;
//     }
// }
//
// async waitBaseSchema() {
//     return this.getBaseSchema();
// }
//
// getAbsoluteSchemaPath(projectRootPath: string, schemaPath: string) {
//     if (path.isAbsolute(schemaPath)) return schemaPath;
//     return path.resolve(projectRootPath, schemaPath);
// }
//
