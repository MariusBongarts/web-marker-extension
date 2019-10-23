import { Mark } from './../../../models/mark';
import { JwtPayload } from './../../../models/jwtPayload';
import { JwtService } from './../../../services/jwt.service';
import { MarkerService } from './../../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { urlToOrigin } from '../../../helper/urlHelper';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./accordion-view.component.scss');

@customElement('accordion-view')
export class TreeViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  activeDirectory = '';

  @property()
  marks: Mark[] = [];

  @property()
  filter = '';

  @property()
  loaded = false;

  @property()
  selectedOrigin = '';

  origins: string[] = [];


  async firstUpdated() {
    this.marks = store.getState().marks;
    this.getDistinctOrigins();
    this.loaded = true;
  }

  stateChanged() {
    this.marks = store.getState().marks;
    this.getDistinctOrigins();
  }

  getDistinctOrigins() {
    this.origins = [...new Set(this.marks.map(mark => mark.origin))];
    this.origins = this.origins.map(origin => urlToOrigin(origin));
    this.origins.sort();
    this.origins = [...new Set(this.origins.map(origin => origin))];
  }

  toggleList(origin: string) {
    setTimeout(() => this.selectedOrigin === origin ? this.selectedOrigin = '' : this.selectedOrigin = origin, 1);
  }


  render() {
    return html`
    ${this.marks ? html`
    <div class="tabs">
          <!-- Close placeholder -->
          ${this.selectedOrigin ? html`
          <div>
            <input type="radio" id="closeBtn" name="radioBtn">
          </div>
        ` : ''}
      ${this.origins.filter(origin => origin.toLowerCase().includes(
      this.filter))
          .map((origin: string) => html`
      <div class="tab ${!this.selectedOrigin || this.selectedOrigin === origin ? '' : 'hide'}">
        <input type="radio" id="${origin}" name="radioBtn">
        <!-- setTimeout() is necessary to change selectedOrigin after radio input event -->
        <label class="tab-label" for="${this.selectedOrigin && this.selectedOrigin === origin ? 'closeBtn' : origin}"
        @click=${(e) => this.toggleList(origin)}
        >
        <span>${origin.substring(0, 30)}</span>
        <span class="badge">${this.marks.filter(mark => mark.origin.includes(origin)).length}</span>
      </label>
      <div class="tab-content">
        ${this.marks.filter(mark => mark.origin.includes(origin)).map(mark => html`
        <mark-element .mark=${mark} .headerInfo=${mark.origin.split(origin)[1].substring(0, 20)}></mark-element>
        `)}
      </div>
          `)}
      </div>

        ` : html`Loading...`}
`;
  }

}
