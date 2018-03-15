const bootstrap = require('../lib/bootstrap');
const loadConfig = require('../utils/loadConfig');
const processConfig = require('../utils/processConfig');

function run(options) {
  // const { env: { NODE_ENV: env } } = process;
  const { config: configPath } = options;
  let config = null;
  try {
    config = loadConfig(configPath);
  } catch (e) {
    console.error('configuration can not be found.');
    process.exit();
  }

  if (config) {
    bootstrap(processConfig(config));
  }
}

module.exports = run;
