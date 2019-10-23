import { LoginUserDto } from './../../../models/loginUserDto';
import { UserService } from './../../../services/user.service';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';


const componentCSS = require('./sign-in.component.scss');

/**
 *
 * This component is the sign-in component.
 *
 * It allows the user to login.
 *
 * @export
 * @class SignInComponent
 * @extends {LitElement}
 */

@customElement('sign-in')
class SignInComponent extends LitElement {
  static styles = css`${unsafeCSS(componentCSS)}`;

  userService = new UserService();

  @query('form')
  form!: HTMLFormElement;

  @query('#email')
  emailElement!: HTMLInputElement;

  @query('#password')
  passwordElement!: HTMLInputElement;


  firstUpdated() {
    this.emailElement.addEventListener('keyup', async (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        await this.submit();
      }
    });
    this.passwordElement.addEventListener('keyup', async (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        await this.submit();
      }
    });
  }

  render() {
    return html`
    <div id="container">
      <form>
        <div class="input shadow-lg">
          <label for="email">E-Mail</label>
          <input type="email" autofocus required id="email" name="email">
          <div class="invalid-feedback">Email is required</div>
        </div>
        <div class="input shadow-lg">
          <label for="password">Password</label>
          <input type="password" required id="password" name="password">
          <div class="invalid-feedback">Pasword is required</div>
        </div>
        <button type="button" @click="${this.submit}">Sign-in</button>
      </form>
      `;
  }

  async submit() {
    if (this.isFormValid()) {
      const signInData: LoginUserDto = {
        email: this.emailElement.value,
        password: this.passwordElement.value
      };
      try {
        const jwtToken = await this.userService.login(signInData);
        if (jwtToken) this.emitLogin(jwtToken);
      } catch (error) {
        //
      }
    } else {
      this.form.classList.add('was-validated');
    }
  }

  emitLogin(jwtToken: string) {
    this.dispatchEvent(
      new CustomEvent('login', {
        detail: jwtToken,
        bubbles: true
      })
    );
  }

  isFormValid() {
    return this.form.checkValidity();
  }

}
