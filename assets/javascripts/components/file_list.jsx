import React, { Component } from "react";
import ReactDOM from "react-dom";
import { privateUserSession } from '../lib/blockstack_client';
import FileCardComponent from "./file_card.jsx"

class FileListComponent extends Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  componentDidMount() {
    privateUserSession.getFile('index').then(index => {
      const files = index ? JSON.parse(index) : [];
      this.setState({ files: this.sortFiles(files) });
    })
  }

  sortFiles(files) {
    return files.sort(function(a, b) {
      return new Date(b.created_at) - new Date(a.created_at)
    });
  }

  renderFiles() {
    return this.state.files.map(file => {
      return <FileCardComponent key={file.id} {...file} />;
    });
  }

  render() {
    return (
      <div className="ev-file-list">
        {this.renderFiles()}
      </div>
    );
  }
}

export default FileListComponent;
