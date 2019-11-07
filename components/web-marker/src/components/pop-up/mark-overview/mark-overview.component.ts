import { Bookmark } from './../../../models/bookmark';
import { Mark } from './../../../models/mark';
import { store } from './../../../store/store';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import './../mark-element/mark-element.component';
import './../bookmark-element/bookmark-element.component';
import { connect } from 'pwa-helpers';

const componentCSS = require('./mark-overview.component.scss');

/**
*
* This shows all marks and can be filtered by the filterValue
*
* @export
* @class MarkOverviewComponent
* @extends {LitElement}
*/
@customElement('mark-overview')
class MainComponentComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks: Mark[] = [];

  @property()
  bookmarkFilter: Bookmark;

  @property()
  searchFilter = '';


  /**
   * When set to true, only marks for current page are shown
   *
   * @memberof MainComponentComponent
   */
  @property()
  isCurrentPageMode = false;

  firstUpdated() {
    this.marks = store.getState().marks;
    this.filterMarks();
  }

  stateChanged() {
    console.log("Change")
    this.marks = store.getState().marks;
    this.filterMarks();
  }

  filterMarks() {
    // Filter for current page if mode is set to currentPage
    if (this.isCurrentPageMode) {
      this.marks = this.marks.filter(mark => mark.url === location.href);
    } else {
      this.marks = this.getFilteredMarks();
    }
  }

  getFilteredMarks() {
    let filteredMarks = this.marks;

    // Filter for current bookmark, if given
    if (this.bookmarkFilter) {
      filteredMarks = filteredMarks.filter(mark => mark.url === this.bookmarkFilter.url);
    }

    // Filter if search value is given
    if (store.getState().searchValue) {
      filteredMarks = filteredMarks.filter(mark => mark.title.toLowerCase().includes(
        this.searchFilter) ||
        this.isFilterInTagsOfBookmark(mark) ||
        mark.url.includes(store.getState().searchValue));
    }
    console.log(filteredMarks);
    return filteredMarks;
  }

  isFilterInTagsOfBookmark(mark: Mark) {
    let tmp = false;
    mark.tags.forEach(tag => tag.toLowerCase().includes(this.searchFilter) ? tmp = true : '');
    return tmp;
  }

  render() {
    return html`
${this.marks.length === 0 && !this.searchFilter && this.isCurrentPageMode ? html`
<div class="infoContainer">
  <div class="mainInfo">
    <span>No marks made on this page</span>
  </div>
  <div class="subInfo">
    <span>Select text on this page to add new highlights.</span>
  </div>
</div>
` : html`
<div class="markContainer">
  ${this.marks.map(mark => html`
  <mark-element .mark=${mark}></mark-element>
  `)}
</div>
`}
`
  }
}