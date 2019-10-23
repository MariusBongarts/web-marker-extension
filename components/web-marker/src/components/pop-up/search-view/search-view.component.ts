import { Mark } from './../../../models/mark';
import { MarkerService } from './../../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { urlToOrigin } from '../../../helper/urlHelper';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./search-view.component.scss');

@customElement('search-view')
export class SearchViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks: Mark[] = [];

  @property()
  searchValue: string;

  async firstUpdated() {
    this.marks = store.getState().marks;
  }

  stateChanged() {
    this.marks = store.getState().marks;
  }

  render() {
    return html`
    <tags-view .marks=${this.marks} .filter=${this.searchValue}></tags-view>
    <hr class="divider">
    <accordion-view .marks=${this.marks} .filter=${this.searchValue}></accordion-view>
    <hr class="divider">
    ${this.marks.filter(mark => mark.text.toLowerCase().includes(this.searchValue)).map(mark => html`<mark-element .mark=${mark}></mark-element>`)}
`;
  }

}
