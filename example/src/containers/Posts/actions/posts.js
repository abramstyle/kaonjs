import { CALL_API } from '@abramstyle/redux-api';

import actionTypes from '../../../constants/actionTypes';
import { api } from '../../../helpers/url';

export function fetchPosts(data = {}) {
  return {
    [CALL_API]: {
      url: api('/posts'),
      query: data,
      types: [
        actionTypes.FETCH_POSTS_REQUEST,
        actionTypes.FETCH_POSTS_SUCCESS,
        actionTypes.FETCH_POSTS_FAILURE,
      ],
    },
  };
}

export function updatePostsPage(page = 1) {
  return {
    type: actionTypes.UPDATE_POSTS_PAGE,
    payload: page,
  };
}
