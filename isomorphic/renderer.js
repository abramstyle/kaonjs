const { inspect } = require('util');
const { debugRender: debug } = require('../lib/debug');
const { getAssets } = require('../utils/assets');
const { waitFor } = require('../utils/');

const getRenderer = (config) => {
  // invalidate cache and require fresh cache
  const isomorphic = {};
  if (__DEV__) {
    console.log('delete main');
    delete require.cache[require.resolve(`${config.build.target}/main`)];
  }

  const { default: getServerRenderer } = require(`${config.build.target}/main`);
  isomorphic.render = require(config.renderer.template);
  isomorphic.serverRenderer = getServerRenderer(config);

  return async (ctx) => {
    const manifest = require(`${config.build.target}/manifest.json`);

    const renderProps = {
      helmet: {},
    };

    debug('manifest:');
    debug(inspect(manifest, { colors: true, depth: null }));

    if (__SSR__) {
      const {
        html, state, helmet, preloadBundles,
      } = await waitFor(isomorphic.serverRenderer(ctx));

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
