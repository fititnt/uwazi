import * as types from '../actions/actionTypes';
import {fromJS} from 'immutable';

const initialState = {saving: false};

export default function (state = initialState, action = {}) {
  switch (action.type) {

  case types.SAVING_RELATIONSHIPS:
    console.log('Saving...');
    return state.set('saving', true);

  case types.SAVED_RELATIONSHIPS:
    console.log('Saved!!');
    console.log('Response:', action.response);
    return state.set('saving', false);

  default:
    return fromJS(state);
  }
}