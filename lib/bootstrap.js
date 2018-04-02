const dotenv = require('dotenv');
const Promise = require('bluebird');
const envHelper = require('../utils/env');
const loadBuildConfig = require('../utils/loadBuildConfig');
const writeClientConfig = require('../utils/writeClientConfig');
const Compiler = require('./compiler');
const { getSpinner, colors } = require('./ui');
const { debugServer: debug, debugConfig } = require('./debug');
const { inspect } = require('util');

global.Promise = Promise;

envHelper.config();
dotenv.config();
// envHelper.config();

const bootstrap = async (config) => {
  await writeClientConfig(config);
  const buildConfig = loadBuildConfig(config);
  let devServer = null;

  debugConfig('kaon config:');
  debugConfig(inspect(config, { colors: true, depth: null }));
  debugConfig('client config:');
  debugConfig(inspect(buildConfig.client, { colors: true, depth: null }));
  debugConfig('server config:');
  debugConfig(inspect(buildConfig.server, { colors: true, depth: null }));
  const serverCompiler = new Compiler(buildConfig.server);
  const Server = require('./server');
  const server = new Server(config);

  const spinner = getSpinner('Welcome to use Kaonjs.');
  if (!__DEV__) {
    spinner.message('waiting for server code build.');
    spinner.start();
    await serverCompiler.run();
    spinner.stop();
    server.run();
  }

  if (__DEV__) {
    const DevServer = require('./webpack-dev-server');
    // start dev server in development mode
    const clientCompiler = new Compiler(buildConfig.client);

    spinner.message('waiting for building client resources.');
    spinner.start();
    await clientCompiler.run();
    devServer = new DevServer(buildConfig.client);
    devServer.start();


    // auto reload server in development mode
    serverCompiler.on('compiled', () => {
      spinner.stop();
      console.log(colors.success('server compiling success.'));
      debug('server side code changed.');
      server.run();
      console.log(colors.success('server is reloaded.'));
      console.log(colors.prompt('open http://localhost:%s to visit.'), config.app.port);
    });

    spinner.message('waiting for building server resources.');
    serverCompiler.watch({
      ignored: config.build.target,
    });
  }

  const cleanUpAndExit = () => {
    console.log('\n');
    // do something clean up
    const closing = [
    ];

    if (server) {
      closing.push(server.close());
    }
    if (serverCompiler) {
      closing.push(serverCompiler.close());
    }
    if (devServer) {
      closing.push(devServer.close());
    }


    Promise.all(closing).then(() => {
      console.log('server closed.');
      process.exit();
    }).catch(() => {
      console.log('server closed.');
      process.exit();
    });
  };

  ['SIGUSR2', 'SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
    process.once(sig, cleanUpAndExit);
  });
};

module.exports = bootstrap;
