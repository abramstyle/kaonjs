function buildConfig(env) {
  const config = require(`./${env}.config`);

  return config;
}

module.exports = buildConfig;
