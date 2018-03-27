async function loadMiddlewares(middlewarePath, app) {
  let applyMiddlewares = () => {};
  try {
    applyMiddlewares = require(middlewarePath);
  } catch (e) {
    console.warn('middleware path specified, but load middleware failed.');
  }
  if (typeof applyMiddlewares === 'function') {
    applyMiddlewares(app);
  }
}

module.exports = loadMiddlewares;
