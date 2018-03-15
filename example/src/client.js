import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';

// import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

import routes from './routes';
import store from './store';
// import App from './containers/App';
const App = () => (
  <Router>
    {renderRoutes(routes)}
  </Router>
);
const HotReloadableApp = hot(module)(App);


const render = () => {
  // Loadable.preloadReady().then(() => {
  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
      <Provider store={store}>
        <HotReloadableApp />
      </Provider>,
      document.querySelector('#root'),
    );
  });
};
render();
