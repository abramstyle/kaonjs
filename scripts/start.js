const Kaon = require('../lib/kaon');
const loadConfig = require('../utils/loadConfig');

function run(options) {
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('no configuration file found.');
  }

  const kaon = new Kaon(config);
  return kaon.build(config);
}

module.exports = run;
