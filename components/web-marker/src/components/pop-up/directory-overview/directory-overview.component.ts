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
    this.searchFilter = store.getState().searchValue;
    this.selectedDirectory = store.getState().activeDirectory;
    this.subDirectories = this.directories.filter(directory =>  this.selectedDirectory && directory._parentDirectory === this.selectedDirectory._id);
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
      .directory=${directory}>
      </directory-element>

      `)}
    ` :
          html`
    <!-- Show all directories -->
    ${this.directories.filter(directory => directory.name.toLowerCase().includes(this.searchFilter)).map(directory =>
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