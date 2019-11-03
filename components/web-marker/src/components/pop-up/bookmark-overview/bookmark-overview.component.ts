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
  animation = false;

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


  getFilteredBookmarks() {
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

  toggleBookmark(bookmark: Bookmark) {
    this.animation = true;
    this.selectedBookmark === bookmark ? this.selectedBookmark = undefined : this.selectedBookmark = bookmark;
  }


  render() {
    return html`
    <div class="container">
      ${this.getFilteredBookmarks().filter(bookmark => this.selectedBookmark ? this.selectedBookmark === bookmark : true).map(bookmark => html`
      <bookmark-element
      .selected=${this.selectedBookmark === bookmark}
      .active=${this.selectedBookmark && this.selectedBookmark === bookmark}
      .isDropdown=${true}
      @selected=${() => this.toggleBookmark(bookmark)}
      @animationFinished=${() => this.animation = false}
      .bookmark=${bookmark}></bookmark-element>
      <div>
      ${this.selectedBookmark && this.selectedBookmark === bookmark ? html`
      ${this.marks.filter(mark => mark._bookmark === bookmark._id).map(mark => html`
      <mark-element .mark=${mark}></mark-element>`)}
      ` : ''}
      </div>
      `)}

    </div>
`
  }

}
