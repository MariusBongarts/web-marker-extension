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

  <!-- Show bookmarks icon if there are bookmarks for selected tag -->
  ${this.getFilteredBookmarks().length ? html`
  <div class="bookmark-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  </div>
  ` : ''}
  ${this.getFilteredBookmarks()
    .map(bookmark => html`
    ${!this.selectedBookmark || this.selectedBookmark === bookmark ? html`
  <bookmark-element @click=${() => this.selectedBookmark === bookmark ? this.selectedBookmark = undefined :
        this.selectedBookmark = bookmark}
    .active=${this.selectedBookmark === bookmark}
    .isDropdown=${true}
    .bookmark=${bookmark}></bookmark-element>
  ` : ''}
  `)}

  <!-- Hide when a bookmark is selected -->
  ${!this.selectedBookmark ? html`
  <!-- Show marks icon if there are marks for selected tag -->
  ${this.getFilteredMarks().length ? html`
  <div class="mark-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 544 512">
      <path
        d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z" />
      </svg>
  </div>
  ` : ''}
  ${this.getFilteredMarks().map(mark => html`
  <mark-element .mark=${mark}></mark-element>
  `)}
  ` : ''}
</div>
`;
  }

}