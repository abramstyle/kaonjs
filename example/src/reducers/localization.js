import { fromJS } from 'immutable';

const initialState = fromJS({
  country: 'US',
  language: 'en',
  currency: {
    code: '$',
  },
});

function localization(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

export default localization;
