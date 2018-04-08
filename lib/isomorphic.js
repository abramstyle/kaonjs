// isomorphic middleware
const isomorphic = (config) => {
  const getRenderer = require('../isomorphic/renderer');
  const { waitFor } = require('../utils');
  const render = getRenderer(config);

  return async (ctx) => {
    const markup = await waitFor(render(ctx));
    ctx.body = markup;
    ctx.status = 200;
  };
};

module.exports = isomorphic;
