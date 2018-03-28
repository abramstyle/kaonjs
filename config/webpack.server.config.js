function buildConfig(env) {
  const configEnv = env === 'development' ? 'development' : 'production';
  const config = require(`./server/${configEnv}.config`);

  return config;
}

module.exports = buildConfig;
