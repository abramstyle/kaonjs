const { resolve } = require('path');

const loadConfig = (configPath) => {
  if (!configPath) {
    return require(resolve('config/cybertron.config'));
  }

  return require(resolve(configPath));
};

module.exports = loadConfig;
