import { connect } from 'pwa-helpers';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { Tag } from '../../../models/tag';
import { store } from '../../../store/store';

const componentCSS = require('./auto-complete.component.scss');

@customElement('auto-complete')
export class HeaderToggleComponent extends connect(store)(LitElement) {

  listener: EventListener;

  @property() items: string[] = [];
  @property() filter: string;
  @property() selectedIndex: number = -1;
  @property() tags: Tag[];


  /**
   * Maximum of shown suggestions in dropdown
   *
   * @type {5}
   * @memberof HeaderToggleComponent
   */
  @property() maxSuggestions = 5;

  static styles = css`${unsafeCSS(componentCSS)}`;

  async firstUpdated() {
    this.tags = store.getState().tags;
    document.onkeydown = (e: KeyboardEvent) => {
      let filteredItems = [];
      this.items = this.tags.map(tag => tag.name);

      if (this.filter) {
        filteredItems = this.tags.filter(tag => tag.name.toLowerCase().includes(this.filter.toLowerCase()));
      }

      if (e.keyCode === 13) {
        this.selectedIndex = -1;
      }


      // Key arrow down
      if (e.keyCode === 40 && ((this.selectedIndex + 1) < this.maxSuggestions)) {
        this.selectedIndex = (this.selectedIndex + 1) % filteredItems.length;
        let tag = filteredItems[this.selectedIndex] || '';
        this.emit(tag.name);
      }

      // Key arrow up
      if (e.keyCode === 38 && this.selectedIndex > -1) {
        this.selectedIndex = this.selectedIndex - 1;
        this.selectedIndex < 0 ? this.selectedIndex = -1 : '';
        let tag = filteredItems[this.selectedIndex] || '';
        this.emit(tag.name);
      }

      if (filteredItems.length === 0) {
        this.selectedIndex = -1;
      }
    };
  }

  stateChanged() {
    this.tags = store.getState().tags;
  }


  /**
   * Remove event handler
   *
   * @memberof HeaderToggleComponent
   */
  disconnectedCallback() {
    document.onkeydown = undefined;
  }

  emit(value: string, isClick?: boolean) {
    // this.selectedIndex = -1;
    this.dispatchEvent(
      new CustomEvent(isClick ? 'clickSelected' : 'selected', {
        bubbles: true,
        detail: value
      }));
  }


  render() {
    return html`
  ${this.filter ? html`
  <div class="auto-complete-items">
    ${this.tags.filter(tag => tag.name.toLowerCase().includes(this.filter.toLowerCase())).slice(0, this.maxSuggestions).map((tag, index) =>
      html`
        <chip-list-item
        .hideDeleteIcon=${true}
        @click=${() => this.emit(tag.name, true)}
        .active=${this.selectedIndex === index}
        .tag=${tag}
        ></chip-list-item>
      `)}
    </div>
      ` : ''}
`;
  }

}
