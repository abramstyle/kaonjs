import React from 'react';
import ReactDOMServer from 'react-dom/server';

// AppContainer is a necessary wrapper component for HMR
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import { getLoadableState } from 'loadable-components/server';
// import { getBundles } from 'loadable-components/webpack';

import prefetch from '../utils/prefetch';
import { waitFor } from '../utils/';

const {
  configureStore, getRoutes, App,
} = require('./clientConfig');

const getRenderer = () => async (ctx) => {
  // const context = {};
  const store = configureStore(ctx)();
  const context = {};
  const routes = typeof getRoutes === 'function' ? getRoutes(ctx) : getRoutes;

  await waitFor(prefetch({
    routes,
    path: ctx.path,
    store,
  }));

  const app = App ? (
    <App />
  ) : renderRoutes(routes);

  const Container = (
    <Provider store={store}>
      <Router
        location={ctx.url}
        basename={ctx.state.basename}
        context={context}
      >
        {app}
      </Router>
    </Provider>
  );

  const loadableState = await getLoadableState(Container);
  const html = ReactDOMServer.renderToString(Container);
  const helmet = Helmet.renderStatic();

  const state = store.getState();

  const allAttributes = Object.keys(helmet).reduce((attributes, key) => {
    attributes[key] = (helmet[key] || {}).toString();

    return attributes;
  }, {});


  return {
    html,
    state,
    helmet: allAttributes,
    // preloadBundles,
    redirect: context,
    loadableState,
    store,
  };
};

export default getRenderer;
