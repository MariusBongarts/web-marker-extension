var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
const componentCSS = require('./app.component.scss');
/**
 * Modern chip
 * @event clicked - Dispatches when chip is clicked.
 * @event removed - Dispatched when removed is clicked.
 * @slot - Default content.
 * @cssprop --bg-color - Background color
 * @cssprop --height - Height of the chip
 *
 */
let BroncoChip = class BroncoChip extends LitElement {
    constructor() {
        super(...arguments);
        /**
         *
         * If true, trash icon will be shown with red background
         * @type {boolean}
         * @memberof BroncoChip
         */
        this.deleteMode = true;
        /**
         *
         * Makes the chip outlined
         * @type {boolean}
         * @memberof BroncoChip
         */
        this.outline = false;
        /**
         * Enables the outline effect after clicking
         * @type {boolean}
         * @memberof BroncoChip
         */
        this.outlineEffect = false;
    }
    emit() {
        this.dispatchEvent(new CustomEvent('clicked', {
            bubbles: true
        }));
    }
    emitDeleted() {
        this.dispatchEvent(new CustomEvent('deleted', {
            bubbles: true
        }));
    }
    render() {
        return html `
<div class="chip ripple ${this.deleteMode ? 'delete-mode' : ''}">
  <div class="chip-content"><slot></slot></div>
  <div class="chip-close" @click=${() => this.emitDeleted()}>
      <svg class="chip-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
  </div>
</div>
`;
    }
};
BroncoChip.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    property()
], BroncoChip.prototype, "deleteMode", void 0);
__decorate([
    property({ type: Boolean, reflect: false })
], BroncoChip.prototype, "outline", void 0);
__decorate([
    property({ type: Boolean, reflect: false })
], BroncoChip.prototype, "outlineEffect", void 0);
BroncoChip = __decorate([
    customElement('bronco-chip')
], BroncoChip);
export { BroncoChip };
//# sourceMappingURL=app.component.js.map