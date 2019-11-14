import { TagsService } from './../../../services/tags.service';
import { Tag } from './../../../models/tag';
import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { navigateToTab, toggleTag, toggleDirectory } from '../../../store/actions';

const componentCSS = require('./directory-element.component.scss');

@customElement('directory-element')
export class DirectoryOverviewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();
  tagService = new TagsService();

  @property()
  directory: Directory;

  @property()
  parentDirectory: Directory;

  @property()
  tagsForDirectory: Tag[];


  /**
   * True, when user drags tag inside of this directory
   *
   * @memberof DirectoryOverviewComponent
   */
  @property()
  dragActive = false;

  @property()
  active = false;

  @property()
  activeTag = store.getState().activeTag;

  @property()
  loaded = false;

  async firstUpdated() {
    this.getState();
    this.handleDragEvents();
  }

  async stateChanged() {
    this.getState();
  }

  async getState() {
    this.tagsForDirectory = store.getState().tags.filter(tag => tag._directory && tag._directory === this.directory._id);
    this.activeTag = store.getState().activeTag;
    if (this.directory._parentDirectory) {
      this.parentDirectory = store.getState().directories.find(directory => this.directory._parentDirectory === directory._id);
    }
  }

  toggleDirectory() {
    if (!this.active) {
      toggleDirectory(this.directory);
      this.active = true;
    } else {
      this.parentDirectory = store.getState().directories.find(directory => this.directory._parentDirectory === directory._id);
      toggleDirectory(this.directory._parentDirectory ? this.parentDirectory : undefined);
    }
    toggleTag('');
  }

  handleDragEvents() {
    // Allow tags to be dragged inside of this directory and toggleDragActive to show css effect
    this.ondragover = (e) => {
      this.dragActive = true;
      e.preventDefault()
    };

    this.ondragleave = (e) => {
      this.dragActive = false;
      e.preventDefault()
    };

    this.ondrop = async (e) => await this.onDrop(e);

  }


  /**
   *Tags can be dropped in this directory. The belonging tag will be read out in dataTransfer object and
   * and the new directory for the tag is saved in the server
   * @param {DragEvent} e
   * @memberof DirectoryOverviewComponent
   */
  async onDrop(e: DragEvent) {
    e.preventDefault();
    const tagName = e.dataTransfer.getData("tagName");
    const droppedTag: Tag = store.getState().tags.find(tag => tag.name === tagName);
    droppedTag._directory = this.directory._id;
    await this.tagService.updateTag(droppedTag);
  }

  navigateToTab(e: Event, tag: Tag) {
    e.preventDefault();
    e.stopImmediatePropagation();
    navigateToTab('tags-view', tag.name);
  }

  render() {
    return html`
    <div
    @click=${() => this.toggleDirectory()}
    class="directoryContainer ${this.dragActive || this.active ? 'active' : ''}">
    <div class="folder ${this.dragActive || this.active ? 'active' : ''}">
    <span>${this.tagsForDirectory.length}</span>
    </div>
    <div class="footer">
      <span>${this.directory.name}</span>
    </div>
    </div>
    `;
  }

}