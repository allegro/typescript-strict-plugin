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
  await it('src/notOnPath.ts', server, fileContent, (diagnostics) => {
    assert.strictEqual(diagnostics.length, 0);
  });
}

module.exports = run;
