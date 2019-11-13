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
  searchFilter = '';

  @property()
  selectedDirectory: Directory = undefined;

  async firstUpdated() {
    this.directories = store.getState().directories;
  }

  stateChanged() {
    this.directories = store.getState().directories;
    this.searchFilter = store.getState().searchValue;
    this.selectedDirectory = store.getState().activeDirectory;
  }

  toggleDirectory(directory: Directory) {
    this.selectedDirectory === directory ? this.selectedDirectory = undefined : toggleDirectory(directory);
    toggleTag('');
  }

  render() {
    return html`
  ${this.directories.length ? html`
    <div class="container">
    <!-- Show selected directory -->
    ${this.selectedDirectory ?
    html`
    <directory-element
    @click=${() => toggleDirectory(undefined)}
    .directory=${this.directories.find(directory => directory === this.selectedDirectory)}></directory-element>
    ` :
    html`
    <!-- Show all directories -->
    ${this.directories.filter(directory => directory.name.toLowerCase().includes(this.searchFilter)).map(directory =>
      html`
      <directory-element
      @click=${() => this.toggleDirectory(directory)}
      .directory=${directory}>
      </directory-element>
      `)}
      <add-directory-element></add-directory-element>
    `}

</div>
  ` : ''}
`;
  }

}