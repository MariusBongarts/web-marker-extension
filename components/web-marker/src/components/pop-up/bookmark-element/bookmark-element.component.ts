import { MarkerService } from './../../../services/marker.service';
import { Mark } from './../../../models/mark';
import { Bookmark } from './../../../models/bookmark';
import { State } from './../../../store/reducer';
import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { timeSinceTimestamp } from '../../../helper/dateHelper';
import { BookmarkService } from '../../../services/bookmark.service';
import { navigateExternal } from '../../../helper/router';

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
  isDropdown = false;

  @property()
  isFavorite = false;

  @property()
  bookmark!: Bookmark;

  @property()
  active = false;

  @property()
  animation = false;

  @property()
  marksForBookmark: Mark[] = [];

  firstUpdated() {
    try {
      this.marksForBookmark = store.getState().marks.filter(mark => mark.url === this.bookmark.url);
    } catch (error) {
      //
    }
  }

  stateChanged() {
    if (!store.getState().searchValue) {

      if (!this.isDropdown) {
        const bookmark = store.getState().bookmarks.find(bookmark => bookmark.url === location.href);
        this.bookmark = bookmark;
      }

      try {
        this.marksForBookmark = store.getState().marks.filter(mark => mark.url === this.bookmark.url);
      } catch (error) {
        //
      }

      //this.bookmark ? this.tags = this.bookmark.tags : '';

    }
  }

  async tagsChanged(e: CustomEvent) {
    this.updateStarted ? this.stopUpdate = true : '';
    if (this.bookmark.tags.length != e.detail.chips.length) {
      this.bookmark = { ...this.bookmark, tags: e.detail.chips };
      await this.updateBookmark();
    }
  }

  async updateBookmark() {
    if (this.bookmark) {
      await this.bookmarkService.updateBookmark(this.bookmark);
    }
  }

  async updateMarks() {
    if (this.marksForBookmark) {
      const markService = new MarkerService();
      this.marksForBookmark.forEach(async (mark) => {
        await markService.updateMark(mark);
      })
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

  /**
  * This method toggles the dropdown icon of the element. The timeout is necessary to wait for the animation to be
  completed.
  *
  * @memberof TreeViewComponent
  */
  toggleActive() {
    this.animation = true;
    this.active = !this.active;
    this.dispatchEvent(new CustomEvent('selected'));
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('animationFinished'));
      this.animation = false;
    }, 250);
  }

  render() {
    return html`

${!this.isDropdown ? html`
<!-- No Dropdown mode => Element is only for current page -->
<div class="mark slide-in">
  <div class="header"
  @click=${() => this.toggleActive()}
  >
    <span>${this.bookmark && this.bookmark.title ? this.bookmark.title : document.title}</span>
    <div class="favoriteIcon ${this.bookmark && this.bookmark.isStarred === true ? 'active' : ''}" @click=${async () =>
          await this.starBookmark()}>
      <!-- Bookmark Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-bookmark">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
  </div>
  <div class="main">
  </div>

  <!-- Only show tags when current location is saved as a bookmark -->
  ${this.bookmark ? html`
  <div class="footer">
    <bronco-chip-list @tagsChanged=${async (e: CustomEvent) => await this.tagsChanged(e)}
      .hideOnOutsideClick=${false}
      .chips=${this.bookmark.tags}></bronco-chip-list>
  </div>
  ` : ''}
</div>

<!-- Dropdown mode -->
` : html`
<div class="mark slide-in"
@click=${() => this.toggleActive()}
  >
  <div class="header">
    <div class="dropdown-icon ${this.active ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-chevron-right">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
    ${this.bookmark ? html`
    <span class="origin">${this.bookmark.title}</span>
    ` : ''}
    <action-toolbar
  .hideDeleteIcon=${true}
  @goToMark=${() => navigateExternal(this.bookmark.url)}></action-toolbar>
    <span class="badge">
      ${this.marksForBookmark.length}</span>
  </div>
  <div class="main">
  </div>

  <!-- Only show tags when current location is saved as a bookmark -->
  ${this.active ? html`
  <div class="footer"
  @click=${(e: Event) => {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
            }
  >

    <bronco-chip-list
    @tagsChanged=${async (e: CustomEvent) => await this.tagsChanged(e)}
      .hideOnOutsideClick=${false}
      .chips=${this.bookmark.tags}></bronco-chip-list>
  </div>
  ` : ''}

</div>
`}
`;
  }

}