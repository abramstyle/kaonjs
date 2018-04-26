const { inspect } = require('util');
const { debugRender: debug } = require('../lib/debug');
const serialize = require('serialize-javascript');
const { getAssets } = require('../utils/assets');
const { waitFor } = require('../utils/');

const getRenderer = (config) => {
  // invalidate cache and require fresh cache
  const isomorphic = {};
  if (__SSR__) {
    if (__DEV__) {
      delete require.cache[require.resolve(`${config.build.target}/main`)];
    }

    const { default: getServerRenderer } = require(`${config.build.target}/main`);
    isomorphic.serverRenderer = getServerRenderer(config);
  }
  isomorphic.render = require(config.renderer.template);

  return async (ctx) => {
    const manifest = require(`${config.build.target}/manifest.json`);

    const renderProps = {
      helmet: {},
    };
    const renderResult = {
      content: null,
      redirect: null,
    };

    debug('manifest:');
    debug(inspect(manifest, { colors: true, depth: null }));


    const assets = getAssets(manifest, config);
    Object.assign(renderProps, assets);
    if (__SSR__) {
      const {
        html, state, helmet, loadableState, redirect,
      } = await waitFor(isomorphic.serverRenderer(ctx));

      renderResult.redirect = redirect;

      Object.assign(renderProps, {
        html,
        state: serialize(state),
        helmet,
      });

      debug(inspect(assets, { colors: true, depth: null }));

      Object.assign(renderProps, {
        loadableState: loadableState.getScriptTag(),
      });
    }


    // FIXME: DO Some security thing to ensure only escaped string will be rendered

    renderResult.content = isomorphic.render(renderProps);
    return renderResult;
  };
};

module.exports = getRenderer;
