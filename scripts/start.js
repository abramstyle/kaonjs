const Kaon = require('../lib/kaon');
const loadConfig = require('../utils/loadConfig');

function run(options) {
  const { config: configPath, port, onlyServer } = options;
  let config = null;
  try {
    config = Object.assign({}, loadConfig(configPath), {
      port,
      onlyServer,
    });
  } catch (e) {
    console.error('no configuration file found.');
  }

  const kaon = new Kaon(config);
  return kaon.start(config);
}

module.exports = run;
