const loadConfig = require('../utils/loadConfig');
const builder = require('../lib/builder');

async function build(options) {
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('configuration can not be found.');
    process.exit();
  }

  if (!config) {
    throw new Error('config not found');
  }

  builder(config);
}

module.exports = build;
