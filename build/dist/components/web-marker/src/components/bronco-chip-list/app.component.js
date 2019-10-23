var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MarkerService } from './../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
const componentCSS = require('./app.component.scss');
/**
 * Modern chip
 * @event tagsChanged - Dispatched when tags changed and returns array of tags
 * @event submitTriggered - Submit event when user enters 'ENTER' twise
 * @slot - Default content.
 * @cssprop --bg-color - Background color
 * @cssprop --color - Font color
 * @cssprop --font-size - Font size
 * @cssprop --min-height - Min-height of the chip-list
 * @cssprop --primary-color - Primary color which is set on focus
 *
 */
let BroncoChipList = class BroncoChipList extends LitElement {
    constructor() {
        super(...arguments);
        this.markerService = new MarkerService();
        /**
         * Array of tags as strings
         *
         * @memberof BroncoChipList
         */
        this.chips = [];
        /**
         * Property to set focus on input initially
         *
         * @memberof BroncoChipList
         */
        this.focused = true;
        /**
         * Property to prevent to fast deleting. So that user has to click backspace twice.
         *
         * @memberof BroncoChipList
         */
        this.markedToDelete = false;
        /**
         * Property to trigger submit after entering ENTER twice
         *
         * @memberof BroncoChipList
         */
        this.markedToSubmit = false;
    }
    firstUpdated() {
        this.chips = this.mark.tags;
        document.addEventListener('click', () => this.markedToDelete = false);
        this.focused ? this.inputElement.focus() : '';
    }
    disconnectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mark.tags = this.chips;
            yield this.markerService.updateMark(this.mark);
            this.submit();
        });
    }
    emit() {
        this.dispatchEvent(new CustomEvent('tagsChanged', {
            bubbles: true,
            detail: this.chips
        }));
    }
    /**
     * Listen to keyboard event to either add or remove tags
     * Tags are being added when user enters space or enter
     *
     * @param {KeyboardEvent} e
     * @memberof BroncoChipList
     */
    submitChip(e) {
        const target = e.target;
        if (target.value) {
            this.markedToDelete = false;
            this.markedToSubmit = false;
        }
        if (!target.value && e.key === 'Enter') {
            if (this.markedToSubmit) {
                this.markedToSubmit = false;
                this.submit();
            }
            else {
                this.markedToSubmit = true;
            }
        }
        if (target.value && (e.key === 'Enter' || e.code === 'Space')) {
            this.addChip(target);
            this.markedToSubmit = false;
        }
        if (e.key === 'Backspace' && this.chips.length && !target.value.length) {
            this.deleteChip(target);
            this.markedToSubmit = false;
        }
        this.emit();
    }
    submit() {
        this.dispatchEvent(new CustomEvent('submitTriggered', {
            bubbles: true,
            detail: this.chips
        }));
    }
    /**
     * Adds a tag if current value is not empty.
     * It splits the current value by space
     *
     * @param {HTMLInputElement} target
     * @memberof BroncoChipList
     */
    addChip(target) {
        const tags = target.value.split(' ').filter(e => e.length > 1 && !this.chips.includes(e));
        this.chips = [...this.chips, ...tags];
        target.value = '';
    }
    /**
     * Deletes a tag if it is already markes as deleted.
     *
     * @param {HTMLInputElement} target
     * @memberof BroncoChipList
     */
    deleteChip(target) {
        if (this.markedToDelete && !target.value && this.chips.length) {
            this.chips = this.chips.slice(0, this.chips.length - 1);
            this.markedToDelete = false;
        }
        else {
            this.markedToDelete = true;
            this.requestUpdate();
        }
    }
    filterChips(chip) {
        this.chips = this.chips.filter(e => e !== chip);
    }
    render() {
        return html `
<div class="chip-list ${this.markedToSubmit ? 'marked-to-submit' : ''}">
${this.chips.map((chip, index) => html `
<bronco-chip .deleteMode="${this.markedToDelete && index === this.chips.length - 1}"
@deleted=${() => this.filterChips(chip)}

>${chip}</bronco-chip>
`)}

    <input placeholder=${this.markedToSubmit ? 'Save' : 'Add tag'} type="text" class="form-control ${this.chips.length ? 'not-empty' : ''}" name="tag"  id="tag"  @keyup=${(e) => this.submitChip(e)}>
</div>
`;
    }
};
BroncoChipList.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    query('#tag')
], BroncoChipList.prototype, "inputElement", void 0);
__decorate([
    property()
], BroncoChipList.prototype, "chips", void 0);
__decorate([
    property()
], BroncoChipList.prototype, "mark", void 0);
__decorate([
    property()
], BroncoChipList.prototype, "focused", void 0);
__decorate([
    property()
], BroncoChipList.prototype, "markedToDelete", void 0);
__decorate([
    property()
], BroncoChipList.prototype, "markedToSubmit", void 0);
BroncoChipList = __decorate([
    customElement('bronco-chip-list')
], BroncoChipList);
export { BroncoChipList };
//# sourceMappingURL=app.component.js.map