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
  showActionToolbar = false;

  @property()
  mark: Mark;

  @property()
  isActive = false;

  @property()
  addingTags = false;

  @property()
  headerInfo: string;

  async stateChanged(e: State) {
    try {
      if (store.getState().lastAction === 'UPDATE_MARK') {
        const mark = e.marks.find(e => e.id === this.mark.id);
        mark.tags = [...new Set([...mark.tags])];
        this.mark = mark;
        console.log(this.mark);
        this.requestUpdate();
      }
      if (store.getState().lastAction === 'UPDATE_BOOKMARK') {
        console.log("Updated mark");
        const oldTags = this.mark.tags;
        this.mark = {...this.mark,
          tags:
          [...new Set([...this.mark.tags,
                 ...e.bookmarks.find(bookmark => bookmark.url === this.mark.url).tags])]
                }
                if (oldTags !== this.mark.tags) {
                  await this.markService.updateMark(this.mark);

                }
      this.requestUpdate();
      }
    } catch (error) {
      //
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

  scrollToMark(e: CustomEvent) {
    e.preventDefault();
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
${this.mark ? html`
<div class="mark slide-in">
  <div class="header">
    <span class="timeSince"> ${ timeSinceTimestamp(this.mark.createdAt)}</span>
    <action-toolbar @deleted=${async (e: MouseEvent) => await this.deleteMark(e)}
        @goToMark=${(e) => this.scrollToMark(e)}
        .hideGoToIcon=${true}
      ></action-toolbar>
  </div>
  <div class="main"
  @dblclick=${(e) => this.scrollToMark(e)}
  @click=${() => this.showActionToolbar = false}
  >
      <blockquote>${ this.mark.text} </blockquote>
    </div>
    <div class="footer" @click=${() => !this.showActionToolbar ? this.showActionToolbar = !this.showActionToolbar : ''}
        >

        <!-- Show either only tags or also input field to add tags -->
        ${this.showActionToolbar || this.mark.tags.length === 0 ? html`
        <bronco-chip-list .hideOnOutsideClick=${false} .mark=${this.mark}></bronco-chip-list>
        ` : ''}
        ${!this.showActionToolbar ?
        this.mark.tags.map(tag => html`
    <bronco-chip @deleted=${async (e: MouseEvent) => await this.deleteTag(e, tag)}
    >${tag}</bronco-chip>`) : ''
      }
  </div>
</div>
` : ''}
`;
  }

}