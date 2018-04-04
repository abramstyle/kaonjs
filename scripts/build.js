const loadConfig = require('../utils/loadConfig');
const Kaon = require('../lib/kaon');

async function build(options) {
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('no configuration file found.');
  }

  const kaon = new Kaon(config);
  return kaon.build();
}

module.exports = build;
