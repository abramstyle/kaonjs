import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import * as commentActionCreators from './actions/comments';
import reducers from './reducers';
import generateReducers from '../../reducers';

const nextReducer = generateReducers(reducers);

const LoadableComments = Loadable({
  loader: () => import('./Comments'),
  loading() {
    return <div>Loading Comment Component...</div>;
  },
  render(loaded, data) {
    const { store } = data;
    store.replaceReducer(nextReducer());
    // console.log('replace reducer.');
    const Component = loaded.default;
    return <Component />;
  },
});

function Comments(props, context) {
  const { store } = context;
  return <LoadableComments store={store} />;
}

Comments.contextTypes = {
  store: PropTypes.object,
};

Comments.getInitialProps = dispatch => dispatch(commentActionCreators.fetchComments({
  _page: 1,
  _limit: 5,
}));

Comments.nextReducer = nextReducer;


export default Comments;
