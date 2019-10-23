import { LoginUserDto } from './../../../models/loginUserDto';
import { UserService } from './../../../services/user.service';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';

const componentCSS = require('./tab-bar.component.scss');

/**
 *
 * This component is a liquid tabbar 'stolen' from https://codepen.io/marius2502/pen/rNBoeBz.
 *
 * It allows the user to login.
 *
 * @export
 * @class SignInComponent
 * @extends {LitElement}
 */

@customElement('tab-bar')
class TabBarComponent extends LitElement {
  static styles = css`${unsafeCSS(componentCSS)}`;

  entries = [['user', 'User'], ['tags', 'Tags'], ['folder', 'Folder'], ['settings', 'Settings']];

  @property()
  activeEntry = 'user';

  firstUpdated() {
  }

  render() {
    return html`
<nav class="tabbar">
<ul style="">
${this.entries.map(entry => html`
<li
@click=${() => this.activeEntry = entry[0]}
class="${entry[0]} ${this.activeEntry === entry[0] ? 'active' : ''}"><a>
<div></div><span>${entry[1]}</span></a></li>
`)}

</ul>
</nav>

      `;
  }

}
