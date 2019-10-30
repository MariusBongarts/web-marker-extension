import { Bookmark } from './../../../models/bookmark';
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
  bookmarks: Bookmark[] = [];

  @property()
  searchValue = store.getState().searchValue;

  @property()
  loaded = false;

  @property()
  selectedOrigin!: string;

  origins: string[] = [];


  async firstUpdated() {
    this.getDistinctOrigins();
    this.marks = store.getState().marks;
    this.bookmarks = store.getState().bookmarks;
    this.loaded = true;
  }

  stateChanged() {
    this.marks = store.getState().marks;
    this.bookmarks = store.getState().bookmarks;
    this.searchValue = store.getState().searchValue;
    this.getDistinctOrigins();
  }

  getDistinctOrigins() {
    this.origins = [...new Set(this.bookmarks.map(bookmark => bookmark.origin))];
    this.origins = this.origins.map(origin => urlToOrigin(origin));
    this.origins.sort();
    this.origins = [...new Set(this.origins.map(origin => origin))];
  }

  toggleOrigin(origin: string) {
    setTimeout(() => this.selectedOrigin === origin ? this.selectedOrigin = undefined : this.selectedOrigin = origin, 1);
  }


  render() {
    return html`
    <div class="tabs">
          <!-- Close placeholder -->
          ${this.selectedOrigin ? html`
          <div>
            <input type="radio" id="closeBtn" name="radioBtn">
          </div>
        ` : ''}
    ${this.searchValue ? html`
    <bookmark-overview .searchFilter=${this.searchValue}></bookmark-overview>
    ` : html`
    ${this.origins.filter(origin => origin.includes(this.searchValue)).map((origin: string) => html`
      <div class="tab ${!this.selectedOrigin || this.selectedOrigin === origin ? '' : 'hide'}">
        <input type="radio" id="${origin}" name="radioBtn">
        <!-- setTimeout() is necessary to change selectedOrigin after radio input event -->
        <label class="tab-label" for="${this.selectedOrigin && this.selectedOrigin === origin ? 'closeBtn' : origin}"
        @click=${(e) => this.toggleOrigin(origin)}
        >
        <span style="width: 100%; margin: 0px 10px;">${origin.substring(0, 30)}</span>

        <!-- Show either bookmark icon if there are no marks or number if marks for bookmark -->
        <span class="badge">
        ${this.marks.filter(mark => mark.origin.includes(origin)).length ?
        this.marks.filter(mark => mark.origin.includes(origin)).length
        :
        html` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
      }</span>
      </label>
      <div class="tab-content">
        <bookmark-overview .originFilter=${this.selectedOrigin}></bookmark-overview>
      </div>
          `)}
    `}

      </div>
`;
  }

}
