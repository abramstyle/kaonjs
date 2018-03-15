async function loadMiddlewares(middlewarePath, app) {
  try {
    const applyMiddlewares = require(middlewarePath);
    if (typeof applyMiddlewares === 'function') {
      applyMiddlewares(app);
    }
  } catch (e) {
    console.warn('middleware path specified, but load middleware failed.');
  }
}

module.exports = loadMiddlewares;
