import uuidv4 from 'uuid/v4';
import { connect } from 'pwa-helpers';
import { store } from './../store/store';
import { MarkerService } from './../services/marker.service';
import { Mark } from './../models/mark';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { highlightText, createMark } from '../helper/markerHelper';
import { initMarks } from '../store/actions';

const componentCSS = require('./app.component.scss');

@customElement('web-marker')
export class WebMarker extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks!: Mark[];

  @property()
  show = false;

  @property()
  newContextMark!: string;

  /**
   * Set width of menu in px to calculate center.
   * Only for making new marks.
   *
   * @memberof WebMarker
   */
  @property()
  menuWidth = 80;

  private markerService = new MarkerService();

  async firstUpdated() {
    this.listenToShowMarker();
    await this.highlightMarks();
    this.listenForContextMenu();
  }

  listenForContextMenu() {
    try {
      chrome.runtime.onMessage.addListener(async (request) => {

        if (request.id === 'contextMenu' && request.detail) {
          const mark = createMark(request.detail);
          highlightText(null, mark);
          await this.markerService.createMark(mark);
        };
        
      });
    } catch (error) {
      // Chrome extension not available
    }

  }

  async stateChanged() {
    this.marks = store.getState().marks;
  }

  /**
   * Listens for click and selection events to show or hide the marker
   *
   * @memberof WebMarker
   */
  listenToShowMarker() {

    document.addEventListener('selectionchange', (e: Event) => {
      const selectionText = window.getSelection().toString();
      if (!selectionText.length) this.show = false;
    });

    document.addEventListener('click', (e: MouseEvent) => {
      const selectionText = window.getSelection().toString();
      if (!selectionText.length) this.show = false;
      else if (selectionText.length) {
        this.setPositionOfMarkerForClick(e);
      }
    });

    document.addEventListener('scroll', (e: MouseEvent) => {
      this.show = false;
    });

  }

  /**
   *  Sets the position of the marker for a click event.
   *  Gets the center from the bounds of the createdRange
   *
   * @param {MouseEvent} e
   * @memberof WebMarker
   */
  setPositionOfMarkerForClick(e: MouseEvent) {
    const rangeBounds = window.getSelection().getRangeAt(0).getBoundingClientRect();
    this.style.position = 'fixed';
    this.style.left = rangeBounds.left + (rangeBounds.width / 2) - (this.menuWidth / 2) - 35 + 'px';
    this.style.top = rangeBounds.top + 'px';
    this.show = true;
  }

  /**
   *  This method loads all marks for current url from server
   *
   * @todo Load only marks with current url from server
   *
   * @memberof WebMarker
   */
  async highlightMarks() {
    this.scrollToMark();
    this.marks = await this.markerService.getMarksForUrl(location.href);
    this.marks.forEach(mark => highlightText(null, mark));
  }


  /**
   *  Scroll to mark if there is a scrollY param in query url.
   *  SetTimeout to put at the end of event Loop
   * @memberof WebMarker
   */
  scrollToMark() {
    setTimeout(() => {
      try {
        const params = location.href.split('?')[1].split('=');
        params.forEach((param, index) => {
          if (param === 'scrollY') {
            const scrollOptions: ScrollToOptions = {
              top: Number(params[index + 1]),
              left: 0,
              behavior: 'smooth'
            }
            window.scrollTo(scrollOptions);
          }
        });
      } catch (error) {
        //
      }
    });

  }

  render() {
    return html`
  <my-marker .show=${this.show} .menuWidth=${this.menuWidth}></my-marker>
  `;
  }

}
