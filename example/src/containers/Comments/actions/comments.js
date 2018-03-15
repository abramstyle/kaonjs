import { CALL_API } from '@abramstyle/redux-api';

import actionTypes from '../../../constants/actionTypes';
import { api } from '../../../helpers/url';

export function fetchComments(data = {}) {
  return {
    [CALL_API]: {
      url: api('/comments'),
      query: data,
      types: [
        actionTypes.FETCH_COMMENTS_REQUEST,
        actionTypes.FETCH_COMMENTS_SUCCESS,
        actionTypes.FETCH_COMMENTS_FAILURE,
      ],
    },
  };
}
