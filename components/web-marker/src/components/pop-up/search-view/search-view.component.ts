import { Bookmark } from './../../../models/bookmark';
import { Mark } from './../../../models/mark';
import { JwtPayload } from './../../../models/jwtPayload';
import { JwtService } from './../../../services/jwt.service';
import { MarkerService } from './../../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./search-view.component.scss');

@customElement('search-view')
export class TreeViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks: Mark[] = [];

  @property()
  bookmarks: Bookmark[] = [];

  @property()
  searchFilter = '';

  @property()
  selectedBookmark = undefined;

  async firstUpdated() {
    this.bookmarks = store.getState().bookmarks;
    this.marks = store.getState().marks;

  }

  stateChanged() {
    this.searchFilter = store.getState().searchValue;
  }

  getFilteredBookmarks() {
    let filteredBookmarks = this.bookmarks;
    // Filter if search value is given
    if (store.getState().searchValue) {
      filteredBookmarks = filteredBookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(
        this.searchFilter) ||
        this.isFilterInTagsOfElement(bookmark) ||
        bookmark.url.includes(store.getState().searchValue));
    }
    return filteredBookmarks;
  }

  isFilterInTagsOfElement(element: Bookmark | Mark) {
    let tmp = false;
    element.tags.forEach(element => element.toLowerCase().includes(this.searchFilter) ? tmp = true : '');
    return tmp;
  }

  getFilteredMarks() {
    return this.marks.filter(mark =>
      mark.title.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
      mark.text.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
      mark.url.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
      this.isFilterInTagsOfElement(mark));
  }

  render() {
    return html`
    <div class="container">
    ${this.getFilteredBookmarks().map(bookmark => html`
      <bookmark-element
      @click=${() => this.selectedBookmark === bookmark ? this.selectedBookmark = undefined : this.selectedBookmark = bookmark}
      .active=${this.selectedBookmark === bookmark}
      .isDropdown=${true}
      .bookmark=${bookmark}></bookmark-element>
      ${this.selectedBookmark && this.selectedBookmark === bookmark ? html`
      ${this.marks.filter(mark => mark._bookmark === bookmark._id).map(mark => html`
      <mark-element .mark=${mark}></mark-element>`)}
      ` : ''}
      `)}


      <!-- Hide when bookmark is selected -->
      ${!this.selectedBookmark ? html`
      ${this.getFilteredMarks().map(mark => html`
      <mark-element .mark=${mark}></mark-element>
      `)}
      ` : ''}
    </div>
`;
  }

}
