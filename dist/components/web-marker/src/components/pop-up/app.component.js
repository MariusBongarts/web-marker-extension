var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from 'pwa-helpers';
import { store } from './../../store/store';
import { environment } from './../../environments/environment.dev';
import { UserService } from './../../services/user.service';
import { MarkerService } from './../../services/marker.service';
import { JwtService } from './../../services/jwt.service';
import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
import './sign-in/sign-in.component.ts';
const componentCSS = require('./app.component.scss');
let PopUpComponent = class PopUpComponent extends connect(store)(LitElement) {
    constructor() {
        super(...arguments);
        this.jwtService = new JwtService();
        this.markService = new MarkerService();
        this.userService = new UserService();
        this.loaded = false;
        /**
         * Can be set to true to hide side-bar icon. E.g. in full screen mode
         *
         * @memberof WebMarker
         */
        this.hide = false;
        this.showAccountPopup = environment.production ? false : true;
    }
    stateChanged() {
        if (!store.getState().loggedIn)
            this.loggedUser = undefined;
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadUserData();
            this.loaded = true;
            this.listenForFullscreen();
        });
    }
    /**
   * Hides the icon on fullscreen mode
   *
   * @memberof WebMarker
   */
    listenForFullscreen() {
        window.addEventListener("resize", () => {
            this.hide = false;
            if (window.innerHeight == screen.height) {
                this.hide = true;
            }
        });
    }
    loadUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.loggedUser = yield this.jwtService.getJwtPayload();
            }
            catch (error) {
                this.logout();
            }
        });
    }
    logout() {
        this.loggedUser = undefined;
        this.userService.logout();
    }
    render() {
        return html `
    ${this.loaded && !this.hide ? html `
    <main-component
    @openLobby=${() => this.showAccountPopup = true}
    .loggedUser=${this.loggedUser}
    ></main-component>
      ${this.showAccountPopup && this.loggedUser && this.loggedUser.email ? html `
      <account-overview @logout=${() => this.logout()} .loggedUser=${this.loggedUser}></account-overview>
      ` : html `
      ${this.showAccountPopup ? html `
      <lobby-container @login=${() => __awaiter(this, void 0, void 0, function* () { return yield this.loadUserData(); })}></lobby-container>
      ` : ''}
      `}
      ` :
            // html`<sign-in @login=${async () => await this.loadUserData()}></sign-in>`}
            html `<p>Loading...</p>`}
  `;
    }
};
PopUpComponent.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    property()
], PopUpComponent.prototype, "loaded", void 0);
__decorate([
    property()
], PopUpComponent.prototype, "hide", void 0);
__decorate([
    property()
], PopUpComponent.prototype, "showAccountPopup", void 0);
__decorate([
    property()
], PopUpComponent.prototype, "marks", void 0);
__decorate([
    property()
], PopUpComponent.prototype, "loggedUser", void 0);
PopUpComponent = __decorate([
    customElement('pop-up')
], PopUpComponent);
export { PopUpComponent };
//# sourceMappingURL=app.component.js.map