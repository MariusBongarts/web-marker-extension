import { State } from './../../../store/reducer';
import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { Mark } from './../../../models/mark';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { timeSinceTimestamp } from '../../../helper/dateHelper';
import { MarkerService } from '../../../services/marker.service';
import { navigateExternal } from '../../../helper/router';

const componentCSS = require('./mark-element.component.scss');

/**
 *
 * This component shows one single mark
 *
 * It allows the user to login.
 *
 * @export
 * @class MarkElementComponent
 * @extends {LitElement}
 */

@customElement('mark-element')
class MarkElementComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  markService = new MarkerService();

  @property()
  mark: Mark;

  @property()
  isActive = false;

  @property()
  addingTags = false;

  @property()
  headerInfo: string;

  stateChanged(e: State) {
    if (store.getState().lastAction === 'UPDATE_MARK') {
      this.mark = e.marks.find(e => e.id === this.mark.id);
      this.requestUpdate();
    }
  }

  async deleteMark(e: MouseEvent) {
    e.stopPropagation();
    await this.markService.deleteMark(this.mark.id);
  }

  async deleteTag(e: MouseEvent, deletedTag) {
    e.stopPropagation();
    this.mark.tags = this.mark.tags.filter(tag => tag !== deletedTag);
    await this.markService.updateMark(this.mark);
  }

  scrollToMark() {
    if (this.mark.origin == location.href) {
      const scrollOptions: ScrollToOptions = {
        top: this.mark.scrollY ? this.mark.scrollY : 0,
        left: 0,
        behavior: 'smooth'
      }
      window.scrollTo(scrollOptions);
    } else {
      navigateExternal(this.mark.origin, false);
    }
  }

  render() {
    return html`
    <div class="mark">
    <div class="header" >
      <span>${ this.headerInfo} </span>
        <span class="timeSince" > ${ timeSinceTimestamp(this.mark.createdAt)} ago </span>
          <span class="deleteBtn" @click=${async (e: MouseEvent) => await this.deleteMark(e)}> &times; </span>
            </div>
            <div class="main"  @click=${() => this.scrollToMark()}>
              <blockquote>${ this.mark.text} </blockquote>
                </div>
                <div class="footer">
                  ${this.addingTags ? html`
                  <bronco-chip-list
                  .hideOnOutsideClick=${false}
                  .mark=${this.mark}></bronco-chip-list>
                  ` : ''}
                  ${
      !this.addingTags ?
      this.mark.tags.map(tag => html`
      <bronco-chip
      @deleted=${async (e: MouseEvent) => await this.deleteTag(e, tag)}
      >${tag}</bronco-chip>`) : ''
      }
        </div>
      </div>
    `;
  }

}
