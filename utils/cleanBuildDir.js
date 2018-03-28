const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function cleanBuildDir(config) {
  const { build: { target } } = config;

  return fs.rmdir(target);
}

module.exports = cleanBuildDir;
