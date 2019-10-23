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
import uuidv4 from 'uuid/v4';
import { MarkerService } from './../../services/marker.service';
import { css, customElement, html, LitElement, property, unsafeCSS } from 'lit-element';
import { highlightText } from '../../helper/markerHelper';
import { navigateExternal } from '../../helper/router';
const componentCSS = require('./my-menu.component.scss');
let MyMarkElement = class MyMarkElement extends LitElement {
    constructor() {
        super(...arguments);
        this.show = false;
        this.editTags = false;
        this.menuWidth = 80;
        this.markerService = new MarkerService();
    }
    firstUpdated() {
        this.setStyle();
    }
    /**
     *  Width is set dynamically because it it necessary to calculcate center in parent element
     *
     * @memberof MyMarkElement
     */
    setStyle() {
        this.parentElement.style.width = `${this.menuWidth}px`;
    }
    toggleMark(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            if (!this.mark)
                yield this.saveMark();
            if (this.mark)
                yield this.deleteMark();
        });
    }
    /**
     *
     *
     * @param {MouseEvent}
     * @memberof MyMarkElement
     */
    saveMark() {
        return __awaiter(this, void 0, void 0, function* () {
            this.show = false;
            const mark = this.createMark();
            highlightText(null, mark);
            window.getSelection().empty();
            yield this.markerService.createMark(mark);
        });
    }
    /**
     * Created mark to save it in database.
     * Attributes of the range are saved to recreate it later.
     *
     * @returns {Mark}
     * @memberof MyMarkElement
     */
    createMark() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const mark = {
            id: uuidv4(),
            url: location.href,
            origin: location.href,
            tags: this.getDefaultMarks(),
            text: selection.toString(),
            title: document.title,
            anchorOffset: selection.anchorOffset,
            createdAt: new Date().getTime(),
            nodeData: range.startContainer.nodeValue,
            completeText: range.startContainer.parentElement.innerText,
            nodeTagName: range.startContainer.parentElement.tagName.toLowerCase(),
            startContainerText: range.startContainer.textContent,
            endContainerText: range.endContainer.textContent,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
        };
        console.log(mark);
        return mark;
    }
    getDefaultMarks() {
        const defaultTags = document.title.split(' ').filter(e => e.length > 2);
        return defaultTags.slice(0, 2);
    }
    /**
     *  First dispatches event to delete mark in client,
     *  then deletes it in server.
     *
     * @memberof MyMarkElement
     */
    deleteMark() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispatchEvent(new CustomEvent('deleted', {
                bubbles: true,
                detail: this.mark.id
            }));
            try {
                yield this.markerService.deleteMark(this.mark.id);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /* tslint:disable: max-line-length */
    render() {
        return html `
    <div class="menuContainer" tabindex="0">
    <!-- Add / remove mark -->
        <button tabindex="1" class="btn ${this.mark ? 'active' : ''}" @click=${(e) => __awaiter(this, void 0, void 0, function* () { return yield this.toggleMark(e); })}>
            <svg class="icon markIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512"><path d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"/></svg>
        </button>

      ${this.mark ? html `
    <!-- Add tags => TagIcon -->
      <button tabindex="2" class="btn tag ${this.editTags ? 'active' : ''}" @click=${() => this.dispatchEvent(new CustomEvent('editTags'))}>
      <svg class="icon tagIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tags" class="svg-inline--fa fa-tags fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path></svg>
    </button>

    <!-- Go to Homepage => UserIcon -->
      <button tabindex="1" class="btn user" @click=${() => navigateExternal('https://marius96.uber.space/')}>
      <!-- <svg class="icon userIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-tag" class="svg-inline--fa fa-user-tag fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M630.6 364.9l-90.3-90.2c-12-12-28.3-18.7-45.3-18.7h-79.3c-17.7 0-32 14.3-32 32v79.2c0 17 6.7 33.2 18.7 45.2l90.3 90.2c12.5 12.5 32.8 12.5 45.3 0l92.5-92.5c12.6-12.5 12.6-32.7.1-45.2zm-182.8-21c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24c0 13.2-10.7 24-24 24zm-223.8-88c70.7 0 128-57.3 128-128C352 57.3 294.7 0 224 0S96 57.3 96 128c0 70.6 57.3 127.9 128 127.9zm127.8 111.2V294c-12.2-3.6-24.9-6.2-38.2-6.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 287.9 0 348.1 0 422.3v41.6c0 26.5 21.5 48 48 48h352c15.5 0 29.1-7.5 37.9-18.9l-58-58c-18.1-18.1-28.1-42.2-28.1-67.9z"></path></svg> -->
      <!-- <svg class="icon userIcon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder-open" class="svg-inline--fa fa-folder-open fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"></path></svg> -->
      <svg class="icon user-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-circle" class="svg-inline--fa fa-user-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
    </button>
      ` : ''}
    </div>
 `;
    }
};
MyMarkElement.styles = css `${unsafeCSS(componentCSS)}`;
__decorate([
    property()
], MyMarkElement.prototype, "marks", void 0);
__decorate([
    property()
], MyMarkElement.prototype, "show", void 0);
__decorate([
    property()
], MyMarkElement.prototype, "editTags", void 0);
__decorate([
    property()
], MyMarkElement.prototype, "mark", void 0);
__decorate([
    property()
], MyMarkElement.prototype, "menuWidth", void 0);
MyMarkElement = __decorate([
    customElement('my-menu')
], MyMarkElement);
export { MyMarkElement };
//# sourceMappingURL=my-menu.component.js.map