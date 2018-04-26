// isomorphic middleware
const isomorphic = (config) => {
  const getRenderer = require('../isomorphic/renderer');
  const { waitFor } = require('../utils');
  const render = getRenderer(config);

  return async (ctx) => {
    const renderResult = await waitFor(render(ctx));
    if (renderResult.redirect && renderResult.redirect.url) {
      ctx.status = renderResult.redirect.status || 302;
      ctx.redirect(renderResult.redirect.url);
      ctx.body = `redirecting to ${renderResult.redirect.url}`;
      return;
    }

    ctx.body = renderResult.content;
    ctx.status = 200;
  };
};

module.exports = isomorphic;
