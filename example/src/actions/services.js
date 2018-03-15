import { CALL_API } from '@abramstyle/redux-api';

import actionTypes from '../constants/actionTypes';
import { api } from '../helpers/url';

export function fetchServices() {
  return {
    [CALL_API]: {
      url: api('/api/v1/docker_services/'),
      types: [
        actionTypes.FETCH_SERVICES_REQUEST,
        actionTypes.FETCH_SERVICES_SUCCESS,
        actionTypes.FETCH_SERVICES_FAILURE,
      ],
    },
  };
}
