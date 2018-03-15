const path = require('path');

const { env } = process;

const config = {
  app: {
    name: `Cybertron (${env.NODE_ENV})`,
    shortName: 'cybertron',
    port: env.SERVER_PORT || 1827,
    keys: [env.APP_KEY],
    routes: path.resolve(__dirname, '../app/routes'),
    middlewares: path.resolve(__dirname, '../app/middlewares'),
  },
  resources: {
    root: path.resolve(__dirname, '../public'),
  },
  logs: {
    path: path.resolve('logs'),
    logname: `logstash_cybertron-${env.NODE_ENV}`,
  },
  cache: {
    redisCacheAlive: parseInt(env.REDIS_CACHE_ALIVE, 10),
    memoryCacheAlive: parseInt(env.MEMORY_CACHE_ALIVE, 10),
    validStatus: [200, 304],
    validMethods: ['GET'],
  },
  isomorphic: {
    routes: path.resolve(__dirname, '../src/routes'),
    store: path.resolve(__dirname, '../src/store/configureStore.js'),
    main: path.resolve(__dirname, '../src/client'),
  },
  postcss: {
    path: path.resolve(__dirname, './postcss.config.js'),
  },
  build: {
    host: 'localhost',
    port: 1592,
    webpack: path.resolve(__dirname, './webpack.config.js'),
    path: path.resolve(__dirname, '../build'),
  },
};

module.exports = config;
