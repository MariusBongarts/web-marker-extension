import { Mark } from './../../models/mark';
import { connect } from 'pwa-helpers';
import { store } from './../../store/store';
import { environment } from './../../environments/environment.dev';
import { JwtPayload } from './../../models/jwtPayload';
import { LoginUserDto } from './../../models/loginUserDto';
import { UserService } from './../../services/user.service';
import { MarkerService } from './../../services/marker.service';
import { JwtService } from './../../services/jwt.service';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import './sign-in/sign-in.component.ts';

const componentCSS = require('./app.component.scss');

@customElement('pop-up')
export class PopUpComponent extends connect(store)(LitElement) {
  static styles = css`${unsafeCSS(componentCSS)}`;
  jwtService = new JwtService();
  markService = new MarkerService();
  userService = new UserService();

  @property()
  loaded = false;

  @property()
  showAccountPopup = environment.production ? false : true;

  @property()
  marks!: Mark[];

  @property()
  loggedUser: JwtPayload;

  stateChanged() {
    if (!store.getState().loggedIn) this.loggedUser = undefined;
  }

  async firstUpdated() {
    await this.loadUserData();
    this.loaded = true;
  }

  async loadUserData() {
    try {
      this.loggedUser = await this.jwtService.getJwtPayload();
    } catch (error) {
      this.logout();
    }
  }

  logout() {
    this.loggedUser = undefined;
    this.userService.logout();
  }


  render() {
    return html`
    ${this.loaded ? html`
    <main-component
    @openLobby=${() => this.showAccountPopup = true}
    .loggedUser=${this.loggedUser}
    ></main-component>
      ${this.showAccountPopup && this.loggedUser && this.loggedUser.email ? html`
      <account-overview @logout=${() => this.logout()} .loggedUser=${this.loggedUser}></account-overview>
      ` : html`
      ${this.showAccountPopup ? html`
      <lobby-container @login=${async () => await this.loadUserData()}></lobby-container>
      ` : ''}
      `}
      ` :
        // html`<sign-in @login=${async () => await this.loadUserData()}></sign-in>`}
        html`<p>Loading...</p>`}
  `;
  }
}
