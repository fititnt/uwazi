import Immutable from 'immutable';
import * as actions from '~/Thesauris/actions/thesaurisActions';
import * as types from '~/Thesauris/actions/actionTypes';

import thesauriReducer from '~/Thesauris/reducers/thesauriReducer';
import 'jasmine-immutablejs-matchers';

describe('thesauriReducer', () => {
  describe('when state is undefined', () => {
    it('returns initial', () => {
      let newState = thesauriReducer();
      expect(newState).toEqual(Immutable.fromJS({name: '', values: []}));
    });
  });

  describe('EDIT_THESAURI', () => {
    it('should set the given thesauri in the state to be edited', () => {
      let thesauri = {name: 'Edit me!', values: []};
      let newState = thesauriReducer(null, actions.editThesauri(thesauri));
      expect(newState).toEqual(Immutable.fromJS(thesauri));
    });
  });

  describe('RESET_THESAURI', () => {
    it('should clear the data from the state', () => {
      let state = Immutable.fromJS({name: 'Edit me!', values: []});
      let action = {type: types.RESET_THESAURI};
      let newState = thesauriReducer(state, action);
      expect(newState).toEqual(Immutable.fromJS({name: '', values: []}));
    });
  });
});