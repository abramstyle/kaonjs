const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const ISOMORPHIC_PATH = '../isomorphic/clientConfig.js';

const template = (config) => {
  const { isomorphic, build } = config;
  const { routes, store } = isomorphic;
  return `
      const { default: routes } = require('${routes}');
      const { default: configureStore } = require('${store}');
      const stats = require('${build.path}/react-loadable.json');

      exports.routes = routes;
      exports.configureStore = configureStore;
      exports.stats = stats;
    `;
};

async function writeConfig(config = {}) {
  const content = template(config);

  return fs.writeFileAsync(path.resolve(__dirname, ISOMORPHIC_PATH), content);
}

module.exports = writeConfig;
