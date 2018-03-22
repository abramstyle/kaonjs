const { resolve } = require('path');

const loadConfig = (configPath) => {
  if (!configPath) {
    return require(resolve(process.cwd(), 'config/kaon.config'));
  }

  return require(resolve(configPath));
};

module.exports = loadConfig;
