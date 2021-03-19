import * as ts from 'typescript/lib/tsserverlibrary';
import { Plugin } from './plugin';

export = (mod: { typescript: typeof ts }) => new Plugin(mod.typescript);
