import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const componentCSS = require('./app.component.scss');

/**
 * Modern chip
 * @event clicked - Dispatches when chip is clicked.
 * @event removed - Dispatched when removed is clicked.
 * @slot - Default content.
 * @cssprop --primary-color - Background color
 * @cssprop --height - Height of the chip
 *
 */
@customElement('bronco-chip')
export class BroncoChip extends LitElement {

  static styles = css`${unsafeCSS(componentCSS)}`;

  /**
   *
   * If true, trash icon will be shown with red background
   * @type {boolean}
   * @memberof BroncoChip
   */
  @property() deleteMode: boolean = false;

  /**
   *
   * If true, trash icon will not be shown
   * @type {boolean}
   * @memberof BroncoChip
   */
  @property() hideDeleteIcon: boolean = false;


  /**
   *
   * If value, a badge with number can be shown
   * @type {number}
   * @memberof BroncoChip
   */
  @property() badgeValue: number = undefined;

  @property()
  smallDeleteIcon = false;

  /**
   *
   * Makes the chip outlined
   * @type {boolean}
   * @memberof BroncoChip
   */
  @property({ type: Boolean, reflect: false }) outline: boolean = false;

  /**
   * Enables the outline effect after clicking
   * @type {boolean}
   * @memberof BroncoChip
   */
  @property({ type: Boolean, reflect: false }) outlineEffect: boolean = false;

  emit() {
    this.dispatchEvent(
      new CustomEvent('clicked', {
        bubbles: true
      })
    );
  }

  emitDeleted() {
    this.dispatchEvent(
      new CustomEvent('deleted', {
        bubbles: true
      })
    );
  }

  render() {
    return html`
<div class="chip ripple
${this.deleteMode ? 'delete-mode' : ''}">
  <div class="chip-content"><slot></slot></div>
  ${this.hideDeleteIcon ? '' : html`
  <div class="chip-close" @click=${() => this.emitDeleted()}>
      <!-- <svg class="chip-svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg> -->
      <svg class="chip-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </div>
  `}

  ${this.badgeValue ? html`
  <div class="chip-close">
      <span class="chip-svg badge">${this.badgeValue}</span>
    </div>

  ` : ''}
</div>
`;
  }

}
