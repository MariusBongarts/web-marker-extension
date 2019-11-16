import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { toggleDragMode, initTags, toggleDirectory } from '../../../store/actions';

const componentCSS = require('./remove-directory-element.component.scss');

@customElement('remove-directory-element')
export class RemoveDirectoryComponent extends connect(store)(LitElement) {
  @query('#inputElement') inputElement: HTMLInputElement;
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();

  @property()
  directoryName: string = '';

  /**
 * True, when user drags tag inside of this directory
 *
 * @memberof RemoveDirectoryComponent
 */
  @property()
  dragActive = false;

  @property()
  dragMode = false;

  @property()
  active = false;

  firstUpdated() {
    this.handleDragEvents();
  }

  stateChanged() {
    this.dragMode = store.getState().dragMode;
  }

  handleDragEvents() {
    // Allow tags to be dragged inside of this component
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
   * Directories can be dropped in this component to delete them
   *
   * @param {DragEvent} e
   * @memberof RemoveDirectoryComponent
   */
  async onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const directoryId = e.dataTransfer.getData("directoryId").trim();
    if (directoryId) {
      const droppedDirectory = store.getState().directories.find(directory => directory._id === directoryId);
      await this.directoryService.deleteDirectory(droppedDirectory._id);

      this.updateTags(directoryId);

      this.dragActive = false;
      toggleDragMode(false);
      toggleDirectory(undefined);
    }
  }


  /**
   * After deleting a category all tags, which are somewhere in directory (all subfolders) have to be updated
   *
   * @memberof RemoveDirectoryComponent
   */
  updateTags(directoryId: string) {
    // Update related tags
    let updatedTags = store.getState().tags.map(tag => tag._directory === directoryId ? { ...tag, _directory: '' } : tag);

    // Update tags, which were in subfolder of deleted directory
    const subDirectories = store.getState().directories.filter(directory => directory._parentDirectory && directory._parentDirectory === directoryId);
    subDirectories.forEach(directory => {
      updatedTags = updatedTags.map(tag => tag._directory === directory._id ? { ...tag, _directory: '' } : tag);
    });
    initTags(updatedTags);
  }

  render() {
    return html`
    <div class="directoryContainer">
      <div class="folder ${this.dragActive ? 'active' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </div>
      </div>
    `;
  }

}