import { TSServer } from '../fixtures/lang-server';

const assert = require('assert');
const it = require('../it');

const fileContent = `
interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
`;

async function run(server: TSServer) {
  await it('src/notOnPath.ts', server, fileContent, (diagnostics: any[]) => {
    assert.strictEqual(diagnostics.length, 0);
  });
}

module.exports = run;
