import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setSelection, unsetSelection} from 'app/Viewer/actions/selectionActions';
import Text from 'app/Viewer/utils/Text';
import {resetDocumentViewer} from 'app/Viewer/actions/documentActions';
import 'app/Viewer/scss/document.scss';

export class Document extends Component {
  handleMouseUp() {
    if (!this.text.selected()) {
      this.props.unsetSelection();
      return;
    }
    this.onTextSelected();
  }

  componentDidMount() {
    this.text = Text(this.pagesContainer);
  }

  onTextSelected() {
    this.props.setSelection(this.text.getSelection());
  }

  componentDidUpdate() {
    this.text.simulateSelection(this.props.selection);
  }

  componentWillUnmount() {
    this.props.resetDocumentViewer();
  }

  render() {
    const {document} = this.props;
    return (
      <div>
        <div
          className={'document-viewer col-sm-8 col-sm-offset-2 ' + (this.props.panelIsOpen ? 'is-active' : '')}
          ref={(ref) => this.pagesContainer = ref}
          onMouseUp={this.handleMouseUp.bind(this)}
          onTouchEnd={this.handleMouseUp.bind(this)}
        >
        {document.pages.map((page, index) => {
          let html = {__html: page};
          return <div key={index} dangerouslySetInnerHTML={html} className="document-article"/>;
        })}
        </div>
        {document.css.map((css, index) => {
          let html = {__html: css};
          return <style type="text/css" key={index} dangerouslySetInnerHTML={html}></style>;
        })}
      </div>
    );
  }
}

Document.propTypes = {
  document: PropTypes.object,
  panelIsOpen: PropTypes.bool,
  setSelection: PropTypes.func,
  unsetSelection: PropTypes.func,
  resetDocumentViewer: PropTypes.func,
  selection: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    selection: state.documentViewer.selection,
    document: state.documentViewer.document,
    panelIsOpen: state.documentViewer.uiState.toJS().referencePanel
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSelection, unsetSelection, resetDocumentViewer}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Document);