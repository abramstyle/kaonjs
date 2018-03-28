const dotenv = require('dotenv');
const Promise = require('bluebird');
const envHelper = require('../utils/env');
const loadBuildConfig = require('../utils/loadBuildConfig');
const writeClientConfig = require('../utils/writeClientConfig');
const Compiler = require('./compiler');

envHelper.config();
dotenv.config();
// envHelper.config();

const bootstrap = async (config) => {
  await writeClientConfig(config);
  const buildConfig = loadBuildConfig(config);
  let devServer = null;

  const serverCompiler = new Compiler(buildConfig.server);
  const Server = require('./server');
  const server = new Server(config);

  if (!__DEV__) {
    console.log('waiting for server code build.');
    await serverCompiler.run();
    server.run();
  }

  if (__DEV__) {
    const DevServer = require('./webpack-dev-server');
    // start dev server in development mode
    const clientCompiler = new Compiler(buildConfig.client);

    console.log('waiting build client resources.');
    await clientCompiler.run();
    devServer = new DevServer(buildConfig.client);
    devServer.start();


    // auto reload server in development mode
    serverCompiler.on('compiled', () => {
      console.log('server compiling success.');
      server.run();
      console.log('server is reloaded.');
      console.log('open http://localhost:', config.app.port);
    });

    serverCompiler.watch({
      ignored: /build/,
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
