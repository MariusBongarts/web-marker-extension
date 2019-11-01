import { Mark } from './../../../models/mark';
import { Bookmark } from './../../../models/bookmark';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';

const componentCSS = require('./origin-element.component.scss');

@customElement('origin-element')
export class TreeViewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  bookmarks: Bookmark[];

  @property()
  selectedOrigin: string = '';

  @property()
  marks: Mark[];

  @property()
  origin: string;

  @property()
  active = false;

  @property()
  animation = false;

  stateChanged() {
    this.marks = store.getState().marks.filter(mark => mark.url.includes(this.origin));
  }


  /**
   * This method toggles the dropdown icon of the element. The timeout is necessary to wait for the animation to be completed.
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
<div class="element slide-in
${this.selectedOrigin && this.selectedOrigin !== this.origin && !this.animation ? 'slide-out' : 'slide-top'}
"
@click=${() => this.toggleActive() }
>
  <div class="header">
    <div class="dropdown-icon ${this.active ? 'active' : ''}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </div>
    <span class="origin">${this.origin} </span>
      <!-- Show either bookmark icon if there are no marks or number if marks for bookmark -->
  <span class="badge">
    ${this.marks.length ?
        this.marks.length
        :
        html` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="feather feather-bookmark">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>`
      }</span>
  </div>
  <div class="main">
  </div>


</div>
`;
  }

}