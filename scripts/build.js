const loadConfig = require('../utils/loadConfig');
const Kaon = require('../lib/kaon');

async function build(options) {
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('configuration can not be found.');
  }

  if (!config) {
    throw new Error('config not found');
  }

  const kaon = new Kaon(config);
  kaon.build();
}

module.exports = build;
