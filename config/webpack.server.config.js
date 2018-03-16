function buildConfig(env) {
  const config = require(`./server/${env}.config`);

  return config;
}

module.exports = buildConfig;
