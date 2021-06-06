const path = require('path');
const glob = require('glob');
const createServer = require('./fixtures/lang-server');

async function runLangServerSpecs() {
  const langServerSpecFiles = glob.sync('tests/*.js', { cwd: __dirname });
  console.log('Start lang server e2e testing.');
  let server;
  await langServerSpecFiles.reduce(
    (queue, file) =>
      queue.then(() =>
        require(path.join(__dirname, file))((server = createServer())).then(() => server.close()),
      ),
    Promise.resolve(null),
  );
  console.log(`🌟  ${langServerSpecFiles.length} lang server specs passed.`);
  console.log('');
}

async function run() {
  try {
    await runLangServerSpecs();
  } catch (reason) {
    console.log('😢  some specs failed...');
    console.error(reason);
    process.exit(1);
  }
}

run();
