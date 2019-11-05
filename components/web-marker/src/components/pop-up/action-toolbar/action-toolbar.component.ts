import { connect } from 'pwa-helpers'; import { store } from './../../../store/store';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';

const componentCSS = require('./action-toolbar.component.scss');

@customElement('action-toolbar')
class BookmarkElementComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;


  /**
   * When set to true, it hides the delete icon
   *
   * @memberof BookmarkElementComponent
   */
  @property()
  hideDeleteIcon = false;



  /**
   * Either @event goToMatk or @event deleted
   *
   * @param {string} eventName
   * @memberof BookmarkElementComponent
   */
  emit(eventName: string) {
    this.dispatchEvent(new CustomEvent(eventName));
  }


  render() {
    return html`
<div class="toolbar">

<!-- Go to url of current mark or scroll -->
  <div class="icon goToIcon" @click=${() => this.emit('goToMark')}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-external-link"
    style="
    height: 100%;
"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
  </div>

  <!-- Hide delete Icon when hideDeleteIcon is true -->
  ${!this.hideDeleteIcon ? html`
  <div  class="icon deleteIcon" @click=${() => this.emit('deleted')}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </div>
  ` : ''}

</div>

`;
  }
}
