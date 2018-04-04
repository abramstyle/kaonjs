const { objectUtils } = require('@abramstyle/utils');

function generateCdnPath(config) {
  const serverHost = config.build.host || config.host || '0.0.0.0';
  const serverPort = config.build.port || config.port || '';
  const serverPath = config.build.path || '';
  const port = serverPort ? `:${serverPort}` : '';

  return `//${serverHost}${port}/${serverPath}`;
}

function getBaseDir() {
  const baseDir = process.cwd();

  return baseDir;
}

function processConfig(config = {}) {
  const baseDir = getBaseDir();

  if (!objectUtils.isObject(config)) {
    config = {};
  }

  const kaonConfig = {
    app: {
      name: 'Kaon Config Template (production)',
      shortName: 'rib',
      port: 1827,
      routes: `${baseDir}/app/routes`,
      middlewares: `${baseDir}/app/middlewares`,
    },
    resources: {
      root: `${baseDir}/public`,
    },
    isomorphic: {
      routes: `${baseDir}/src/routes`,
      store: `${baseDir}/src/store/configureStore.js`,
      main: `${baseDir}/src/client`,
    },
    postcss: {
      path: `${baseDir}/config/postcss.config.js`,
    },
    webpack: {
      client: `${baseDir}/config/webpack.client.config`,
      server: `${baseDir}/config/webpack.server.config`,
    },
    build: {
      host: 'localhost',
      port: 1592,
      path: 'build/',
      target: `${baseDir}/public/build`,
    },
  };

  Object.keys(kaonConfig).forEach((key) => {
    Object.assign(kaonConfig[key], config[key] || {});
  });

  return kaonConfig;
}

exports.generateCdnPath = generateCdnPath;
exports.getBaseDir = getBaseDir;
exports.processConfig = processConfig;
