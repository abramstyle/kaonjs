import React from 'react';
import PropTypes from 'prop-types';

import './PostItem.css';

const propTypes = {
  post: PropTypes.object.isRequired,
};

function PostItem(props) {
  const { post } = props;
  return (
    <div styleName="post">
      <div styleName="id">{post.get('id')}</div>
      <div styleName="title">{post.get('title')}</div>
      <div styleName="author">{post.get('author')}</div>
    </div>
  );
}

PostItem.propTypes = propTypes;

export default PostItem;
