import { TagsService } from './../../../services/tags.service';
import { Tag } from './../../../models/tag';
import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { navigateToTab, toggleTag, toggleDirectory, toggleDragMode } from '../../../store/actions';

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
    if (this.directory) {
      this.getState();
    }
  }

  async getState() {
    this.tagsForDirectory = store.getState().tags.filter(tag => tag._directory && this.directory && tag._directory === this.directory._id);
    this.activeTag = store.getState().activeTag;
    this.dragActive = store.getState().dragMode;
    if (this.directory && this.directory._parentDirectory) {
      this.parentDirectory = store.getState().directories.find(directory => this.directory._parentDirectory === directory._id);
    }
  }

  toggleDirectory() {
    if (!this.active) {
      toggleDirectory(this.directory);
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
    e.stopImmediatePropagation();
    await this.handleTagDropped(e);
    await this.handleDirectoryDropped(e);
  }

  onDropEnd(e: DragEvent) {
    this.dragActive = false;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggleDragMode(false);
  }

  async handleTagDropped(e: DragEvent) {
    const tagName = e.dataTransfer.getData("tagName").trim();
    if (tagName) {
      const droppedTag: Tag = store.getState().tags.find(tag => tag.name === tagName);

      // Only set id when id does not equal the directoryId
      if (droppedTag._directory !== this.directory._id) {
        droppedTag._directory = this.directory._id;
      } else {
        // parentId === id => Maybe in previous folder?
      }
      await this.tagService.updateTag(droppedTag);
    }
  }

  async handleDirectoryDropped(e: DragEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const directoryId = e.dataTransfer.getData("directoryId").trim();
    if (directoryId) {
      const droppedDirectory = store.getState().directories.find(directory => directory._id === directoryId);
      droppedDirectory._parentDirectory = this.directory._id;
      await this.directoryService.updateDirectory(droppedDirectory);
    }
  }

  navigateToTab(e: Event, tag: Tag) {
    e.preventDefault();
    e.stopImmediatePropagation();
    navigateToTab('tags-view', tag.name);
  }

  dragDirectory(e: DragEvent) {
    e.dataTransfer.setData("directoryId", this.directory._id);
    toggleDragMode(true);
  }

  render() {
    return html`
    ${this.directory ?
      html`
  <div
  draggable="true"
  @dragstart=${(e: DragEvent) => this.dragDirectory(e)}
  @dragend=${(e: DragEvent) => this.onDropEnd(e)}
  @click=${() => this.toggleDirectory()}
      class="directoryContainer ${this.dragActive || this.active ? 'active' : ''}">
      <div class="folder ${this.dragActive || this.active ? 'active' : ''}">
      <span>${this.tagsForDirectory.length}</span>
      </div>
      <div class="footer">
        <span>${this.directory.name ? this.directory.name : ''}</span>
      </div>
  </div>
` : ''}
    `;
  }

}