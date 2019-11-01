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

const componentCSS = require('./origin-overview.component.scss');

@customElement('origin-overview')
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

  render() {
    return html`
    <div class="container">
      <!-- When no origin is selected, all origins are shown. Otherwise all non selected are filtered -->
      ${this.origins.filter(origin => !this.selectedOrigin || this.selectedOrigin === origin)
        .map(origin => html`
      <origin-element
      origin=${origin}
      @selected=${() => this.selectedOrigin === origin ? this.selectedOrigin = undefined : this.selectedOrigin = origin}
      .active=${this.selectedOrigin === origin}
      .bookmarks=${this.bookmarks.filter(bookmark => bookmark.url.includes(origin))}
      ></origin-element>
      `)}
    </div>

`;
  }

}
