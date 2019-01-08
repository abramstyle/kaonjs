const serialize = require('serialize-javascript');
const { debugRender: debug } = require('../lib/debug');

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
    const renderProps = {
      helmet: {},
    };
    const renderResult = {
      content: null,
      redirect: null,
    };

    debug('manifest:');


    if (__SSR__) {
      const {
        html,
        state,
        helmet,
        redirect,
        statics,
      } = await isomorphic.serverRenderer(ctx);

      renderResult.redirect = redirect;

      Object.assign(renderProps, {
        html,
        state: serialize(state),
        helmet,
        statics,
      });
    }


    // FIXME: DO Some security thing to ensure only escaped string will be rendered

    renderResult.content = isomorphic.render(renderProps);
    return renderResult;
  };
};

module.exports = getRenderer;
