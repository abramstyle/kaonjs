const { objectUtils } = require('@abramstyle/utils');
const { mergeWebpack } = require('./mergeWebpack');

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
    try {
      const externalClientConfigBuilder = require(appConfig.webpack.client);
      const externalClientConfig = buildConfig(externalClientConfigBuilder);


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

  return config;
}

module.exports = loadBuildConfig;
