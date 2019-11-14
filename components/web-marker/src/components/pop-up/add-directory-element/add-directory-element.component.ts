import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./add-directory-element.component.scss');

@customElement('add-directory-element')
export class AddDirectoryComponent extends connect(store)(LitElement) {
  @query('#inputElement') inputElement: HTMLInputElement;
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();

  @property()
  directoryName: string = '';

  @property()
  active = false;

  async inputEvent(e: KeyboardEvent) {
    this.directoryName = this.inputElement.value
    if (e.keyCode === 13 && this.directoryName) {
      const directory = {
        name: this.directoryName,
        _parentDirectory: store.getState().activeDirectory ? store.getState().activeDirectory._id : ''
      } as Directory;
      await this.directoryService.createDirectory(directory);
      this.inputElement.value = '';
      this.active = false;
    }
  }


  render() {
    return html`
    <!-- Button to add directory -->
    ${!this.active ?
        html`
    <div class="directoryContainer">
    <div class="folder"
        @click=${() => {
            this.active = !this.active;
            setTimeout(() => this.inputElement.focus(), 100)
          }
          }
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
    </div>
    <div class="footer">
      <span>
      </span>
    </div>
    </div>
      ` :
        html`
          <!-- Add directory with input -->
    <div class="directoryContainer">
    <div class="folder ${this.active ? 'active' : ''}">
    <span></span>
    </div>
    <div class="footer">
      <input
    @blur=${() => this.active = false}
    @keydown=${(e) => this.inputEvent(e)}
    id="inputElement">
    </div>
    </div>
      `}


    `;
  }

}