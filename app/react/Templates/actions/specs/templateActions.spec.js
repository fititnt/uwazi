import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import backend from 'fetch-mock';
import {actions as formActions} from 'react-redux-form';
import Immutable from 'immutable';

import {APIURL} from 'app/config.js';
import * as actions from 'app/Templates/actions/templateActions';
import * as notifications from 'app/Notifications/actions/notificationsActions';
import * as types from 'app/Templates/actions/actionTypes';
import * as notificationsTypes from 'app/Notifications/actions/actionTypes';
import {mockID} from 'shared/uniqueID';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('templateActions', () => {
  let dispatch;
  let getState;
  let formModel;
  beforeEach(() => {
    mockID();
    formModel = {
      thesauris: Immutable.fromJS([{_id: 'first_thesauri_id'}, {_id: 2}]),
      template: {
        data: {properties: [{name: 'property1'}, {name: 'property2'}]}
      }
    };
    dispatch = jasmine.createSpy('dispatch');
    getState = jasmine.createSpy('getState').and.returnValue(formModel);
    spyOn(formActions, 'change');
    spyOn(formActions, 'load');
    spyOn(formActions, 'move');
    spyOn(formActions, 'remove');
    spyOn(formActions, 'reset');
  });

  describe('addProperty()', () => {
    it('should add the property to the form data with a unique id in the index provided', () => {
      actions.addProperty({name: 'property3'}, 0)(dispatch, getState);
      expect(formActions.change).toHaveBeenCalledWith('template.data.properties', [
        {name: 'property3', localID: 'unique_id'},
        {name: 'property1'},
        {name: 'property2'}
      ]);
    });

    describe('when property is a select or multiselect', () => {
      it('should should add as first thesauri as default value', () => {
        actions.addProperty({name: 'property3', type: 'select'}, 0)(dispatch, getState);
        expect(formActions.change).toHaveBeenCalledWith('template.data.properties', [
          {name: 'property3', type: 'select', localID: 'unique_id', content: 'first_thesauri_id'},
          {name: 'property1'},
          {name: 'property2'}
        ]);

        actions.addProperty({name: 'property4', type: 'multiselect'}, 0)(dispatch, getState);
        expect(formActions.change).toHaveBeenCalledWith('template.data.properties', [
          {name: 'property4', type: 'multiselect', localID: 'unique_id', content: 'first_thesauri_id'},
          {name: 'property1'},
          {name: 'property2'}
        ]);
      });
    });
  });

  describe('setNestedProperties()', () => {
    it('should update the property in the index provided', () => {
      actions.setNestedProperties(0, ['123', '456'])(dispatch, getState);
      expect(formActions.load).toHaveBeenCalledWith('template.data.properties[0].nestedProperties', ['123', '456']);
    });
  });

  describe('updateProperty()', () => {
    it('should update the property in the index provided', () => {
      actions.updateProperty({name: 'new name'}, 0)(dispatch, getState);
      expect(formActions.change).toHaveBeenCalledWith('template.data.properties', [
        {name: 'new name'},
        {name: 'property2'}
      ]);
    });
  });

  describe('selectProperty()', () => {
    it('should return an SELECT_PROPERTY type action with the property index', () => {
      let action = actions.selectProperty('property index');
      expect(action).toEqual({type: types.SELECT_PROPERTY, index: 'property index'});
    });
  });

  describe('resetTemplate()', () => {
    it('should reset the form data', () => {
      actions.resetTemplate()(dispatch);
      expect(formActions.reset).toHaveBeenCalledWith('template.data');
    });
  });

  describe('removeProperty', () => {
    it('should remove the property from the data', () => {
      actions.removeProperty(1)(dispatch, getState);
      expect(formActions.change).toHaveBeenCalledWith('template.data.properties', [{name: 'property1'}]);
    });
  });

  describe('reorderProperty', () => {
    it('should reorder the properties in the form data', () => {
      actions.reorderProperty(1, 2)(dispatch);
      expect(formActions.move).toHaveBeenCalledWith('template.data.properties', 1, 2);
    });
  });

  describe('async actions', () => {
    beforeEach(() => {
      spyOn(notifications, 'notify');
      backend.restore();
      backend
      .post(APIURL + 'templates', {body: JSON.stringify({name: 'saved_template'})});
    });

    afterEach(() => backend.restore());

    describe('saveTemplate', () => {
      it('should save the template and dispatch a TEMPLATE_SAVED action', (done) => {
        spyOn(formActions, 'merge').and.returnValue({type: 'mergeAction'});
        let originalTemplateData = {name: 'my template', properties: [
          {localID: 'a1b2', label: 'my property'},
          {localID: 'a1b3', label: 'my property'}
        ]};

        const expectedActions = [
          {type: types.SAVING_TEMPLATE},
          {type: types.TEMPLATE_SAVED, data: {name: 'saved_template'}},
          {type: 'templates/UPDATE', value: {name: 'saved_template'}},
          {type: 'mergeAction'},
          {type: notificationsTypes.NOTIFY, notification: {message: 'Saved successfully.', type: 'success', id: 'unique_id'}}
        ];
        const store = mockStore({});

        store.dispatch(actions.saveTemplate(originalTemplateData))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);

          expect(originalTemplateData.properties[0].localID).toBe('a1b2');
          expect(formActions.merge).toHaveBeenCalledWith('template.data', {name: 'saved_template'});
        })
        .then(done)
        .catch(done.fail);
      });
    });
  });
});
