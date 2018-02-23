import documentRoutes from '../routes.js';
import instrumentRoutes from '../../utils/instrumentRoutes';
import search from '../search';
import entities from 'api/entities';
import {catchErrors} from 'api/utils/jasmineHelpers';

describe('search routes', () => {
  let routes;

  beforeEach(() => {
    routes = instrumentRoutes(documentRoutes);
  });

  describe('/api/search/count_by_template', () => {
    it('should return count of search using a specific template', (done) => {
      spyOn(entities, 'countByTemplate').and.returnValue(new Promise((resolve) => resolve(2)));
      let req = {query: {templateId: 'templateId'}};

      routes.get('/api/search/count_by_template', req)
      .then((response) => {
        expect(response).toEqual(2);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('/api/search', () => {
    it('should search search and return the results', (done) => {
      spyOn(search, 'search').and.returnValue(new Promise((resolve) => resolve('results')));
      let filtersValue = JSON.stringify({property: 'property'});
      let types = JSON.stringify(['ruling', 'judgement']);
      let fields = JSON.stringify(['field1', 'field2']);
      let req = {query: {searchTerm: 'test', filters: filtersValue, types, fields}, language: 'es', user: 'user'};

      routes.get('/api/search', req)
      .then((response) => {
        expect(search.search).toHaveBeenCalledWith(
          {searchTerm: 'test', filters: {property: 'property'}, types: ['ruling', 'judgement'], fields: ['field1', 'field2']},
          'es',
          'user'
        );
        expect(response).toEqual('results');
        done();
      })
      .catch(catchErrors(done));
    });

    describe('when has no filters or types', () => {
      it('should search search and return the results', (done) => {
        spyOn(search, 'search').and.returnValue(new Promise((resolve) => resolve('results')));
        let req = {query: {}, language: 'es', user: 'user'};

        routes.get('/api/search', req)
        .then((response) => {
          expect(search.search).toHaveBeenCalledWith({}, 'es', 'user');
          expect(response).toEqual('results');
          done();
        })
        .catch(catchErrors(done));
      });
    });
  });

  describe('/api/search_snippets', () => {
    it('should search', (done) => {
      spyOn(search, 'searchSnippets').and.returnValue(new Promise((resolve) => resolve('results')));
      let req = {query: {searchTerm: 'test', id: 'id'}, language: 'es'};

      routes.get('/api/search_snippets', req)
      .then((response) => {
        expect(response).toEqual('results');
        expect(search.searchSnippets).toHaveBeenCalledWith('test', 'id', 'es');
        done();
      })
      .catch(catchErrors(done));
    });
  });
});
