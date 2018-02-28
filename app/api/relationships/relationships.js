import templatesAPI from 'api/templates';
import relationtypes from 'api/relationtypes';
import {generateNamesAndIds} from '../templates/utils';
import entities from 'api/entities/entities';

import model from './model';
import search from '../search/search';
import {generateID} from 'api/odm';
import {createError} from 'api/utils';

import {filterRelevantRelationships, groupRelationships} from './groupByRelationships';

let normalizeConnectedDocumentData = (relationship, connectedDocument) => {
  relationship.entityData = connectedDocument;
  return relationship;
};

function excludeRefs(template) {
  delete template.refs;
  return template;
}

function getPropertiesToBeConnections(template) {
  return template.properties.filter((prop) => prop.type === 'relationship');
}

function groupByHubs(references) {
  let hubs = references.reduce((_hubs, reference) => {
    if (!_hubs[reference.hub]) {
      _hubs[reference.hub] = [];
    }
    _hubs[reference.hub].push(reference);
    return _hubs;
  }, []);
  return Object.keys(hubs).map((key) => hubs[key]);
}

function findPropertyHub(propertyRelationType, hubs, entitySharedId) {
  return hubs.reduce((result, hub) => {
    const allReferencesAreOfTheType = hub.every((reference) => {
      return reference.entity === entitySharedId || reference.template.toString() === propertyRelationType;
    });
    if (allReferencesAreOfTheType) {
      return hub;
    }

    return result;
  }, null);
}

export default {
  get(query) {
    return model.get(query);
  },

  getById(id) {
    return model.getById(id);
  },

  getDocumentHubs(id, language) {
    return model.get({entity: id, language})
    .then((ownRelations) => {
      const hubsIds = ownRelations.map(relationship => relationship.hub);
      return model.db.aggregate([
        {$match: {hub: {$in: hubsIds}, language}},
        {$group: {
          _id: '$hub',
          relationships: {$push: '$$ROOT'},
          count: {$sum: 1}
        }}
      ]);
    })
    .then((hubs) => {
      return hubs.filter((hub) => hub.count > 1);
    });
  },

  getByDocument(id, language, withEntityData = true) {
    return this.getDocumentHubs(id, language)
    .then((hubs) => {
      const relationships = Array.prototype.concat(...hubs.map((hub) => hub.relationships));
      let connectedEntityiesSharedId = relationships.map((relationship) => relationship.entity);
      return entities.get({sharedId: {$in: connectedEntityiesSharedId}, language})
      .then((_connectedDocuments) => {
        const connectedDocuments = _connectedDocuments.reduce((res, doc) => {
          res[doc.sharedId] = doc;
          return res;
        }, {});
        return relationships.map((relationship) => {
          if (withEntityData) {
            return normalizeConnectedDocumentData(relationship, connectedDocuments[relationship.entity]);
          }
          return relationship;
        });
      });
    });
  },

  getGroupsByConnection(id, language, options = {}) {
    return Promise.all([
      this.getByDocument(id, language),
      templatesAPI.get(),
      relationtypes.get()
    ])
    .then(([references, templates, relationTypes]) => {
      const relevantReferences = filterRelevantRelationships(references, id, language, options.user);
      const groupedReferences = groupRelationships(relevantReferences, templates, relationTypes);

      if (options.excludeRefs) {
        groupedReferences.forEach(g => {
          g.templates = g.templates.map(excludeRefs);
        });
      }
      return groupedReferences;
    });
  },

  getHub(hub, language) {
    return model.get({hub, language});
  },

  countByRelationType(typeId) {
    return model.count({template: typeId});
  },

  getAllLanguages(sharedId) {
    return model.get({sharedId});
  },

  updateRelationship(relationship) {
    return Promise.all([relationtypes.getById(relationship.template), model.get({sharedId: relationship.sharedId})])
    .then(([template, relationshipsVersions]) => {
      let toSyncProperties = [];
      if (template && template.properties) {
        toSyncProperties = template.properties
        .filter(p => p.type.match('select|multiselect|date|multidate|multidaterange|nested'))
        .map(p => p.name);
      }

      relationship.metadata = relationship.metadata || {};
      const updateRelationships = relationshipsVersions.map((relation) => {
        if (relationship._id.toString() === relation._id.toString()) {
          return model.save(relationship);
        }

        toSyncProperties.map((propertyName) => {
          relation.metadata = relation.metadata || {};
          relation.metadata[propertyName] = relationship.metadata[propertyName];
        });

        return model.save(relation);
      });

      return Promise.all(updateRelationships);
    });
  },

  createRelationship(relationship) {
    relationship.sharedId = generateID();
    return entities.get({sharedId: relationship.entity})
    .then((entitiesVersions) => {
      const currentLanguageEntity = entitiesVersions.find((entity) => entity.language === relationship.language);
      currentLanguageEntity.file = currentLanguageEntity.file || {};
      const relationshipsCreation = entitiesVersions.map((entity) => {
        const isATextReference = relationship.range;
        entity.file = entity.file || {};
        const entityFileDoesNotMatch = currentLanguageEntity.file.filename !== entity.file.filename;
        if (isATextReference && entityFileDoesNotMatch) {
          return Promise.resolve();
        }
        relationship.language = entity.language;
        return model.save(relationship);
      });
      return Promise.all(relationshipsCreation);
    });
  },

  save(_relationships, language, updateMetdata = true) {
    if (!language) {
      return Promise.reject(createError('Language cant be undefined'));
    }
    let relationships = _relationships;
    if (!Array.isArray(relationships)) {
      relationships = [relationships];
    }

    if (relationships.length === 1 && !relationships[0].hub) {
      return Promise.reject(createError('Single relationships must have a hub'));
    }
    const hub = relationships[0].hub || generateID();
    return Promise.all(
      relationships.map((relationship) => {
        let action;
        relationship.hub = hub;
        relationship.language = language;
        if (relationship.sharedId) {
          action = this.updateRelationship(relationship);
        }

        if (!relationship.sharedId) {
          action = this.createRelationship(relationship);
        }

        return action
        .then((savedRelationships) => {
          let savedRelationship = savedRelationships.find((rel) => rel && rel.language === language);
          return Promise.all([savedRelationship, entities.getById(savedRelationship.entity, language)]);
        })
        .then(([result, connectedEntity]) => {
          if (updateMetdata) {
            return this.updateEntitiesMetadataByHub(hub, language)
            .then(() => {
              return normalizeConnectedDocumentData(result, connectedEntity);
            });
          }
          return normalizeConnectedDocumentData(result, connectedEntity);
        })
        .catch(console.log);
      }));
  },

  updateEntitiesMetadataByHub(hubId, language) {
    return this.getHub(hubId, language)
    .then((hub) => {
      return entities.updateMetdataFromRelationships(hub.map((r) => r.entity), language);
    });
  },

  updateEntitiesMetadata(entitiesIds, language) {
    return entities.updateMetdataFromRelationships(entitiesIds, language);
  },

  saveEntityBasedReferences(entity, language) {
    if (!language) {
      return Promise.reject(createError('Language cant be undefined'));
    }
    if (!entity.template) {
      return Promise.resolve([]);
    }

    return templatesAPI.getById(entity.template)
    .then(getPropertiesToBeConnections)
    .then((properties) => {
      return Promise.all([properties, this.getByDocument(entity.sharedId, language)]);
    })
    .then(([properties, references]) => {
      return Promise.all(properties.map((property) => {
        let propertyValues = entity.metadata[property.name] || [];
        if (typeof propertyValues === 'string') {
          propertyValues = [propertyValues];
        }
        let hubs = groupByHubs(references);
        let propertyRelationType = property.relationType;
        let propertyHub = findPropertyHub(propertyRelationType, hubs, entity.sharedId);
        if (!propertyHub) {
          propertyHub = [{entity: entity.sharedId, hub: generateID()}];
        }

        let referencesOfThisType = references.filter((reference) =>
          reference.template &&
          reference.template.toString() === propertyRelationType.toString()
        );

        propertyValues.forEach((entitySharedId) => {
          let relationshipDoesNotExists = !referencesOfThisType.find((reference) => reference.entity === entitySharedId);
          if (relationshipDoesNotExists) {
            propertyHub.push({entity: entitySharedId, hub: propertyHub[0].hub, template: propertyRelationType});
          }
        });
        propertyHub = propertyHub.filter((reference) => reference.entity === entity.sharedId || propertyValues.includes(reference.entity));
        const referencesToBeDeleted = references.filter((reference) => {
          return !(reference.entity === entity.sharedId) &&
          reference.template.toString() === propertyRelationType.toString() &&
          !propertyValues.includes(reference.entity);
        });
        let actions = referencesToBeDeleted.map((reference) => this.delete({_id: reference._id}, language, false));
        if (propertyHub.length > 1) {
          actions = actions.concat(this.save(propertyHub, language, false));
        }
        return Promise.all(actions);
      })).catch(console.log);
    });
  },

  search(entitySharedId, query, language) {
    if (!language) {
      return Promise.reject(createError('Language cant be undefined'));
    }
    return Promise.all([this.getByDocument(entitySharedId, language), entities.getById(entitySharedId, language)])
    .then(([relationships, entity]) => {
      let filter = Object.keys(query.filter).reduce((result, filterGroupKey) => {
        return result.concat(query.filter[filterGroupKey]);
      }, []);
      let filteredRelationships = relationships.filter((relationship) => {
        return !filter.length || filter.includes(relationship.template + relationship.entityData.template);
      });

      let ids = filteredRelationships
      .map((relationship) => relationship.entity)
      .reduce((result, id) => {
        if (!result.includes(id) && id !== entitySharedId) {
          result.push(id);
        }
        return result;
      }, []);
      query.ids = ids.length ? ids : ['no_results'];
      query.includeUnpublished = true;
      query.limit = 9999;
      delete query.filter;

      return search.search(query, language)
      .then(results => {
        results.rows.forEach(item => {
          item.connections = filteredRelationships.filter((relationship) => relationship.entity === item.sharedId);
        });
        if (results.rows.length) {
          let filteredRelationshipsHubs = results.rows.map((item) => item.connections.map((relationship) => relationship.hub.toString()));
          filteredRelationshipsHubs = Array.prototype.concat(...filteredRelationshipsHubs);
          entity.connections = relationships.filter((relationship) => {
            return relationship.entity === entitySharedId && filteredRelationshipsHubs.includes(relationship.hub.toString());
          });
          results.rows.push(entity);
        }
        return results;
      });
    });
  },

  delete(relation, language, updateMetdata = true) {
    if (!relation) {
      return Promise.reject(createError('Cant delete without a condition'));
    }
    return model.get(relation)
    .then((relationships) => {
      return Promise.all(relationships.map((_relation) => model.get({hub: _relation.hub, language: _relation.language})));
    })
    .then((hubs) => {
      return Promise.all(hubs.map((hub) => {
        const shouldDeleteTheLoneConnectionToo = hub.length === 2;
        const hubId = hub[0].hub;
        let deleteAction;
        if (shouldDeleteTheLoneConnectionToo) {
          deleteAction = model.delete({hub: hubId});
        } else {
          deleteAction = model.delete(relation);
        }

        if (updateMetdata) {
          return deleteAction.then(() => this.updateEntitiesMetadata(hub.map((r) => r.entity), language));
        }
        return deleteAction;
      }));
    })
    .catch(console.log);
  },

  deleteTextReferences(sharedId, language) {
    return model.delete({entity: sharedId, language, range: {$exists: true}});
  },

  updateMetadataProperties(template, currentTemplate) {
    let actions = {};
    actions.$rename = {};
    actions.$unset = {};
    template.properties = generateNamesAndIds(template.properties);
    template.properties.forEach((property) => {
      let currentProperty = currentTemplate.properties.find(p => p.id === property.id);
      if (currentProperty && currentProperty.name !== property.name) {
        actions.$rename['metadata.' + currentProperty.name] = 'metadata.' + property.name;
      }
    });
    currentTemplate.properties.forEach((property) => {
      if (!template.properties.find(p => p.id === property.id)) {
        actions.$unset['metadata.' + property.name] = '';
      }
    });

    let noneToUnset = !Object.keys(actions.$unset).length;
    let noneToRename = !Object.keys(actions.$rename).length;

    if (noneToUnset) {
      delete actions.$unset;
    }
    if (noneToRename) {
      delete actions.$rename;
    }

    if (noneToRename && noneToUnset) {
      return Promise.resolve();
    }

    return model.db.updateMany({template}, actions);
  }
};
