const merge = require('webpack-merge');
const { objectUtils } = require('@abramstyle/utils');

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
  const localConfigBuilder = require('../config/webpack.client.config');
  const clientConfig = buildConfig(localConfigBuilder, appConfig);
  let externalConfig = null;
  if (appConfig.build.webpack) {
    try {
      const externalConfigBuilder = require(appConfig.build.webpack);
      externalConfig = buildConfig(externalConfigBuilder);
    } catch (e) {
      console.warn('webpack config found, but load file failed.');
    }
  }
  // console.log('client config: ', clientConfig);

  const config = merge.smart(clientConfig, externalConfig);

  // console.log('config: ', config);

  return config;
}

module.exports = loadBuildConfig;
