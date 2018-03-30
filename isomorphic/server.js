import React from 'react';
import ReactDOMServer from 'react-dom/server';

// AppContainer is a necessary wrapper component for HMR
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import prefetch from '../utils/prefetch';

const {
  stats, configureStore, routes, App,
} = require('./clientConfig');

const getRenderer = async () => async (ctx) => {
  // const context = {};
  const store = configureStore(ctx)();
  const context = {};

  await prefetch({
    routes,
    path: ctx.path,
    store,
  });

  const state = store.getState();
  const modules = [];

  const app = App ? (
    <App />
  ) : renderRoutes(routes);

  const Container = (
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <Provider store={store}>
        <Router
          location={ctx.url}
          context={context}
        >
          {app}
        </Router>
      </Provider>
    </Loadable.Capture>
  );

  const html = ReactDOMServer.renderToString(Container);
  const helmet = Helmet.renderStatic();

  // console.log('modules: ', modules, stats);
  const bundles = getBundles(stats, modules);

  return {
    html,
    state,
    helmet,
    bundles,
    store,
  };
};

export default getRenderer;
