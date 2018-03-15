const koaLogger = require('koa-logger');

function applyMiddlewares(app) {
  app.use(koaLogger());
}

module.exports = applyMiddlewares;
