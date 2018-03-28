function buildConfig(env) {
  const configEnv = env === 'production' ? env : 'development';
  const config = require(`./server/${configEnv}.config`);

  return config;
}

module.exports = buildConfig;
