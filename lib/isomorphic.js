const { inspect } = require('util');
const { debugRender: debug } = require('./debug');
const { getAssets } = require('../utils/assets');

const getRenderer = async (config) => {
  // invalidate cache and require fresh cache
  const isomorphic = {};
  if (__DEV__) {
    delete require.cache[require.resolve(`${config.build.target}/main`)];
  }

  const { default: getServerRenderer } = require(`${config.build.target}/main`);
  isomorphic.render = require('../isomorphic/template');
  isomorphic.serverRenderer = await getServerRenderer(config);

  return async (ctx) => {
    const manifest = require(`${config.build.target}/manifest.json`);

    const scripts = {
      manifest: manifest['manifest.js'],
      commons: manifest['commons.js'],
      app: manifest['app.js'],
    };


    const renderProps = {
      helmet: {},
      scripts,
    };

    debug('manifest:');
    debug(inspect(manifest, { colors: true, depth: null }));

    if (__SSR__) {
      const {
        html, state, helmet, preloadBundles,
      } = await isomorphic.serverRenderer(ctx);

      Object.assign(renderProps, {
        html,
        state: JSON.stringify(state),
        helmet,
      });

      const assets = getAssets(manifest, preloadBundles, config);
      debug('assets:');
      debug(inspect(assets, { colors: true, depth: null }));

      Object.assign(renderProps, assets);
    }


    // FIXME: DO Some security thing to ensure only escaped string will be rendered
    return isomorphic.render(renderProps);
  };
};

module.exports = getRenderer;
