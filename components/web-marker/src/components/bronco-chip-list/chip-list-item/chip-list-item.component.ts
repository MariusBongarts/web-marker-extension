import { Tag } from './../../../models/tag';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const componentCSS = require('./chip-list-item.component.scss');

@customElement('chip-list-item')
export class ChipListItemComponent extends LitElement {

  @property() tag!: Tag;

  @property() deleteMode = false;

  @property() hideDeleteIcon = false;


  /**
   * Active, when user selects item in autocomplete
   *
   * @memberof ChipListItemComponent
   */
  @property() active = false;


  static styles = css`${unsafeCSS(componentCSS)}`;

  async firstUpdated() {
  }

  render() {
    return html`

        <bronco-chip
        class="${this.active ? 'active' : ''}"
        .deleteMode=${this.deleteMode}
        .hideDeleteIcon=${this.hideDeleteIcon}>

        ${this.tag._directory ? html`
        <!-- Show directory icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        ` : html`
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        `}
        ${this.tag.name}</bronco-chip>
`;
  }

}
