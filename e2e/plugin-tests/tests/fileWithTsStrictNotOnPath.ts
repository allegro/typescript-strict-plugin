import { TSServer } from '../fixtures/lang-server';

const assert = require('assert');
const it = require('../it');

const fileContent = `
//@ts-strict
interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
`;

async function run(server: TSServer) {
  await it('src/notOnPath.ts', server, fileContent, (diagnostics: any[]) => {
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].text, "Object is possibly 'undefined'.");
  });
}

module.exports = run;
