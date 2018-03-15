import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import * as postActionCreators from '../../actions/posts';
import reducers from './reducers';
import generateReducers from '../../reducers';

const nextReducer = generateReducers(reducers);

const LoadablePosts = Loadable({
  loader: () => import('./Posts'),
  loading() {
    return <div>Loading Post Component...</div>;
  },

  render(loaded, data) {
    const { store } = data;
    store.replaceReducer(nextReducer());
    // console.log('replace reducer.');
    const Component = loaded.default;
    return <Component />;
  },
});

function Posts(props, context) {
  const { store } = context;
  const posts = (
    <LoadablePosts store={store} />
  );
  return posts;
}

Posts.contextTypes = {
  store: PropTypes.object,
};

Posts.getInitialProps = dispatch => dispatch(postActionCreators.fetchPosts({
  _page: 1,
  _limit: 5,
}));

Posts.nextReducer = nextReducer;


export default Posts;
