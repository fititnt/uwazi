import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import SidePanel from 'app/Layout/SidePanel';
import {ShowMetadata} from 'app/Metadata';
import {t} from 'app/I18N';
import {browserHistory} from 'react-router';

import AttachmentsList from 'app/Attachments/components/AttachmentsList';
import {Tabs, TabLink, TabContent} from 'react-tabs-redux';
import Connections from 'app/Viewer/components/ConnectionsList';
import {ConnectionsGroups} from 'app/ConnectionsList';
import ShowIf from 'app/App/ShowIf';
import {NeedAuthorization} from 'app/Auth';
import ShowToc from './ShowToc';
import {MetadataFormButtons} from 'app/Metadata';
import SearchText from './SearchText';
import SnippetsTab from './SnippetsTab';

import {fromJS} from 'immutable';
import * as viewerModule from 'app/Viewer';

export class DocumentSidePanel extends Component {

  constructor(props) {
    super(props);
    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(tabSelected) {
    this.props.showTab(tabSelected);
  }

  deleteDocument() {
    this.context.confirm({
      accept: () => {
        this.props.deleteDocument(this.props.doc.toJS())
        .then(() => {
          const currentPath = browserHistory.getCurrentLocation().pathname;
          const isLibraryorUploads = /library|uploads|^\/$|^\/..\/$/;
          if (!currentPath.match(isLibraryorUploads)) {
            browserHistory.goBack();
          }
        });
      },
      title: 'Confirm',
      message: 'Are you sure you want to delete this item?'
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.doc.get('_id') && newProps.doc.get('_id') !== this.props.doc.get('_id') && this.props.getDocumentReferences) {
      this.props.getDocumentReferences(newProps.doc.get('sharedId'), this.props.storeKey);
    }
  }

  close() {
    if (this.props.formDirty) {
      this.context.confirm({
        accept: () => {
          this.props.resetForm(this.props.formPath);
          this.props.closePanel();
        },
        title: 'Confirm',
        message: 'All changes will be lost, are you sure you want to proceed?'
      });
      return;
    }
    this.props.resetForm(this.props.formPath);
    this.props.closePanel();
  }

  render() {
    const {doc, docBeingEdited, DocumentForm, readOnly, references, EntityForm, connectionsGroups} = this.props;
    const TocForm = this.props.tocFormComponent;

    const docAttachments = doc.get('attachments') ? doc.get('attachments').toJS() : [];
    const docFile = Object.assign({}, doc.get('file') ? doc.get('file').toJS() : {});
    const attachments = doc.get('file') ? [docFile].concat(docAttachments) : docAttachments;

    const docType = this.props.doc.get('type');

    let tab = this.props.tab || 'metadata';
    if (docType === 'entity' && (tab === 'references' || tab === 'toc')) {
      tab = 'metadata';
    }

    // TEST!!! Duplicated code from EntityViewer, check if it merits an abstraction
    const summary = connectionsGroups.reduce((summaryData, g) => {
      g.get('templates').forEach(template => {
        summaryData.totalConnections += template.get('count');
      });
      return summaryData;
    }, {totalConnections: 0});

    return (
      <SidePanel open={this.props.open} className="metadata-sidepanel">
        <div className="sidepanel-header">
          <i className="closeSidepanel fa fa-close close-modal" onClick={this.close.bind(this)}/>&nbsp;
          <Tabs selectedTab={tab} renderActiveTabContentOnly={true} handleSelect={this.selectTab}>
            <ul className="nav nav-tabs">
              {(() => {
                if (docType !== 'entity') {
                  return <li>
                    <TabLink to="text-search">
                      <SnippetsTab storeKey={this.props.storeKey} />
                    </TabLink>
                  </li>;
                }
              })()}
              {(() => {
                if (docType !== 'entity') {
                  return <li>
                    <TabLink to="toc">
                      <i className="fa fa-font"></i>
                      <span className="tab-link-tooltip">{t('System', 'Table of Content')}</span>
                    </TabLink>
                  </li>;
                }
                return <span/>;
              })()}
              {(() => {
                if (docType !== 'entity') {
                  return <li>
                    <TabLink to="references">
                      <i className="fa fa-sitemap"></i>
                      <span className="connectionsNumber">{references.size}</span>
                      <span className="tab-link-tooltip">{t('System', 'References')}</span>
                    </TabLink>
                  </li>;
                }
                return <span/>;
              })()}
              {(() => {
                if (docType !== 'entity') {
                  return <li className="tab-separator"></li>;
                }
                return <span/>;
              })()}
              <li>
                <TabLink to="metadata" default>
                  <i className="fa fa-info-circle"></i>
                  <span className="tab-link-tooltip">{t('System', 'Info')}</span>
                </TabLink>
              </li>
              <li>
                <TabLink to="connections">
                  <i className="fa fa-exchange"></i>
                  <span className="connectionsNumber">{summary.totalConnections}</span>
                  <span className="tab-link-tooltip">{t('System', 'Connections')}</span>
                </TabLink>
              </li>
            </ul>
          </Tabs>
        </div>
        <ShowIf if={this.props.tab === 'metadata' || !this.props.tab}>
          <div className="sidepanel-footer">
            <MetadataFormButtons
              delete={this.deleteDocument.bind(this)}
              data={this.props.doc}
              formStatePath={this.props.formPath}
              entityBeingEdited={docBeingEdited}
              includeViewButton={!docBeingEdited && readOnly}
              storeKey={this.props.storeKey}
            />
          </div>
        </ShowIf>

        <NeedAuthorization roles={['admin', 'editor']}>
          <ShowIf if={this.props.tab === 'toc' && this.props.tocBeingEdited}>
            <div className="sidepanel-footer">
              <button type="submit" form="tocForm" className="edit-toc btn btn-success">
                <i className="fa fa-save"></i>
                <span className="btn-label">Save</span>
              </button>
            </div>
          </ShowIf>
        </NeedAuthorization>

        <NeedAuthorization roles={['admin', 'editor']}>
          <ShowIf if={this.props.tab === 'toc' && !this.props.tocBeingEdited && !readOnly}>
            <div className="sidepanel-footer">
              <button onClick={() => this.props.editToc(this.props.doc.get('toc').toJS() || [])} className="edit-toc btn btn-success">
                <i className="fa fa-pencil"></i>
                <span className="btn-label">Edit</span>
              </button>
            </div>
          </ShowIf>
        </NeedAuthorization>

        <div className="sidepanel-body">
          <Tabs selectedTab={this.props.tab || 'metadata'}>
            <TabContent for="text-search">
              <SearchText doc={doc} storeKey={this.props.storeKey} searchTerm={this.props.searchTerm}/>
            </TabContent>
            <TabContent for="toc">
              <ShowIf if={!this.props.tocBeingEdited}>
                <ShowToc toc={doc.get('toc')} readOnly={readOnly} />
              </ShowIf>
              <ShowIf if={this.props.tocBeingEdited}>
                <TocForm
                  removeEntry={this.props.removeFromToc}
                  indent={this.props.indentTocElement}
                  onSubmit={this.props.saveToc}
                  model="documentViewer.tocForm"
                  state={this.props.tocFormState}
                  toc={this.props.tocForm}
                />
              </ShowIf>
            </TabContent>
            <TabContent for="metadata">
              {(() => {
                if (docBeingEdited && this.props.doc.get('type') === 'document') {
                  return <DocumentForm storeKey={this.props.storeKey} />;
                }
                if (docBeingEdited && this.props.doc.get('type') === 'entity') {
                  return <EntityForm storeKey={this.props.storeKey} />;
                }

                return (
                  <div>
                    <ShowMetadata entity={this.props.metadata} showTitle={true} showType={true} />
                    <AttachmentsList files={fromJS(attachments)}
                      readOnly={false}
                      isTargetDoc={this.props.isTargetDoc}
                      isDocumentAttachments={Boolean(doc.get('file'))}
                      parentId={doc.get('_id')}
                      parentSharedId={doc.get('sharedId')}
                      storeKey={this.props.storeKey}/>
                  </div>
                );
              })()}
            </TabContent>
            <TabContent for="references">
              <Connections
                referencesSection="references"
                references={references}
                readOnly={readOnly}
              />
            </TabContent>
            <TabContent for="connections">
              <ConnectionsGroups />
            </TabContent>
          </Tabs>
        </div>
      </SidePanel>
    );
  }
}

DocumentSidePanel.propTypes = {
  doc: PropTypes.object,
  metadata: PropTypes.object,
  EntityForm: PropTypes.func,
  tocFormComponent: PropTypes.func,
  DocumentForm: PropTypes.func,
  formDirty: PropTypes.bool,
  formPath: PropTypes.string,
  searchTerm: PropTypes.string,
  docBeingEdited: PropTypes.bool,
  open: PropTypes.bool,
  tocBeingEdited: PropTypes.bool,
  showTab: PropTypes.func,
  tab: PropTypes.string,
  saveDocument: PropTypes.func,
  startNewConnection: PropTypes.func,
  closePanel: PropTypes.func,
  showModal: PropTypes.func,
  deleteDocument: PropTypes.func,
  resetForm: PropTypes.func,
  references: PropTypes.object,
  connectionsGroups: PropTypes.object,
  tocFormState: PropTypes.object,
  tocForm: PropTypes.array,
  saveToc: PropTypes.func,
  editToc: PropTypes.func,
  getDocumentReferences: PropTypes.func,
  removeFromToc: PropTypes.func,
  indentTocElement: PropTypes.func,
  searchSnippets: PropTypes.func,
  isTargetDoc: PropTypes.bool,
  readOnly: PropTypes.bool,
  hasRelationTypes: PropTypes.bool,
  storeKey: PropTypes.string
};

DocumentSidePanel.contextTypes = {
  confirm: PropTypes.func
};

DocumentSidePanel.defaultProps = {
  tocFormComponent: () => false,
  EntityForm: () => false
};

export const mapStateToProps = (state) => {
  return {
    // TEST!!!!
    references: state.documentViewer.targetDoc.get('_id') ?
                viewerModule.selectors.selectTargetReferences(state) : viewerModule.selectors.selectReferences(state),
    // TEST!!!!
    connectionsGroups: state.relationships.list.connectionsGroups,
    hasRelationTypes: !!state.relationTypes.size
  };
};

export default connect(mapStateToProps)(DocumentSidePanel);
