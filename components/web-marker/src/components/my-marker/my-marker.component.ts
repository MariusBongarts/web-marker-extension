import { State } from './../../store/reducer';
import { store } from './../../store/store';
import { connect } from 'pwa-helpers';
import { environment } from './../../environments/environment.dev';
import { JwtService } from './../../services/jwt.service';
import { MarkerService } from './../../services/marker.service';
import { Mark } from './../../models/mark';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
const componentCSS = require('./my-marker.component.scss');
import openSocket from 'socket.io-client';
import { deleteMarkFromDom } from '../../helper/markerHelper';

@customElement('my-marker')
export class MyMarkerElement extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  markerService = new MarkerService();
  jwtService = new JwtService();
  socket: SocketIOClient.Socket;

  listener = [];

  @property()
  editTags = false;

  @property()
  menuWidth!: number;

  @property()
  mark!: Mark;

  @property()
  show = false;

  @property()
  animation: 'slideIn' | 'slideOut' = 'slideIn';

  /**
   *  Necessary to abort hide animation when user enters mark again
   *
   * @memberof MyMarkerElement
   */
  abortHide = false;

  async firstUpdated() {

    if (this.mark) {
      this.setPosition();
      this.registerListener();
    }

    //await this.initSocket();
    //this.handleSockets();
  }

  stateChanged(e) {
    if (store.getState().lastAction === 'UPDATE_MARK') {
      this.mark = e.marks.find(e => this.mark && e.id === this.mark.id);
      this.requestUpdate();
    }
    if (store.getState().lastAction === 'REMOVE_MARK') {
      try {
        const marks = e.marks as Mark[];
        if (!marks.includes(this.mark)) {
          this.emitDeleted();
        }
      } catch(error) {
        //
      }

    }
  }



  // async initSocket() {
  //   const jwt = await this.jwtService.getJwt();
  //   const jwtPayload = await this.jwtService.getJwtPayload();
  //   if (environment.production) {
  //     this.socket = openSocket(environment.SOCKET_URL, { query: { jwt: jwt } });
  //   } else {
  //     this.socket = openSocket(environment.SOCKET_URL, { query: { jwt: jwt }, transports: ['websocket', 'xhr-polling'] });
  //   }
  //   this.socket.emit('join', { id: jwtPayload._id, email: jwtPayload.email });
  // }

  // handleSockets() {
  //   this.socket.on('deleteMark', (deletedMarkId: string) => {
  //     if (this.mark.id === deletedMarkId) {
  //       deleteMarkFromDom(this.parentElement);
  //       this.remove();
  //     }
  //   });

  //   this.socket.on('updateMark', (updatedMark: Mark) => {
  //     if (this.mark.id === updatedMark.id) {
  //       this.mark = updatedMark;
  //     }
  //   });

  //   // this.socket.on('connect', (data: string) => {
  //   //   console.log('yeah');
  //   // });
  // }

  /**
   *  Sets position of this component so that it is centralized above mark-element
   *
   * @memberof MyMarkerElement
   */
  setPosition() {
    const rectLines = this.parentElement.getClientRects() as DOMRectList;
    // this.style.left = rectLines.length === 1 ? this.parentElement.offsetLeft + 'px' : this.parentElement.parentElement.offsetLeft + 'px';
    this.style.width = this.getWidth(rectLines) + 'px';
    const offsetTop = this.getOffsetTop(rectLines);
    const offsetLeft = this.getOffsetLeft(rectLines);
    this.style.transform = `translate(${offsetLeft}, ${-offsetTop}px)`;
    this.classList.add('slideIn');
  }

  /**
   * Iterates over all rectlines and returns the maximum width of line
   *
   * @param {DOMRectList} rectLines
   * @returns
   * @memberof MyMarkerElement
   */
  getWidth(rectLines: DOMRectList) {
    let width = this.parentElement.offsetWidth;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < rectLines.length; i++) {
      width < rectLines[i].width ? width = rectLines[i].width : '';
    }
    return width;
  }

  getOffsetLeft(rectLines: DOMRectList) {
    if (rectLines.length === 1) return this.parentElement.offsetLeft - this.parentElement.parentElement.offsetLeft + 'px';
    else return 0 + 'px';
  }

  /**
   * Iterates over all clientRect rows and sums up all heights
   *
   * @returns
   * @memberof MyMarkerElement
   */
  getOffsetTop(rectLines: DOMRectList) {
    let offsetTop = 0;
    if (rectLines.length === 1) return rectLines[0].height + 5;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < rectLines.length; i++) {
      offsetTop += rectLines[i].height;
    }
    return offsetTop;
  }

  /**
   *  Register Listener to show and hide hovering menu.
   *  Abortes hiding when user enters element again after 300ms
   *
   * @memberof MyMarkerElement
   */
  registerListener() {
    this.parentElement.addEventListener('mouseenter', (e) => {
      this.show = true;
      this.abortHide = true;
      this.animation = 'slideIn';
    });

    this.parentElement.addEventListener('mouseleave', () => {
      this.abortHide = false;
      setTimeout(() => {
        if (!this.abortHide && !this.editTags) {
          this.animation = 'slideOut';
        }
      }, 500);
    });
  }

  /**
   *  Cascading event to trigger delete in root component
   *
   * @memberof MyMarkerElement
   */
  emitDeleted() {
    this.dispatchEvent(
      new CustomEvent('deleted', {
        bubbles: true,
        detail: this.mark.id
      })
    );
  }

  async updateTags() {
    this.editTags = false;
    this.animation = 'slideOut';
  }

  render() {
    return html`
    ${this.show ? html`
    ${this.editTags ? html`
    <div class="chip-container">
      <bronco-chip-list
      @submitTriggered=${() => this.updateTags()}
      .focused=${this.editTags}
      .mark=${this.mark}
      ></bronco-chip-list>
    </div>
    ` : ''}
    <div class="markContainer">
      <my-menu .menuWidth=${this.menuWidth} class="${this.animation}"
      @deleted=${() => this.emitDeleted()}
      @editTags=${async () => this.editTags ? this.updateTags() : this.editTags = true}
      .editTags=${this.editTags}
      .mark=${this.mark}></my-menu>
    </div>

    ` : ''}
 `;
  }


}
