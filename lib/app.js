async function generateApp({ config, routes }) {
  const Koa = require('koa');
  const bodyParser = require('koa-bodyparser');
  const views = require('koa-views');
  const koaStatic = require('koa-static');
  const applyMiddlewares = require('../utils/applyMiddlewares');
  const { colors } = require('./ui');
  // const { waitFor } = require('../utils');

  require('css-modules-require-hook')({
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    devMode: true,
  });

  const app = new Koa();

  // inject config
  app.context.config = config;
  app.keys = config.app.keys;

  // if external middlewares provided, then apply it
  if (config.app.middlewares) {
    applyMiddlewares(config.app.middlewares, app);
  }


  app.use(bodyParser());

  // Must be used before any router is used
  app.use(views(`${__dirname}/views`, {
    map: {
      pug: 'pug',
    },
  }));
  app.use(koaStatic(config.resources.root));

  if (typeof routes === 'function') {
    routes(app);
  }

  const isomorphic = require('./isomorphic');
  app.use(isomorphic(config));

  // await waitFor(Loadable.preloadAll());

  return app.listen(config.app.port, () => {
    console.log(colors.success('%s served on port %s'), config.app.name, config.app.port);
  });
}

module.exports = generateApp;
