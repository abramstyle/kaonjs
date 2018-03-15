import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Helmet from 'react-helmet';
import Panel from '../../components/Panel';
import PostList from '../../components/PostList';

import * as postActionCreators from './actions/posts';
import './style.css';

const propTypes = {
  postActions: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleClickLoadMore = this.handleClickLoadMore.bind(this);
  }

  componentDidMount() {
    const { posts } = this.props;
    if (posts.get('page') === 1) {
      this.loadPosts();
    }
  }

  loadPosts() {
    const { postActions, posts } = this.props;
    return postActions.fetchPosts({
      _page: posts.get('page'),
      _limit: 5,
    });
  }

  handleClickLoadMore() {
    this.loadPosts();
  }


  render() {
    const { posts } = this.props;
    return (
      <div className="posts">
        <Panel
          title="Posts"
        >
          <Helmet>
            <html lang="zh-CH" country="cn" />
            <title>Posts - Cybertron</title>
            <meta name="keywords" content="posts,cybertron,isomorphic" />
            <meta name="description" content="cybertron renders your components from server." />
          </Helmet>
          <PostList posts={posts} />
          <button
            styleName="load-more"
            onClick={this.handleClickLoadMore}
          >Load more posts...
          </button>
        </Panel>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { posts } = state;
  return {
    posts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postActions: bindActionCreators(postActionCreators, dispatch),
  };
}

Posts.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
