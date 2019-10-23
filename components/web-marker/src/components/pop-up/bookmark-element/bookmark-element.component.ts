import { State } from './../../../store/reducer';
import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { timeSinceTimestamp } from '../../../helper/dateHelper';

const componentCSS = require('./bookmark-element.component.scss');

@customElement('bookmark-element')
class BookmarkElementComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  tags = [];

  @property()
  isFavorite = false;


  tagsChanged(e: CustomEvent) {
    if (this.tags.length != e.detail.chips.length) {
      this.tags = e.detail.chips;
      console.log(e.detail)
      this.dispatchEvent(
        new CustomEvent('tagsChanged', {
          bubbles: true,
          detail: e.detail
        })
      );
    }
  }

  render() {
    return html`
    <div class="mark">
      <div class="header" >
        <span>${document.title} </span>
        <div class="favoriteIcon ${this.isFavorite ? 'active': ''}" @click=${() => this.isFavorite = !this.isFavorite}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
      </div>
      <div class="main">
      </div>
      <div class="footer">
        <bronco-chip-list
        @tagsChanged=${(e: CustomEvent) => this.tagsChanged(e)}
        .hideOnOutsideClick=${false}
        .chips=${this.tags}></bronco-chip-list>
      </div>
    </div>
    `;
  }

}
