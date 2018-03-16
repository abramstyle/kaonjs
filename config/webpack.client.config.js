function buildConfig(env) {
  const config = require(`./client/${env}.config`);

  return config;
}

module.exports = buildConfig;
