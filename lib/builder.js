const loadBuildConfig = require('../utils/loadBuildConfig');
const Compiler = require('../lib/compiler');
const cleanBuildDir = require('../utils/cleanBuildDir');
const { waitFor } = require('../utils');

async function builder(config) {
  await waitFor(cleanBuildDir(config));

  const buildConfig = loadBuildConfig(config);

  const compiler = new Compiler(buildConfig.client);

  console.log('building resources...');
  return compiler.run()
    .then((stats) => {
      console.log('build success.');
      return Promise.resolve(stats.toJson());
    });
}

module.exports = builder;
