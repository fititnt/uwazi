import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

import {mapStateToProps, ThesauriForm} from 'app/Thesauris/components/ThesauriForm.js';

describe('ThesauriForm', () => {
  let props;
  let component;
  beforeEach(() => {
    props = {
      fields: {name: {}, values: []},
      resetThesauri: jasmine.createSpy('resetThesauri'),
      handleSubmit: jasmine.createSpy('handleSubmit')
    };

    component = shallow(<ThesauriForm {...props}/>);
  });

  describe('when unmount', () => {
    it('shoould call resetThesauri', () => {
      component.unmount();
      expect(props.resetThesauri).toHaveBeenCalled();
    });
  });

  describe('mapStateToProps', () => {
    let state;
    beforeEach(() => {
      state = {
        thesauri: Immutable.fromJS({name: 'thesauri name', values: []})
      };
    });

    it('should map the thesauri to initialValues', () => {
      expect(mapStateToProps(state).initialValues).toEqual({name: 'thesauri name', values: []});
    });

    it('should map the fields', () => {
      expect(mapStateToProps(state).fields).toEqual(['name', 'values[].label', 'values[].id', '_id', '_rev']);
    });

    describe('validation', () => {
      it('should add an error if the template has no name', () => {
        let errors = mapStateToProps(state).validate({name: '', values: []});
        expect(errors.name).toBe('Required');
      });
    });
  });
});
