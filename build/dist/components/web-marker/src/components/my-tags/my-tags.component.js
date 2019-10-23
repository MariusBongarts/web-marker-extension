var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, customElement, html, LitElement, unsafeCSS } from 'lit-element';
const componentCSS = require('./my-tags.component.scss');
let MyTagsElement = class MyTagsElement extends LitElement {
    firstUpdated() {
    }
    /* tslint:disable: max-line-length */
    render() {
        return html `

 `;
    }
};
MyTagsElement.styles = css `${unsafeCSS(componentCSS)}`;
MyTagsElement = __decorate([
    customElement('my-tags')
], MyTagsElement);
export { MyTagsElement };
//# sourceMappingURL=my-tags.component.js.map