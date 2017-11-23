import templatesAPI from 'api/templates';
import relationTypesAPI from 'api/relationtypes/relationtypes';
import {generateNamesAndIds} from '../templates/utils';
import entities from '../entities';

import model from './connectionsModel.js';

import {filterRelevantReferences, groupReferences} from './groupByConnection';

let normalizeConnection = (connection, docId) => {
  connection.targetRange = connection.targetRange || {text: ''};
  connection.sourceRange = connection.sourceRange || {text: ''};
  connection.inbound = connection.targetDocument === docId;
  connection.range = connection.inbound ? connection.targetRange : connection.sourceRange;
  connection.text = connection.inbound ? connection.sourceRange.text : connection.targetRange.text;
  connection.connectedDocument = connection.inbound ? connection.sourceDocument : connection.targetDocument;
  return connection;
};

let normalizeConnectedDocumentData = (connection, connectedDocument) => {
  connection.connectedDocumentTemplate = connectedDocument.template;
  connection.connectedDocumentType = connectedDocument.type;
  connection.connectedDocumentTitle = connectedDocument.title;
  connection.connectedDocumentIcon = connectedDocument.icon;
  connection.connectedDocumentPublished = Boolean(connectedDocument.published);
  connection.connectedDocumentMetadata = connectedDocument.metadata || {};
  connection.connectedDocumentCreationDate = connectedDocument.creationDate;
  connection.connectedDocumentFile = connectedDocument.file;
  return connection;
};

function excludeRefs(template) {
  delete template.refs;
  return template;
}

export default {
  get(query) {
    return model.get(query);
  },

  getById(id) {
    return model.getById(id);
  },

  getByDocument(id, language) {
    return model.get({$or: [{targetDocument: id}, {sourceDocument: id}]})
    .then((response) => {
      let connections = response.map((connection) => normalizeConnection(connection, id));
      let documentIds = connections.map((connection) => connection.connectedDocument);
      return entities.get({sharedId: {$in: documentIds}, language})
      .then((_connectedDocuments) => {
        const connectedDocuments = _connectedDocuments.reduce((res, doc) => {
          res[doc.sharedId] = doc;
          return res;
        }, {});
        return connections.map((connection) => {
          return normalizeConnectedDocumentData(connection, connectedDocuments[connection.connectedDocument]);
        });
      });
    });
  },

  getGroupsByConnection(id, language, options = {}) {
    return Promise.all([
      this.getByDocument(id, language),
      templatesAPI.get(),
      relationTypesAPI.get()
    ])
    .then(([references, templates, relationTypes]) => {
      const relevantReferences = filterRelevantReferences(references, language, options.user);
      const groupedReferences = groupReferences(relevantReferences, templates, relationTypes);

      if (options.excludeRefs) {
        groupedReferences.forEach(g => {
          g.templates = g.templates.map(excludeRefs);
        });
      }
      return groupedReferences;
    });
  },

  getByTarget(docId) {
    return model.get({targetDocument: docId});
  },

  countByRelationType(typeId) {
    return model.count({template: typeId});
  },

  save(connection, language) {
    return model.save(connection)
    .then((result) => {
      return normalizeConnection(result, connection.sourceDocument);
    })
    .then((result) => {
      return Promise.all([result, entities.getById(result.connectedDocument, language)]);
    })
    .then(([result, connectedDocument]) => {
      return normalizeConnectedDocumentData(result, connectedDocument);
    });
  },

  saveEntityBasedReferences(entity, language) {
    if (!entity.template) {
      return Promise.resolve([]);
    }

    return templatesAPI.getById(entity.template)
    .then((template) => {
      const selects = template.properties.filter((prop) => prop.type === 'select' || prop.type === 'multiselect');
      const entitySelects = [];
      return Promise.all(selects.map((select) => {
        return templatesAPI.getById(select.content)
        .then((result) => {
          if (result) {
            entitySelects.push(select.name);
          }
        });
      }))
      .then(() => entitySelects);
    })
    .then((properties) => {
      return Promise.all([
        properties,
        this.getByDocument(entity.sharedId, language)
      ]);
    })
    .then(([properties, references]) => {
      let values = properties.reduce((memo, property) => {
        let propertyValues = entity.metadata[property] || [];
        if (typeof propertyValues === 'string') {
          propertyValues = [propertyValues];
        }
        return memo.concat(propertyValues.map(value => {
          return {property, value};
        }));
      }, []);

      const toDelete = references.filter((ref) => {
        let isInValues = false;
        values.forEach((item) => {
          if (item.property === ref.sourceProperty && ref.targetDocument === item.value) {
            isInValues = true;
          }
        });
        return !ref.inbound && !isInValues && ref.sourceType === 'metadata';
      });

      const toCreate = values.filter((item) => {
        let isInReferences = false;
        references.forEach((ref) => {
          if (item.property === ref.sourceProperty && ref.targetDocument === item.value) {
            isInReferences = true;
          }
        });
        return !isInReferences;
      });

      const deletes = toDelete.map((ref) => this.delete(ref._id));
      const creates = toCreate.map((item) => this.save({
        sourceType: 'metadata',
        sourceDocument: entity.sharedId,
        targetDocument: item.value,
        sourceProperty: item.property,
        sourceTemplate: entity.template
      }, language));


      return Promise.all(deletes.concat(creates));
    });
  },

  delete(condition) {
    return model.delete(condition);
  },

  deleteTextReferences(sharedId, language) {
    return model.delete({sourceDocument: sharedId, language});
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
  },

  updateMetadataConnections(changedTemplate) {
    changedTemplate.properties = changedTemplate.properties || [];
    return templatesAPI.getById(changedTemplate._id)
    .then((currentTemplate) => {
      let changedProperties = {};
      changedTemplate.properties.forEach((property) => {
        let currentProperty = currentTemplate.properties.find(p => p.id === property.id);
        if (currentProperty && currentProperty.name !== property.name) {
          changedProperties[currentProperty.name] = property.name;
        }
      });
      let deletedProperties = [];
      currentTemplate.properties = currentTemplate.properties || [];
      currentTemplate.properties.forEach((property) => {
        if (!changedTemplate.properties.find(p => p.id === property.id)) {
          deletedProperties.push(property.name);
        }
      });

      let queries = Object.keys(changedProperties).map((oldPropertyName) => {
        return model.db.updateMany(
          {sourceType: 'metadata', sourceTemplate: currentTemplate._id, sourceProperty: oldPropertyName},
          {$set: {sourceProperty: changedProperties[oldPropertyName]}});
      });

      deletedProperties.forEach((deletedProperty) => {
        queries.push(this.delete({sourceType: 'metadata', sourceTemplate: currentTemplate._id, sourceProperty: deletedProperty}));
      });

      return Promise.all(queries);
    });
  }
};
