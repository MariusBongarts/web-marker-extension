import { Tab } from './../../../models/tabs';
import { store } from './../../../store/store';
import { MarkerService } from './../../../services/marker.service';
import { Mark } from './../../../models/mark';
import { LoginUserDto } from './../../../models/loginUserDto';
import { UserService } from './../../../services/user.service';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { JwtPayload } from '../../../models/jwtPayload';
import './../mark-element/mark-element.component';
import './../bookmark-element/bookmark-element.component';
import openSocket from 'socket.io-client';
import { environment } from '../../../environments/environment.dev';
import { JwtService } from '../../../services/jwt.service';
import { connect } from 'pwa-helpers';
import { searchValueChanged } from '../../../store/actions';

const componentCSS = require('./main-component.component.scss');

/**
*
* This component is the sign-in component.
*
* It allows the user to login.
*
* @export
* @class MarkOverviewComponent
* @extends {LitElement}
*/
@customElement('main-component')
class MarkOverviewComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  socket: SocketIOClient.Socket;

  userService = new UserService();
  markService = new MarkerService();
  jwtService = new JwtService();


  @property()
  loggedUser!: JwtPayload;


  /**
  * Current active Tab, saved in store
  *
  * @memberof MarkOverviewComponent
  */
  @property()
  activeView: Tab = store.getState().activeView;


  /**
   * If true, the animation is active
   *
   * @memberof MarkOverviewComponent
   */
  @property()
  animation = false;

  /**
 * Can be set to true to hide side-bar icon. E.g. in full screen mode
 *
 * @memberof WebMarker
 */
  @property()
  hide = false;


  /**
  * Only marks fur current url
  *
  * @type {Mark[]}
  * @memberof MarkOverviewComponent
  */
  @property()
  marks!: Mark[];

  @property()
  loggedIn = false;

  @property()
  searchValue = '';


  @property()
  show = environment.production ? false : true;

  async firstUpdated() {
    this.marks = [];
    try {
      this.marks = await this.markService.getMarksForUrl(location.href);
    } catch (error) {
      this.emitLogout();
    }
    this.listenForFullscreen();

  }

      /**
    * Hides the icon on fullscreen mode
    *
    * @memberof WebMarker
    */
  listenForFullscreen() {
    window.addEventListener("resize", () => {
      if (window.innerHeight == screen.height) {
        this.hide = true;
      } else {
        this.hide = false;
      }
    });
  }


  /**
  * Function called by extended connect method from pwa-helper, when state changed
  *
  * @memberof MarkOverviewComponent
  */
  stateChanged(e) {
    if (store.getState().loggedIn) this.marks = store.getState().marks.filter(e => e.url === location.href);
    else this.marks = [];
    this.activeView = store.getState().activeView;
    this.searchValue = store.getState().searchValue;
    this.loggedIn = store.getState().loggedIn;
  }

  async initSocket() {
    const jwt = await this.jwtService.getJwt();
    const jwtPayload = await this.jwtService.getJwtPayload();
    if (environment.production) {
      this.socket = openSocket(environment.SOCKET_URL, { query: { jwt: jwt } });
    } else {
      this.socket = openSocket(environment.SOCKET_URL, { query: { jwt: jwt }, transports: ['websocket', 'xhr-polling'] });
    }
    this.socket.emit('join', { id: jwtPayload._id, email: jwtPayload.email });

  }

  // handleSockets() {
  // this.socket.on('createMark', (createdMark: Mark) => {
  // this.allMarks = [...this.allMarks, createdMark];
  // if (location.href === createdMark.url) {
  // this.marks = [...this.marks, createdMark];
  // } else {
  // // TODO: Maybe a popup to show that on different page has been added a mark?
  // }
  // });

  // this.socket.on('deleteMark', (deletedMarkId: string) => {
  // this.marks = this.marks.filter(mark => mark.id !== deletedMarkId);
  // this.allMarks = this.allMarks.filter(mark => mark.id !== deletedMarkId);
  // });

  // this.socket.on('updateMark', (updatedMark: Mark) => {
  // this.marks = this.marks.map(mark => mark.id === updatedMark.id ? updatedMark : mark);
  // this.allMarks = this.allMarks.map(mark => mark.id === updatedMark.id ? updatedMark : mark);
  // });

  // this.socket.on('connect', (data: string) => {
  // console.log('yeah');
  // });
  // }

  disconnectedCallback() {
    this.socket.disconnect();
  }

  emitLogout() {
    this.dispatchEvent(
      new CustomEvent('logout', {
        bubbles: true
      })
    );
  }

  emitTabChange(tabNr: number) {
    searchValueChanged('');
  }

  openLobbyContainer() {
    this.dispatchEvent(
      new CustomEvent('openLobby', {
        bubbles: true
      })
    );
  }


  /**
   * Wati for animation of side-menu to finish
   *
   * @memberof MarkOverviewComponent
   */
  toggleShow() {
    this.animation = true;
    this.show = !this.show;
    setTimeout(() => {
      this.animation = false;
    }, 300);

  }

  render() {
    return html`
    <!-- Button to toggle side-bar. It hides when animation is active -->
<button class="hideShow ${this.animation || this.hide ? 'hide' : ''} ${this.show && !this.animation ? 'active' : ''}" @click=${() => this.toggleShow()}>${this.show ?
        html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`
        : html`<mark-badge>${this.marks ? this.marks.length : 0}</mark-badge>`}</button>
${(this.show && !this.hide) || this.animation ? html`
<div class="container
${this.animation && this.show ? 'slide-in' : ''}
${this.animation && !this.show ? 'slide-out' : ''}">

  <div class="header">
    <header-toggle @toggleChanged=${(e: CustomEvent) => this.emitTabChange(e.detail)}>
    </header-toggle>
    <search-bar></search-bar>
  </div>
  <div class="main">

    ${this.loggedIn ? html`

    ${this.searchValue ? html`
    <search-view></search-view>
    ` : html`

    ${this.activeView === 'mark-view' ? html`
    <!-- Only marks for current page -->
    <bookmark-element></bookmark-element>

    <!-- Show marks for current page -->
    <mark-overview .isCurrentPageMode=${true}></mark-overview>
    ` : ''}

    ${this.activeView === 'accordion-view' ? html`
    <!-- Accordion view of marks for all pages -->
    <origin-overview></origin-overview>
    ` : ''}

    ${this.activeView === 'tags-view' ? html`
    <!-- Accordion view of marks for all pages -->
    <tags-view></tags-view>
    ` : ''}

    `}
    ` : ''}
  </div>

    ${this.loggedIn ? html`
    ` : html`
    <div class="infoContainer">
      <div class="mainInfo">
        <span>Login to save your marks</span>
      </div>
      <hr class="divider">
      <div class="loginInfo">
        <button @click=${() => this.openLobbyContainer()}>Login</button>
      </div>
      <div>
        `}
      </div>
      ` : ''}
      `
  }
}