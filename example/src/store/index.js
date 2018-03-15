/* global window */
/* eslint no-underscore-dangle: ["error", { "allow": ["__PRELOADED_STATE__"] }] */
import { fromJS } from 'immutable';
import configureStore from './configureStore';

const preloadedState = (typeof __PRELOADED_STATE__ !== 'undefined') ? __PRELOADED_STATE__ : undefined;
const state = preloadedState ? Object.keys(preloadedState).reduce((result, key) => {
  result[key] = fromJS(preloadedState[key]);
  return result;
}, {}) : undefined;

const store = configureStore(state);
export {
  state as preloadedState,
  store as default,
};
