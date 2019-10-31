import { BookmarkService } from './../../../services/bookmark.service';
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
import { navigateExternal } from '../../../helper/router';

const componentCSS = require('./bookmark-overview.component.scss');

@customElement('bookmark-overview')
export class BookmarkOverviewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  bookmarkService = new BookmarkService();
  stopUpdate = false;
  updateStarted = false;

  @property()
  activeDirectory = '';

  @property()
  marks: Mark[] = [];

  @property()
  bookmarks: Bookmark[] = [];

  @property()
  originFilter = '';

  @property()
  searchFilter = '';

  @property()
  loaded = false;

  @property()
  selectedBookmark!: Bookmark;

  origins: string[] = [];


  async firstUpdated() {


  }

  stateChanged() {
    if (!this.selectedBookmark) {
      this.marks = store.getState().marks;
      this.bookmarks = store.getState().bookmarks;
      this.getDistinctOrigins();
    }
  }

  getDistinctOrigins() {
    this.origins = [...new Set(this.bookmarks.map(bookmark => bookmark.origin))];
    this.origins = this.origins.map(origin => urlToOrigin(origin));
    this.origins.sort();
    this.origins = [...new Set(this.origins.map(origin => origin))];
  }

  toggleBookmark(bookmark: Bookmark) {
    setTimeout(() => this.selectedBookmark === bookmark ? this.selectedBookmark = undefined : this.selectedBookmark = bookmark, 1);
  }


  filterBookmarks() {
    let filteredBookmarks = this.bookmarks;
    filteredBookmarks = filteredBookmarks.filter(bookmark => bookmark.url.includes(this.originFilter));

    // Filter if search value is given
    if (store.getState().searchValue) {
      filteredBookmarks = filteredBookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(
        this.searchFilter) ||
        this.isFilterInTagsOfBookmark(bookmark) ||
        bookmark.url.includes(store.getState().searchValue));
    }

    return filteredBookmarks;
  }

  isFilterInTagsOfBookmark(bookmark: Bookmark) {
    let tmp = false;
    bookmark.tags.forEach(tag => tag.toLowerCase().includes(this.searchFilter) ? tmp = true : '');
    return tmp;
  }

  async tagsChanged(e: CustomEvent) {
    this.updateStarted ? this.stopUpdate = true : '';
    if (this.selectedBookmark.tags.length != e.detail.chips.length) {
      this.selectedBookmark.tags = e.detail.chips;

      // Prevents to update too much. Checks if update got interrupted by user input
      setTimeout(async () => {
        this.updateStarted = true;
        if (!this.stopUpdate) await this.updateBookmark();
        this.stopUpdate = false;
      }, 1000);
    }
  }

  async updateBookmark() {
    if (this.selectedBookmark) {
      await this.bookmarkService.updateBookmark(this.selectedBookmark);
    }
  }


  render() {
    return html`
    ${this.marks && this.bookmarks ? html`
    <div class="tabs">
          <!-- Close placeholder -->
          ${this.selectedBookmark ? html`
          <div>
            <input type="radio" id="closeBtn" name="radioBtn">
          </div>
        ` : ''}
      ${this.filterBookmarks().map(bookmark => html`
      <div class="tab
      ${!this.searchFilter || this.filterBookmarks().length > 1 ? 'border-top' : ''}
      ${!this.selectedBookmark || this.selectedBookmark === bookmark ? '' : 'hide'}">

        <input type="radio" id="${bookmark._id}" name="radioBtn">
        <!-- setTimeout() is necessary to change selectedOrigin after radio input event -->
        <label class="tab-label
          ${this.marks.filter(mark => mark._bookmark === bookmark._id).length ? '' : 'hide-dropdown'}
        " for="${this.selectedBookmark && this.selectedBookmark === bookmark ? 'closeBtn' : bookmark._id}"
        @click=${(e) => this.toggleBookmark(bookmark)}
        >
        <span class="bookmarkHeader">${bookmark.title}</span>

        <!-- Show either bookmark icon if there are no marks or number if marks for bookmark -->
        <span class="badge">
        ${this.marks.filter(mark => mark._bookmark === bookmark._id).length ?
        this.marks.filter(mark => mark._bookmark === bookmark._id).length
        :
        html`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        <!-- Go to url of current mark or scroll -->
        `

      }</span>
      </label>


      <div class="tab-content">
      ${this.selectedBookmark && this.selectedBookmark === bookmark ? html`
      <bronco-chip-list
        @tagsChanged=${async (e: CustomEvent) => this.tagsChanged(e)}
        .hideOnOutsideClick=${false}
        .chips=${bookmark.tags}></bronco-chip-list>
        ` : ''}

        ${this.marks.filter(mark => mark._bookmark === bookmark._id).map(mark => html`
        ${mark ? html`
        <mark-element .mark=${mark} .headerInfo=${mark.origin.split(bookmark.origin)[1].substring(0, 20)}></mark-element>
        ` : ''}
        `)}
      </div>
          `)}
      </div>
        ` : html`Loading...`}
`;
  }

}
