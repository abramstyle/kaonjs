const fs = require('fs-extra');

function cleanBuildDir(config) {
  const { build: { target } } = config;

  return fs.remove(target);
}

module.exports = cleanBuildDir;
