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
    this.subDirectories = this.directories.filter(directory =>  this.selectedDirectory && directory._parentDirectory === this.selectedDirectory._id);
    this.searchFilter = store.getState().searchValue;
    this.selectedDirectory = store.getState().activeDirectory;
  }

  render() {
    return html`
    <div class="container">
      ${this.directories.length ? html`

      <!-- Show selected directory and sub directories -->
      ${this.selectedDirectory ?
          html`
    <directory-element
    .active=${true}
    .directory=${this.directories.find(directory => directory === this.selectedDirectory)}></directory-element>
    ${this.subDirectories.map(directory =>
      html`
      <!-- Sub directories of directory -->
      <directory-element
      .active=${false}
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
    <add-directory-element></add-directory-element>
</div>
`;
  }

}