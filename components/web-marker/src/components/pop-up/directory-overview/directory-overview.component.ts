import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';

import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { toggleDirectory, toggleTag } from '../../../store/actions';

const componentCSS = require('./directory-overview.component.scss');

@customElement('directory-overview')
export class DirectoryOverviewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();

  @property()
  directories: Directory[] = [];

  @property()
  mainDirectories: Directory[] = [];

  @property()
  subDirectories: Directory[] = [];

  @property()
  searchFilter = '';

  @property()
  dragMode = false;

  @property()
  selectedDirectory: Directory = undefined;

  async firstUpdated() {
    this.getState();
  }

  stateChanged() {
    this.getState();
  }

  getState() {
    this.directories = store.getState().directories;
    this.mainDirectories = this.directories.filter(directory => !directory._parentDirectory);
    this.subDirectories = this.directories.filter(directory => this.selectedDirectory && directory._parentDirectory === this.selectedDirectory._id);
    this.searchFilter = store.getState().searchValue;
    this.selectedDirectory = store.getState().activeDirectory;
    console.log("Selected directory:" + this.selectedDirectory);
    this.dragMode = store.getState().dragMode;
  }

  render() {
    return html`
    <div class="container">

      ${this.directories.length ? html`

      <!-- Show selected directory and sub directories -->
      ${this.selectedDirectory ?
          html`
    <directory-element
    .directory=${this.directories.find(directory => directory._id === this.selectedDirectory._id)}></directory-element>
    ${this.subDirectories.map(directory =>
            html`
      <!-- Sub directories of directory -->
      <directory-element
      .directory=${directory}>
    </directory-element>

    `)}
    ` :
          html`
    <!-- Show all main directories (sub directories are filtered) -->
    ${this.mainDirectories.filter(directory => directory.name.toLowerCase().includes(this.searchFilter)).map(directory =>
            html`
      <directory-element
      .directory=${directory}>
    </directory-element>
    `)}
    `}
    ` : ''}

    <!-- Add a new directory. Will be hidden when user is dragging elements -->
    ${!this.dragMode ? html`
    <add-directory-element></add-directory-element>
    ` : ''}
</div>
`;
  }

}