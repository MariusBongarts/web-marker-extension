import { connect } from 'pwa-helpers';
import { store } from './../../store/store';
import { State } from './../../store/reducer';
import { Mark } from './../../models/mark';
import { MarkerService } from './../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import './../bronco-chip/app.component';
import { updateMark } from '../../store/actions';

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
@customElement('bronco-chip-list')
export class BroncoChipList extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  markerService = new MarkerService();

  @query('#tag') inputElement!: HTMLInputElement;

  /**
   * Array of tags as strings
   *
   * @memberof BroncoChipList
   */
  @property()
  chips = [] as string[];

  /**
   * Current mark
   *
   * @memberof BroncoChipList
   */
  @property()
  mark: Mark;

  /**
   * Property to set focus on input initially
   *
   * @memberof BroncoChipList
   */
  @property()
  focused = true;

  /**
   * Property to prevent to fast deleting. So that user has to click backspace twice.
   *
   * @memberof BroncoChipList
   */
  @property()
  markedToDelete = false;

  @property()
  hideOnOutsideClick = true;

  /**
   * Property to trigger submit after entering ENTER twice
   *
   * @memberof BroncoChipList
   */
  @property()
  markedToSubmit = false;

  firstUpdated() {
    this.mark ? this.chips = this.mark.tags : '';
    document.addEventListener('click', () => this.markedToDelete = false);
    this.focused ? this.inputElement.focus() : '';
    this.hideOnOutsideClick ? this.closeOnOutsideClick() : '';
  }

  stateChanged(e: State) {
    if (this.mark && store.getState().lastAction === 'UPDATE_MARK') {
      this.mark = e.marks.find(e => e.id === this.mark.id);
      this.chips = this.mark.tags;
    }
  }

  closeOnOutsideClick() {
    document.body.onclick = (e) => {

      if (e.target !== this && e.target['tagName'] !== 'MY-MARKER') {
        this.remove();
        document.body.onclick = undefined;
      }
    }
  }

  async disconnectedCallback() {
    this.mark.tags = this.chips;
    this.submit();
  }

  async emit(deletedChip?: string) {
    this.dispatchEvent(
      new CustomEvent('tagsChanged', {
        bubbles: true,
        detail: { chips: this.chips, deletedChip: deletedChip ? deletedChip : undefined }
      })
    );

    if (this.mark && this.mark.tags.length !== this.chips.length) {
      this.mark.tags = this.chips;
      await this.markerService.updateMark(this.mark);
    }
  }

  /**
   * Listen to keyboard event to either add or remove tags
   * Tags are being added when user enters space or enter
   *
   * @param {KeyboardEvent} e
   * @memberof BroncoChipList
   */
  async submitChip(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;

    if (target.value) {
      this.markedToDelete = false;
      this.markedToSubmit = false;
    }

    if (!target.value && e.key === 'Enter') {
      if (this.markedToSubmit) {
        this.markedToSubmit = false;
        this.submit();
      } else {
        this.markedToSubmit = true;
      }
    }

    if (target.value && (e.key === 'Enter' || e.code === 'Space')) {
      this.addChip(target);
      this.markedToSubmit = false;
    }

    if (e.key === 'Backspace' && this.chips.length && !target.value.length) {
      await this.deleteChip(target);
      this.markedToSubmit = false;
    }

    e.key !== 'Backspace' ? this.emit() : '';

  }

  submit() {
    this.dispatchEvent(
      new CustomEvent('submitTriggered', {
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
  addChip(target: HTMLInputElement) {
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
  async deleteChip(target: HTMLInputElement) {
    if (this.markedToDelete && !target.value && this.chips.length) {
      console.log(this.chips[this.chips.length-1]);
      await this.filterChips(this.chips[this.chips.length-1]);
      this.markedToDelete = false;
    } else {
      this.markedToDelete = true;
      this.requestUpdate();
    }
  }

  async filterChips(chip: string) {
    this.chips = this.chips.filter(e => e !== chip);
    await this.emit(chip);
  }

  render() {
    return html`
<div class="chip-list ${this.markedToSubmit ? 'marked-to-submit' : ''}">
${this.chips.map((chip, index) => html`
<bronco-chip .deleteMode="${this.markedToDelete && index === this.chips.length - 1}"
@deleted=${async () => await this.filterChips(chip)}

>${chip}</bronco-chip>
`)}

    <input
    placeholder=${this.markedToSubmit ? 'Save' : '+'}
    type="text" class="form-control ${this.chips.length ? 'not-empty' : ''}" name="tag"  id="tag"  @keyup=${async (e: any) => await this.submitChip(e)}>
</div>
`;
  }

}
