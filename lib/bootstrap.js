const loadBuildConfig = require('../utils/loadBuildConfig');
const writeClientConfig = require('../utils/writeClientConfig');
const Compiler = require('./compiler');
const { getSpinner, colors } = require('./ui');
const { debugServer: debug } = require('./debug');
const { waitFor } = require('../utils');
// envHelper.config();

const bootstrap = async (config) => {
  await waitFor(writeClientConfig(config));
  const buildConfig = loadBuildConfig(config);
  let devServer = null;
  const closers = [];

  const serverCompiler = new Compiler(buildConfig.server);
  const Server = require('./server');
  const server = new Server(config);
  // server closer
  closers.push(server);
  closers.push(serverCompiler);

  const spinner = getSpinner('Welcome to use Kaonjs.');
  if (!__DEV__ && __SSR__ && !__ONLY_SERVER__) {
    spinner.message('waiting for server code build.');
    spinner.start();
    try {
      await waitFor(serverCompiler.run());
    } catch (e) {
      console.log(colors.failure('server compiling error.'));
      console.log(colors.failure(e));
    }
    spinner.stop();
    server.run();
  }

  if (__DEV__ && !__ONLY_SERVER__) {
    const DevServer = require('./webpack-dev-server');
    devServer = new DevServer(buildConfig.client);
    closers.push(devServer);

    spinner.message('waiting for building resources.');
    spinner.start();
    try {
      await Promise.all([
        devServer.start(),
        serverCompiler.run(),
      ]);
    } catch (e) {
      console.log(colors.failure('compiling error.'));
      console.log(colors.failure(e));
    }

    spinner.stop();

    if (__SSR__) {
      server.run();
      // auto reload server in development mode
      serverCompiler.on('compiled', () => {
        spinner.stop();
        console.log(colors.success('server compiling success.'));
        debug('server side code changed.');
        server.run();
      });

      serverCompiler.on('error', (error) => {
        spinner.stop();
        console.log(colors.failure('server compiling error.'));
        console.log(colors.failure(error));
      });

      spinner.message('waiting for building server resources.');
    } else {
      server.run();
    }
  } else {
    server.run();
  }


  return () => {
    console.log('\n');
    console.log('closing app...');
    // do something clean up
    const closing = closers.map(item => item.close());

    setTimeout(() => {
      console.log('server exit not gracefully.');
      process.exit();
    }, 500);


    Promise.all(closing).then(() => {
      console.log('server closed.');
      process.exit();
    }).catch(() => {
      console.log('server closed.');
      process.exit();
    });
  };
};

module.exports = bootstrap;
