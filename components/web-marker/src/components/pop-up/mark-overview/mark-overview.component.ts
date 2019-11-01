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
@customElement('main-component')
class MainComponentComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks: Mark[] = [];

  @property()
  bookmarkFilter: Bookmark;

  @property()
  searchFilter = '';

  stateChanged() {
    this.marks = store.getState().marks;
  }

  getFilteredMarks() {
    let filteredMarks = this.marks;

    // Filter for current bookmark, if given
    if(this.bookmarkFilter) {
      filteredMarks = filteredMarks.filter(mark => mark._bookmark === this.bookmarkFilter._id);
    }

    // Filter if search value is given
    if (store.getState().searchValue) {
      filteredMarks = filteredMarks.filter(mark => mark.title.toLowerCase().includes(
        this.searchFilter) ||
        this.isFilterInTagsOfBookmark(mark) ||
        mark.url.includes(store.getState().searchValue));
    }
    return filteredMarks;
  }

  isFilterInTagsOfBookmark(mark: Mark) {
    let tmp = false;
    mark.tags.forEach(tag => tag.toLowerCase().includes(this.searchFilter) ? tmp = true : '');
    return tmp;
  }

  render() {
    return html`
    <div class="container">
      ${this.getFilteredMarks().map(mark => html`
      <mark-element
      .mark=${mark}></mark-element>
      `)}
    </div>
  `
  }
}