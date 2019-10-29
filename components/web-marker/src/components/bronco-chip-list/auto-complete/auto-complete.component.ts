import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const componentCSS = require('./auto-complete.component.scss');

@customElement('auto-complete')
export class HeaderToggleComponent extends LitElement {
  @query('#autoComplete') inputElement: HTMLInputElement;

  @property() items: string[] = [];
  @property() filter: string;
  @property() selectedIndex: number = -1;

  static styles = css`${unsafeCSS(componentCSS)}`;

  async firstUpdated() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      e.stopPropagation();
      let filteredItems = this.items.filter(item => item.toLowerCase().includes(this.filter.toLowerCase()));

      // Key arrow down
      if (e.keyCode === 40 && ((this.selectedIndex + 1) < filteredItems.length)) {
        this.selectedIndex = this.selectedIndex + 1;
      }

      // Key arrow up
      if (e.keyCode === 38 && this.selectedIndex > -1) {
        this.selectedIndex = this.selectedIndex - 1;
      }

      // Enter
      if (e.keyCode === 13 && filteredItems.length !== 0) {
        this.emit(filteredItems[this.selectedIndex]);
        this.selectedIndex = -1;

        setTimeout(() => this.filter = '', 200);
      }

      if (filteredItems.length === 0) {
        this.selectedIndex = -1;
      }


    });
  }

  emit(value: string) {
    console.log("Ndksoifoih");
    this.dispatchEvent(
      new CustomEvent('selected', {
        bubbles: true,
        detail: value
      }));
  }


  render() {
    return html`
  ${this.filter ? html`
  <div class="auto-complete-items">
    ${this.items.filter(item => item.toLowerCase().includes(this.filter.toLowerCase())).map((item, index) =>
      html`
        <bronco-chip class="${this.selectedIndex === index ? 'active' : ''}" .hideDeleteIcon=${true}>${item}</bronco-chip>
      `)}
    </div>
      ` : ''}
`;
  }

}
