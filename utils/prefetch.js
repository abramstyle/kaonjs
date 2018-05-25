const { getComponents } = require('./routes');

function isFunction(object) {
  return typeof object === 'function';
}

async function prefetch(config) {
  const {
    routes,
    path,
    store,
  } = config;


  const components = getComponents(routes, path) || [];
  const fetchingList = [];

  components.forEach((item) => {
    const { component, params } = item;
    const { nextReducer, getInitialProps } = component;
    if (typeof nextReducer === 'function') {
      store.replaceReducer(nextReducer());
    }

    if (getInitialProps && isFunction(getInitialProps)) {
      fetchingList.push(getInitialProps(store.dispatch, params));
    }
  });

  return Promise.all(fetchingList);
}

module.exports = prefetch;
