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
    }
    stateChanged() {
        if (!store.getState().loggedIn)
            this.loggedUser = undefined;
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadUserData();
            this.loaded = true;
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
    /**
     * Function called by content script, when user logs out in browser action popup
     *
     * @memberof LobbyContainer
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loggedUser = undefined;
            yield this.userService.logout();
        });
    }
    render() {
        return html `
    ${this.loaded ? html `
    <main-component
    .loggedUser=${this.loggedUser}
    ></main-component>
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
], PopUpComponent.prototype, "marks", void 0);
__decorate([
    property()
], PopUpComponent.prototype, "loggedUser", void 0);
PopUpComponent = __decorate([
    customElement('pop-up')
], PopUpComponent);
export { PopUpComponent };
//# sourceMappingURL=app.component.js.map