import { Tag } from './../../../models/tag';
import { Directory } from './../../../models/directory';
import { TagsService } from './../../../services/tags.service';
import { Bookmark } from './../../../models/bookmark';
import { Mark } from './../../../models/mark';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { urlToOrigin } from '../../../helper/urlHelper';
import { toggleTag } from '../../../store/actions';

const componentCSS = require('./tags-view.component.scss');

@customElement('tags-view')
export class TagsViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  tagsService = new TagsService();

  @query('#searchInput')
  searchElement!: HTMLInputElement;

  @property()
  marks: Mark[] = [];

  @property()
  bookmarks: Bookmark[] = [];

  @property()
  selectedBookmark!: Bookmark;

  @property()
  selectedDirectory!: Directory;

  @property()
  filter = '';

  @property()
  loaded = false;

  @property()
  selectedTag = store.getState().activeTag;

  @property()
  tags: string[] = [];

  @property()
  tagsForDirectory: Tag[] = [];

  @property()
  dragMode = false;

  async firstUpdated() {
    this.loadData();
  }

  stateChanged() {
    this.loadData();
    this.searchElement.value = '';
    this.filter = '';
  }

  loadData() {
    this.dragMode = store.getState().dragMode;
    this.marks = store.getState().marks;
    this.bookmarks = store.getState().bookmarks;
    this.selectedTag = store.getState().activeTag;
    this.getTags();
    this.selectedDirectory = store.getState().activeDirectory;
    this.selectedBookmark = undefined;
    this.loaded = true;
  }

  getTags() {
    this.tags = store.getState().tags.filter(tag => !tag._directory).map(tag => tag.name);

    if (this.selectedDirectory) {
      this.tagsForDirectory = store.getState().tags.filter(tag => tag._directory && tag._directory === this.selectedDirectory._id);
    } else {
      this.tagsForDirectory = [];
    }
  }

  /**
  * Find related tags, which are inserted in combination with selected tag
  *
  * @returns
  * @memberof TagsViewComponent
  */
  getRelatedTags() {
    let relatedTags = [];
    this.marks.filter(mark => mark.tags.includes(this.selectedTag)).forEach(mark => relatedTags = [...relatedTags,
    ...mark.tags]);
    this.bookmarks.filter(bookmark => bookmark.tags.includes(this.selectedTag)).forEach(bookmark => relatedTags =
      [...relatedTags,
      ...bookmark.tags]);
    let tags = [...new Set(relatedTags)].filter(tag => tag !== this.selectedTag);
    tags = tags.filter(tag =>
      this.marks.filter(mark => mark.tags.includes(tag)).length > 0 ||
      this.bookmarks.filter(bookmark => bookmark.tags.includes(tag)).length > 0);
    return tags;
  }

  /**
  * Toggle tag in state management
  *
  * @param {string} tag
  * @memberof TagsViewComponent
  */
  toggleTag(tag: string) {
    store.getState().activeTag === tag ? toggleTag('') : toggleTag(tag);
  }


  /**
   * Tags can be dragged in directories. The belonging tagName is saved in dataTransfer object.
   *
   * @param {DragEvent} e
   * @param {string} tag
   * @memberof TagsViewComponent
   */
  dragTag(e: DragEvent, tag: string) {
    e.dataTransfer.setData("tagName", tag);
  }


  /**
   * Filter tags by search
   *
   * @memberof TagsViewComponent
   */
  emitInput() {
    this.filter = this.searchElement.value.toLowerCase();
  }

  render() {
    return html`
${this.loaded ? html`

<directory-overview></directory-overview>

<!-- Element in which directories can be dragged to delete them. This is only shown when the user drags something (Handled in component) -->
${this.dragMode ? html`
<remove-directory-element></remove-directory-element>
` : ''}

<!-- If no tag is selected -->
${!this.selectedTag ? html`
<div class="container">
<input
      id="searchInput"
      class="searchInput"
      type="search"
      @search=${(e: KeyboardEvent) => this.emitInput()}
      @keydown=${(e: KeyboardEvent) => this.emitInput()}
      @keyup=${(e: KeyboardEvent) => this.emitInput()}
      placeholder="Filter...">

  <!-- Info text if there are no tags yet -->
  ${this.tags.length === 0 && !this.selectedDirectory ? html`
  <div class="infoContainer">
    <div class="mainInfo">
      <span>No tags made yet</span>
    </div>
    <div class="subInfo">
      <span>Add tags to bookmarks or marks to see them here.</span>
    </div>
  </div>
  ` : html`
  <!-- Show all tags if no directory is selected -->
  ${this.tags.filter(tag => tag.toLowerCase().includes(this.filter) && (!this.selectedDirectory)).map(tag =>
      html`
  <bronco-chip
  draggable="true"
  @dragstart=${(e: DragEvent) => this.dragTag(e, tag)}
  @click=${() => this.toggleTag(tag)}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(tag)).length + this.bookmarks.filter(bookmark =>
        bookmark.tags.includes(tag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${tag}</span>
    </div>
  </bronco-chip>`
    )}

    <!-- Show tags for current selected directory -->
    ${this.selectedDirectory ? html`
    ${this.tagsForDirectory.filter(tag => tag.name.toLowerCase().includes(this.filter)).map(tag =>
      html`
        <bronco-chip
  draggable="true"
  @dragstart=${(e: DragEvent) => this.dragTag(e, tag.name)}
  @click=${() => this.toggleTag(tag.name)}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(tag.name)).length + this.bookmarks.filter(bookmark =>
        bookmark.tags.includes(tag.name)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${tag.name}</span>
    </div>
  </bronco-chip>
    `)}
    ` : ''}
  `}
</div>

<!-- If Tag is selected -->
` : html`
<div class="selectedChipContainer">
  <bronco-chip @click=${() => this.toggleTag(this.selectedTag)}
  draggable="true"
  @dragstart=${(e: DragEvent) => this.dragTag(e, this.selectedTag)}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(this.selectedTag)).length +
            this.bookmarks.filter(bookmark => bookmark.tags.includes(this.selectedTag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${this.selectedTag}</span>
    </div>
  </bronco-chip>
</div>


<!-- Show related tags -->
<div class="container">
  ${this.getRelatedTags().map(tag => html`
  <bronco-chip @click=${() => this.toggleTag(tag)}
  draggable="true"
  @dragstart=${(e: DragEvent) => this.dragTag(e, tag.name)}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(tag)).length + this.bookmarks.filter(bookmark =>
              bookmark.tags.includes(tag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${tag}</span>
    </div>
  </bronco-chip>
  `)}
</div>

<!-- Show bookmarks icon if there are bookmarks for selected tag -->
${this.bookmarks.filter(bookmark => bookmark.tags.includes(this.selectedTag)).length ? html`
<div class="bookmark-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
</div>
` : ''}
<!-- Show bookmarks for selected tag -->
${this.bookmarks.filter(bookmark =>
                bookmark.tags.includes(this.selectedTag)).map(bookmark => html`
<!-- Hide bookmark, when a bookmark got selected and it is not the selected one -->
${!this.selectedBookmark || this.selectedBookmark === bookmark ? html`
<bookmark-element @click=${() => this.selectedBookmark && this.selectedBookmark === bookmark ? this.selectedBookmark =
                      undefined : this.selectedBookmark = bookmark}
  .bookmark=${bookmark}
  .isDropdown=${true}></bookmark-element>
` : ''}
`)}

<!-- Show marks icon if there are marks for selected tag. Hide when bookmark is selected -->
${!this.selectedBookmark ? html`
${this.marks.filter(mark => mark.tags.includes(this.selectedTag)).length ? html`
<div class="mark-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 544 512">
    <path
      d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z" />
    </svg>
</div>
` : ''}
<!-- Show marks for selected tag -->
${this.marks.filter(mark => mark.tags.includes(this.selectedTag)).map(mark =>
                        html`<mark-element .mark=${mark} .headerInfo=${urlToOrigin(mark.url)}></mark-element>`
                      )}

</div>

` : ''}
`}
` : html`Loading...`}

`;
  }

}