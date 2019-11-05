import { Bookmark } from './../../../models/bookmark';
import { Mark } from './../../../models/mark';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { urlToOrigin } from '../../../helper/urlHelper';

const componentCSS = require('./tags-view.component.scss');

@customElement('tags-view')
export class TagsViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  activeDirectory = '';

  @property()
  marks: Mark[] = [];

  @property()
  bookmarks: Bookmark[] = [];
  @property()
  filter = '';

  @property()
  loaded = false;

  @property()
  selectedTag = '';

  @property()
  tags: string[] = [];


  async firstUpdated() {
    this.marks = store.getState().marks;
    this.bookmarks = store.getState().bookmarks;

    this.loadDistinctTags();
    this.loaded = true;
  }

  stateChanged() {
    this.marks = store.getState().marks;
    this.bookmarks = store.getState().bookmarks;
    this.loadDistinctTags();
  }

  loadDistinctTags() {
    this.tags = [];
    this.marks.forEach(mark => {
      this.tags = [...this.tags, ...mark.tags];
    });
    this.bookmarks.forEach(bookmark => {
      this.tags = [...this.tags, ...bookmark.tags];
    });
    this.tags = [...new Set(this.tags)].filter(tag =>
      tag.toLowerCase().includes(store.getState().searchValue.toLowerCase()));
    this.sortTags();
  }

  sortTags() {
    this.tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }

  getRelatedTags() {
    let relatedTags = [];
    this.marks.filter(mark => mark.tags.includes(this.selectedTag)).forEach(mark => relatedTags = [...relatedTags,
    ...mark.tags]);
    let tags = [...new Set(relatedTags)].filter(tag => tag !== this.selectedTag);
    tags = tags.filter(tag => this.marks.filter(mark => mark.tags.includes(tag)).length > 0);
    return tags;
  }


  render() {
    return html`
${this.loaded ? html`

<!-- If no tag is selected -->
${!this.selectedTag ? html`
<div class="container">

<!-- Info text if there are no tags yet -->
  ${this.tags.length === 0 ? html`
  <div class="infoContainer">
    <div class="mainInfo">
      <span>No tags made yet</span>
    </div>
    <div class="subInfo">
      <span>Add tags to bookmarks or marks to see them here.</span>
    </div>
  </div>
  ` : html`
  ${this.tags.filter(tag => tag.toLowerCase().includes(this.filter)).map(tag =>
      html`
  <bronco-chip @click=${() => this.selectedTag === tag ? this.selectedTag = '' : this.selectedTag = tag}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(tag)).length + this.bookmarks.filter(bookmark => bookmark.tags.includes(tag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${tag}</span>
    </div>
  </bronco-chip>`
    )}
  `}
</div>

<!-- If Tag is selected -->
` : html`
<div class="selectedChipContainer">
  <bronco-chip @click=${() => this.selectedTag = ''}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(this.selectedTag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${this.selectedTag}</span>
    </div>
  </bronco-chip>
</div>
${this.bookmarks.filter(bookmark => bookmark.tags.includes(this.selectedTag)).map(bookmark => html`
<bookmark-element .bookmark=${bookmark}></bookmark-element>
`)}
${this.marks.filter(mark => mark.tags.includes(this.selectedTag)).map(mark =>
      html`<mark-element .mark=${mark} .headerInfo=${urlToOrigin(mark.url)}></mark-element>`
    )}
<!-- Show related tags -->
<div class="container">
  ${this.getRelatedTags().map(tag => html`
  <bronco-chip @click=${() => this.selectedTag === tag ? this.selectedTag = '' : this.selectedTag = tag}
    .badgeValue=${this.marks.filter(mark => mark.tags.includes(tag)).length} .hideDeleteIcon=${true}>
    <div class="chipContainer">
      <span>${tag}</span>
    </div>
  </bronco-chip>
  `)}

</div>
`}
` : html`Loading...`}

`;
  }

}