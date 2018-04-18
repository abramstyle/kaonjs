const loadBuildConfig = require('../utils/loadBuildConfig');
const Compiler = require('../lib/compiler');
const cleanBuildDir = require('../utils/cleanBuildDir');
const { waitFor } = require('../utils');

async function builder(config) {
  await waitFor(cleanBuildDir(config));

  const buildConfig = loadBuildConfig(config);

  const compiler = new Compiler(buildConfig.client);

  console.log('building resources...');
  try {
    const stats = await compiler.run();
    console.log('build success.');
    return stats;
  } catch (err) {
    throw err;
  }
}

module.exports = builder;
