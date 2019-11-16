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
import { store } from './../store/store';
import { MarkerService } from './../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
import { highlightText, createMark } from '../helper/markerHelper';
const componentCSS = require('./app.component.scss');
let WebMarker = class WebMarker extends connect(store)(LitElement) {
    constructor() {
        super(...arguments);
        this.show = false;
        /**
         * Can be set to true to hide side-bar icon. E.g. in full screen mode
         *
         * @memberof WebMarker
         */
        this.hide = false;
        /**
         * Set width of menu in px to calculate center.
         * Only for making new marks.
         *
         * @memberof WebMarker
         */
        this.menuWidth = 80;
        this.markerService = new MarkerService();
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (store.getState().loggedIn) {
                this.listenToShowMarker();
                yield this.highlightMarks();
            }
            this.listenForContextMenu();
            this.listenForFullscreen();
        });
    }
    stateChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            if (store.getState().loggedIn) {
                this.marks = store.getState().marks;
            }
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
    listenForContextMenu() {
        try {
            chrome.runtime.onMessage.addListener((request) => __awaiter(this, void 0, void 0, function* () {
                if (request.id === 'contextMenu' && request.detail) {
                    const mark = createMark(request.detail);
                    highlightText(null, mark);
                    yield this.markerService.createMark(mark);
                }
                ;
            }));
        }
        catch (error) {
            // Chrome extension not available
        }
    }
    /**
     * Listens for click and selection events to show or hide the marker
     *
     * @memberof WebMarker
     */
    listenToShowMarker() {
        document.addEventListener('selectionchange', (e) => {
            const selectionText = window.getSelection().toString();
            if (!selectionText.length)
                this.show = false;
        });
        document.addEventListener('click', (e) => {
            const selectionText = window.getSelection().toString();
            if (!selectionText.length)
                this.show = false;
            else if (selectionText.length) {
                this.setPositionOfMarkerForClick(e);
            }
        });
        document.addEventListener('scroll', (e) => {
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
    setPositionOfMarkerForClick(e) {
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
    highlightMarks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.scrollToMark();
            this.marks = yield this.markerService.getMarksForUrl(location.href);
            if (this.marks) {
                this.marks.forEach(mark => highlightText(null, mark));
            }
        });
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
                        const scrollOptions = {
                            top: Number(params[index + 1]),
                            left: 0,
                            behavior: 'smooth'
                        };
                        window.scrollTo(scrollOptions);
                    }
                });
            }
            catch (error) {
                //
            }
        });
    }
    render() {
        return html `
  ${!this.hide ? html `
  <my-marker .show=${this.show} .menuWidth=${this.menuWidth}></my-marker>
  ` : ''}
  `;
    }
};
WebMarker.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    property()
], WebMarker.prototype, "marks", void 0);
__decorate([
    property()
], WebMarker.prototype, "show", void 0);
__decorate([
    property()
], WebMarker.prototype, "hide", void 0);
__decorate([
    property()
], WebMarker.prototype, "newContextMark", void 0);
__decorate([
    property()
], WebMarker.prototype, "menuWidth", void 0);
WebMarker = __decorate([
    customElement('web-marker')
], WebMarker);
export { WebMarker };
//# sourceMappingURL=app.component.js.map