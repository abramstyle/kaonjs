/* global window */
/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] }] */

import { applyMiddleware, compose, createStore } from 'redux';
import reduxAPIGenerator from '@abramstyle/redux-api';

import generateReducers from '../reducers';

const api = reduxAPIGenerator();


const root = typeof window !== 'undefined' && window;
const middlewares = [
  api,
];

const composeEnhancers = root.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = preloadedState => createStore(generateReducers({})(preloadedState), preloadedState, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore;
