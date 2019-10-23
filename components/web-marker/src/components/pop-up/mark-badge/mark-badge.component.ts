import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const componentCSS = require('./mark-badge.component.scss');

@customElement('mark-badge')
export class MarkBadgeComponenet extends LitElement {

  static styles = css`${unsafeCSS(componentCSS)}`;

  render() {
    return html`
    <span class="sideBadge"><slot></slot></span>
`;
  }

}
