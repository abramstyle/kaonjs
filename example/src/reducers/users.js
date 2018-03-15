import { fromJS } from 'immutable';

const initialState = fromJS({
  logged: false,
  data: {},
});

function users(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

export default users;
