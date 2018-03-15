import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';

import PostList from '../../components/PostList';

import Panel from '../../components/Panel';
import * as commentActionCreators from './actions/comments';
import './style.css';

const propTypes = {
  comments: PropTypes.object.isRequired,
  commentActions: PropTypes.object.isRequired,
};

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleClickLoadMore = this.handleClickLoadMore.bind(this);
  }

  componentDidMount() {
    const { comments } = this.props;
    if (comments.get('page') === 1) {
      this.loadComments();
    }
  }

  handleClickLoadMore() {
    this.loadComments();
  }

  loadComments() {
    const { commentActions, comments } = this.props;

    return commentActions.fetchComments({
      _page: comments.get('page'),
      _limit: 5,
    });
  }

  render() {
    const { comments } = this.props;
    return (
      <div className="posts">
        <Panel
          title="Comments"
        >
          <Helmet>
            <html lang="zh-CH" country="cn" />
            <title>Posts - Cybertron</title>
            <meta name="keywords" content="posts,cybertron,isomorphic" />
            <meta name="description" content="cybertron renders your components from server." />
          </Helmet>
          <PostList posts={comments} />
          <button
            styleName="load-more"
            onClick={this.handleClickLoadMore}
          >Load more comments...
          </button>

        </Panel>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { comments } = state;
  return {
    comments,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commentActions: bindActionCreators(commentActionCreators, dispatch),
  };
}

Comments.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
