import { DirectoryService } from './../../../services/directory.service';
import { Directory } from './../../../models/directory';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./add-directory-element.component.scss');

@customElement('add-directory-element')
export class DirectoryOverviewComponent extends connect(store)(LitElement) {
  @query('#inputElement') inputElement: HTMLInputElement;
  static styles = css`${unsafeCSS(componentCSS)}`;
  directoryService = new DirectoryService();

  @property()
  directoryName: string = '';

  @property()
  active = false;


  render() {
    return html`
    <!-- Button to add directory -->
    ${!this.active ?
        html`
    <div class="directoryContainer"
    @click=${() => this.active = !this.active}>
    <div class="folder">
    <span>+</span>
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
    <div class="folder">
    <span>0</span>
    </div>
    <div class="footer">
      <input
    @blur=${() => this.active = false}
    @keydown=${(e) => this.directoryName = this.inputElement.value}
    id="inputElement" placeholder="Enter name...">
    </div>
    </div>
      `}


    `;
  }

}