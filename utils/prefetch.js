const { getComponents } = require('./routes');

function isFunction(object) {
  return typeof object === 'function';
}

async function preFetch(config) {
  const {
    routes,
    url,
    store,
  } = config;


  const components = getComponents(routes, url);
  const fetchingList = [];

  components.forEach((component) => {
    const { nextReducer, getInitialProps } = component;
    if (nextReducer) {
      store.replaceReducer(nextReducer);
    }

    if (getInitialProps && isFunction(getInitialProps)) {
      fetchingList.push(getInitialProps(store.dispatch));
    }
  });

  return Promise.all(fetchingList);
}

module.exports = preFetch;
