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
import { store } from './../../store/store';
import { connect } from 'pwa-helpers';
import { JwtService } from './../../services/jwt.service';
import { MarkerService } from './../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
const componentCSS = require('./my-marker.component.scss');
let MyMarkerElement = class MyMarkerElement extends connect(store)(LitElement) {
    constructor() {
        super(...arguments);
        this.markerService = new MarkerService();
        this.jwtService = new JwtService();
        this.listener = [];
        this.editTags = false;
        this.show = false;
        this.animation = 'slideIn';
        /**
         *  Necessary to abort hide animation when user enters mark again
         *
         * @memberof MyMarkerElement
         */
        this.abortHide = false;
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mark) {
                this.setPosition();
                this.registerListener();
            }
            //await this.initSocket();
            //this.handleSockets();
        });
    }
    stateChanged(e) {
        if (store.getState().lastAction === 'UPDATE_MARK') {
            this.mark = e.marks.find(e => this.mark && e.id === this.mark.id);
            this.requestUpdate();
        }
        if (store.getState().lastAction === 'REMOVE_MARK') {
            try {
                const marks = e.marks;
                if (!marks.includes(this.mark)) {
                    this.emitDeleted();
                }
            }
            catch (error) {
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
        const rectLines = this.parentElement.getClientRects();
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
    getWidth(rectLines) {
        let width = this.parentElement.offsetWidth;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < rectLines.length; i++) {
            width < rectLines[i].width ? width = rectLines[i].width : '';
        }
        return width;
    }
    getOffsetLeft(rectLines) {
        if (rectLines.length === 1)
            return this.parentElement.offsetLeft - this.parentElement.parentElement.offsetLeft + 'px';
        else
            return 0 + 'px';
    }
    /**
     * Iterates over all clientRect rows and sums up all heights
     *
     * @returns
     * @memberof MyMarkerElement
     */
    getOffsetTop(rectLines) {
        let offsetTop = 0;
        if (rectLines.length === 1)
            return rectLines[0].height + 5;
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
        this.dispatchEvent(new CustomEvent('deleted', {
            bubbles: true,
            detail: this.mark.id
        }));
    }
    updateTags() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editTags = false;
            this.animation = 'slideOut';
        });
    }
    render() {
        return html `
    ${this.show ? html `
    ${this.editTags ? html `
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
      @editTags=${() => __awaiter(this, void 0, void 0, function* () { return this.editTags ? this.updateTags() : this.editTags = true; })}
      .editTags=${this.editTags}
      .mark=${this.mark}></my-menu>
    </div>

    ` : ''}
 `;
    }
};
MyMarkerElement.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    property()
], MyMarkerElement.prototype, "editTags", void 0);
__decorate([
    property()
], MyMarkerElement.prototype, "menuWidth", void 0);
__decorate([
    property()
], MyMarkerElement.prototype, "mark", void 0);
__decorate([
    property()
], MyMarkerElement.prototype, "show", void 0);
__decorate([
    property()
], MyMarkerElement.prototype, "animation", void 0);
MyMarkerElement = __decorate([
    customElement('my-marker')
], MyMarkerElement);
export { MyMarkerElement };
//# sourceMappingURL=my-marker.component.js.map