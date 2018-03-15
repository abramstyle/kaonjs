import React from 'react';
import PropTypes from 'prop-types';

import PostItem from './PostItem';
import './style.css';

const propTypes = {
  posts: PropTypes.object.isRequired,
};

function PostItems(props) {
  const { posts } = props;
  const items = posts.get('items');

  const postItems = items.length === 0 ? (
    <div className="empty">There is no post yet.</div>
  ) : (
    <ul styleName="post-list">
      {
        items.map(post => (
          <li
            styleName="post-item"
            key={post.get('id')}
          >
            <PostItem
              post={post}
            />
          </li>
          ))
        }
    </ul>
  );

  return (
    <div styleName="post-items">{postItems}</div>
  );
}

PostItems.propTypes = propTypes;

export default PostItems;
