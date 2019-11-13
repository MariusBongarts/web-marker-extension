import { Tag } from './../../../models/tag';
import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { navigateToTab, toggleTag } from '../../../store/actions';

const componentCSS = require('./directory-element.component.scss');

@customElement('directory-element')
export class DirectoryOverviewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();

  @property()
  directory: Directory;

  @property()
  tagsForDirectory: Tag[];

  @property()
  active = store.getState().activeDirectory === this.directory;

  @property()
  activeTag = store.getState().activeTag;

  firstUpdated() {
    this.tagsForDirectory = store.getState().tags.filter(tag => tag._directory && tag._directory === this.directory._id);
  }

  stateChanged() {
    this.tagsForDirectory = store.getState().tags.filter(tag => tag._directory && tag._directory === this.directory._id);
    this.active = store.getState().activeDirectory === this.directory;
    this.activeTag = store.getState().activeTag;
  }

  navigateToTab(e: Event, tag: Tag) {
    e.preventDefault();
    e.stopImmediatePropagation();
    navigateToTab('tags-view', tag.name);
  }


  render() {
    return html`
    <h5>${this.directory.name}</h5>

    <!-- Show tags of directory only when directory is active -->
    ${this.active ? html`
    ${this.tagsForDirectory.map(tag => html`

    <bronco-chip
    @click=${(e) => this.navigateToTab(e, tag)}
    >${tag.name}</bronco-chip>
    `)}
    ` : ''}
    `;
  }

}