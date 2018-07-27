const { objectUtils } = require('fanas');
const { inspect } = require('util');

const { mergeWebpack } = require('./mergeWebpack');
const { debugConfig: debug } = require('../lib/debug');

function buildConfig(configBuilder, appConfig) {
  if (!configBuilder) return null;

  const env = process.env.NODE_ENV;
  let config = null;
  if (typeof configBuilder === 'function') {
    config = configBuilder(env);
  } else {
    config = configBuilder;
  }
  if (typeof config === 'function') {
    return config(appConfig);
  }
  console.log(require('util').inspect('build config: ', config, { depth: null }));
  return config;
}

function loadBuildConfig(appConfig) {
  if (!objectUtils.isObject(appConfig)) {
    throw new Error('expect app config as an object');
  }
  const config = {
    client: {},
    server: {},
  };
  const localClientConfigBuilder = require('../config/webpack.client.config');
  config.client = buildConfig(localClientConfigBuilder, appConfig);
  const localServerBuilder = require('../config/webpack.server.config');
  config.server = buildConfig(localServerBuilder, appConfig);

  if (appConfig.webpack.client) {
    console.log('appConfig.webpack.client: ', appConfig.webpack.client);
    try {
      const externalClientConfigBuilder = require(appConfig.webpack.client);
      const externalClientConfig = buildConfig(externalClientConfigBuilder);

      console.log('externalClientConfigBuilder: ', externalClientConfigBuilder);

      config.client = mergeWebpack(config.client, externalClientConfig);
    } catch (e) {
      console.log('error: ', e);
      console.warn('client webpack config found, but load file failed.');
    }
  }

  if (appConfig.webpack.server) {
    try {
      const externalServerConfigBuilder = require(appConfig.webpack.server);
      const externalServerConfig = buildConfig(externalServerConfigBuilder);

      config.server = mergeWebpack(config.server, externalServerConfig);
    } catch (e) {
      console.log('error: ', e);
      console.warn('webpack config found, but load file failed.');
    }
  }

  debug('client config:');
  debug(inspect(config.client, { colors: true, depth: null }));
  debug('server config:');
  debug(inspect(config.server, { colors: true, depth: null }));

  return config;
}

module.exports = loadBuildConfig;
