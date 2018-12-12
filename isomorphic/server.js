import React from 'react';
import ReactDOMServer from 'react-dom/server';

// AppContainer is a necessary wrapper component for HMR
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import { ChunkExtractor } from '@loadable/server';

import prefetch from '../utils/prefetch';

// to catch client compiling error
/* eslint import/no-unresolved: 0 */
let configureStore = null;
let getRoutes = null;
let App = null;
try {
  ({
    configureStore, getRoutes, App,
  } = require('./clientConfig'));
} catch (e) {
  console.log('Client Code Error: ', e);
}

const getRenderer = () => async (ctx) => {
  // const context = {};
  const store = configureStore(ctx)();
  const { config } = ctx;
  const context = {};
  const routes = typeof getRoutes === 'function' ? getRoutes(ctx) : getRoutes;

  const statsFile = `${config.build.target}/loadable-stats.json`;
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['app'] });

  await prefetch({
    routes,
    path: ctx.path,
    store,
  });

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

  const jsx = extractor.collectChunks(Container);
  const html = ReactDOMServer.renderToString(jsx);
  const helmet = Helmet.renderStatic();

  const state = store.getState();

  const allAttributes = Object.keys(helmet).reduce((attributes, key) => {
    attributes[key] = (helmet[key] || {}).toString();

    return attributes;
  }, {});
  const statics = {
    scripts: extractor.getScriptTags(),
    link: extractor.getLinkTags(),
    style: extractor.getStyleTags(),
  };


  return {
    html,
    state,
    helmet: allAttributes,
    // preloadBundles,
    redirect: context,
    statics,
    store,
  };
};

export default getRenderer;
