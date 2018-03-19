import {catchErrors} from 'api/utils/jasmineHelpers';
import translations from '../translations.js';

import db from 'api/utils/testing_db';
import fixtures, {entityTemplateId, documentTemplateId, englishTranslation} from './fixtures.js';


describe('translations', () => {
  beforeEach((done) => {
    db.clearAllAndLoad(fixtures).then(done).catch(catchErrors(done));
  });

  afterAll((done) => {
    db.disconnect().then(done);
  });

  describe('process System context', () => {
    it('should add keys that do not exist into all languages', (done) => {
      const keys = [{key: 'Password'}, {key: 'Account'}, {key: 'Email'}, {key: 'Age'}, {key: 'new key'}, {key: 'new key 2', label: 'label2'}];
      translations.processSystemKeys(keys)
      .then(translations.get)
      .then((result) => {
        const ESTrnaslations = result.find(t => t.locale === 'es').contexts.find(c => c.label === 'System').values;
        const ENTrnaslations = result.find(t => t.locale === 'en').contexts.find(c => c.label === 'System').values;

        expect(ENTrnaslations.Password).toBe('Password');
        expect(ENTrnaslations.Account).toBe('Account');
        expect(ENTrnaslations.Email).toBe('E-Mail');
        expect(ENTrnaslations.Age).toBe('Age');
        expect(ENTrnaslations['new key']).toBe('new key');
        expect(ENTrnaslations['new key 2']).toBe('label2');

        expect(ESTrnaslations.Password).toBe('Contraseña');
        expect(ESTrnaslations.Account).toBe('Cuenta');
        expect(ESTrnaslations.Email).toBe('Correo electronico');
        expect(ESTrnaslations.Age).toBe('Edad');
        expect(ESTrnaslations['new key']).toBe('new key');
        expect(ESTrnaslations['new key 2']).toBe('label2');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should delete the keys that are missing', (done) => {
      const keys = [{key: 'Email'}, {key: 'Age'}, {key: 'new key'}];
      translations.processSystemKeys(keys)
      .then(translations.get)
      .then((result) => {
        const ESTrnaslations = result.find(t => t.locale === 'es').contexts.find(c => c.label === 'System').values;
        const ENTrnaslations = result.find(t => t.locale === 'en').contexts.find(c => c.label === 'System').values;

        expect(ENTrnaslations.Password).not.toBeDefined();
        expect(ENTrnaslations.Account).not.toBeDefined();
        expect(ENTrnaslations.Email).toBe('E-Mail');
        expect(ENTrnaslations.Age).toBe('Age');
        expect(ENTrnaslations['new key']).toBe('new key');

        expect(ESTrnaslations.Password).not.toBeDefined();
        expect(ESTrnaslations.Account).not.toBeDefined();
        expect(ESTrnaslations.Email).toBe('Correo electronico');
        expect(ESTrnaslations.Age).toBe('Edad');
        expect(ESTrnaslations['new key']).toBe('new key');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('get()', () => {
    it('should return the translations', (done) => {
      translations.get()
      .then((result) => {
        expect(result.length).toBe(2);
        expect(result[0].locale).toBe('en');
        expect(result[0].contexts[0].id).toBe('System');
        expect(result[0].contexts[0].type).toBe('Uwazi UI');

        expect(result[0].contexts[1].id).toBe('Filters');
        expect(result[0].contexts[1].type).toBe('Uwazi UI');

        expect(result[0].contexts[2].id).toBe('Menu');
        expect(result[0].contexts[2].type).toBe('Uwazi UI');

        expect(result[0].contexts[3].id).toBe(entityTemplateId.toString());
        expect(result[0].contexts[3].type).toBe('Entity');

        expect(result[0].contexts[4].id).toBe(documentTemplateId.toString());
        expect(result[0].contexts[4].type).toBe('Document');

        expect(result[1].locale).toBe('es');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('save()', () => {
    it('should save the translation and return it', (done) => {
      translations.save({locale: 'fr'})
      .then((result) => {
        expect(result._id).toBeDefined();
        done();
      })
      .catch(catchErrors(done));
    });

    it('should transform values from map to array if its a map', (done) => {
      translations.save({locale: 'fr', contexts: [ {values: {test: 'value'}}, {values: [{key: 'test2', value: 'value2'}]}]})
      .then(() => translations.get())
      .then((result) => {
        let fr = result.find(r => r.locale === 'fr');
        expect(fr.contexts[0].values.test).toEqual('value');
        expect(fr.contexts[1].values.test2).toEqual('value2');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should save partial translations', (done) => {
      translations.save({_id: englishTranslation, locale: 'en', contexts: [{
        id: 'Filters',
        label: 'Filters',
        values: {something: 'new'}
      }]})
      .then(() => translations.get({_id: englishTranslation}))
      .then(([translation]) => {
        expect(translation.contexts.length).toBe(5);
        expect(translation.contexts.find((context) => context.id === 'Filters').values).toEqual({something: 'new'});
        done();
      });
    });
  });

  describe('addEntry()', () => {
    it('should add the new key to each dictionary in the given context', (done) => {
      translations.addEntry('System', 'Key', 'default')
      .then((result) => {
        expect(result).toBe('ok');
        return translations.get();
      })
      .then((result) => {
        expect(result[0].contexts[0].values.Key).toBe('default');
        expect(result[1].contexts[0].values.Key).toBe('default');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('addContext()', () => {
    it('should add a context with his values', (done) => {
      let values = {Name: 'Name', Surname: 'Surname'};
      translations.addContext('context', 'Judge', values, 'type')
      .then((result) => {
        expect(result).toBe('ok');
        return translations.get();
      })
      .then((result) => {
        expect(result.find(t => t.locale === 'en').contexts[5].values).toEqual(values);
        expect(result.find(t => t.locale === 'en').contexts[5].type).toEqual('type');
        expect(result.find(t => t.locale === 'es').contexts[1].values).toEqual(values);
        expect(result.find(t => t.locale === 'es').contexts[1].type).toEqual('type');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('deleteContext()', () => {
    it('should add a context with his values', (done) => {
      translations.deleteContext('System')
      .then((result) => {
        expect(result).toBe('ok');
        return translations.get();
      })
      .then((result) => {
        expect(result[0].contexts.length).toBe(4);
        expect(result[1].contexts.length).toBe(0);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('updateContext()', () => {
    it('should add values if the context values are undefined', (done) => {
      let keyNameChanges = {Password: 'Pass', Account: 'Acc', System: 'Interface'};
      let deletedProperties = ['Age'];
      let context = {Pass: 'Pass', Acc: 'Acc', Email: 'Email', Name: 'Name', Interface: 'Interface'};

      translations.updateContext('Menu', 'Menu', keyNameChanges, deletedProperties, context)
      .then((result) => {
        expect(result).toBe('ok');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should add a context with his values', (done) => {
      let keyNameChanges = {Password: 'Pass', Account: 'Acc', System: 'Interface'};
      let deletedProperties = ['Age'];
      let values = {Pass: 'Pass', Acc: 'Acc', Email: 'Email', Name: 'Names', Interface: 'Interfaces'};

      translations.updateContext('System', 'Interface', keyNameChanges, deletedProperties, values)
      .then((result) => {
        expect(result).toBe('ok');
        return translations.get();
      })
      .then((result) => {
        const en = result.find(t => t.locale === 'en');
        const es = result.find(t => t.locale === 'es');

        expect(en.contexts[0].label).toBe('Interface');
        expect(en.contexts[0].values.Pass).toBe('Pass');
        expect(en.contexts[0].values.Interface).toBe('Interfaces');
        expect(es.contexts[0].values.Pass).toBe('Contraseña');

        expect(en.contexts[0].values.Age).not.toBeDefined();
        expect(es.contexts[0].values.Age).not.toBeDefined();
        expect(en.contexts[0].values.System).not.toBeDefined();
        expect(es.contexts[0].values.System).not.toBeDefined();

        expect(en.contexts[0].values.Name).toBe('Names');
        expect(es.contexts[0].values.Name).toBe('Names');
        done();
      })
      .catch(catchErrors(done));
    });
  });
});
