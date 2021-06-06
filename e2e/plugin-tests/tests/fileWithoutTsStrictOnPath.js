const assert = require('assert');
const it = require('../it');

const fileContent = `
interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
`;

async function run(server) {
  await it('lib/onPath.ts', server, fileContent, (diagnostics) => {
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].text, "Object is possibly 'undefined'.");
  });
}

module.exports = run;
