import { Bookmark } from './../../../models/bookmark';
import { State } from './../../../store/reducer';
import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { timeSinceTimestamp } from '../../../helper/dateHelper';
import { BookmarkService } from '../../../services/bookmark.service';

const componentCSS = require('./bookmark-element.component.scss');

@customElement('bookmark-element')
class BookmarkElementComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  bookmarkService = new BookmarkService();
  stopUpdate = false;
  updateStarted = false;

  @property()
  tags = [];

  @property()
  isFavorite = false;

  @property()
  bookmark!: Bookmark;

  stateChanged() {
    if (!this.bookmark) {
      this.bookmark = store.getState().bookmarks.find(bookmark => bookmark.url === location.href);
      this.bookmark ? this.tags = this.bookmark.tags : '';
    }
  }

  async disconnectedCallback() {
    await this.updateBookmark();
  }


  async tagsChanged(e: CustomEvent) {
    this.updateStarted ? this.stopUpdate = true : '';
    if (this.bookmark.tags.length != e.detail.chips.length) {
      this.bookmark = { ...this.bookmark, tags: e.detail.chips };
      console.log(e.detail);
      this.dispatchEvent(
        new CustomEvent('tagsChanged', {
          bubbles: true,
          detail: e.detail
        })
      );

      // Prevents to update too much. Checks if update got interrupted by user input
      setTimeout(async () => {
        this.updateStarted = true;
        if (!this.stopUpdate) await this.updateBookmark();
        this.stopUpdate = false;
      }, 1500);
    }
  }

  async updateBookmark() {
    if (this.bookmark) {
      await this.bookmarkService.updateBookmark(this.bookmark);
    }
  }


  /**
   * Creates a new bookmark when clicking on bookmark icon
   *
   * @memberof BookmarkElementComponent
   */
  async starBookmark() {
    if (this.bookmark) {
      this.bookmark = { ...this.bookmark, isStarred: !this.bookmark.isStarred };
      await this.bookmarkService.updateBookmark(this.bookmark);
    } else {
      const newBookmark = this.bookmarkService.createNewBookmark(true);
      this.bookmark = newBookmark;
      await this.bookmarkService.createBookmark(newBookmark);
    }

    // await this.updateBookmark();
  }

  render() {
    return html`
    <div class="mark">
      <div class="header" >
        <span>${document.title} </span>
        <div class="favoriteIcon ${this.bookmark && this.bookmark.isStarred === true ? 'active' : ''}" @click=${async () => await this.starBookmark()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
      </div>
      <div class="main">
      </div>

      <!-- Only show tags when current location is saved as a bookmark -->
      ${this.bookmark ? html`
      <div class="footer">
        <bronco-chip-list
        @tagsChanged=${async (e: CustomEvent) => await this.tagsChanged(e)}
        .hideOnOutsideClick=${false}
        .chips=${this.bookmark.tags}></bronco-chip-list>
      </div>
      ` : ''}
    </div>
    `;
  }

}
