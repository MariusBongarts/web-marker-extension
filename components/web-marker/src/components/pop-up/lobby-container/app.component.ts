import { JwtService } from './../../../services/jwt.service';
import { JwtPayload } from './../../../models/jwtPayload';
import { store } from './../../../store/store';
import { connect } from 'pwa-helpers';
import { LoginUserDto } from './../../../models/loginUserDto';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { UserService } from '../../../services/user.service';
import { initData, login } from '../../../store/actions';

const componentCSS = require('./app.component.scss');

/**
 *
 * This component is the sign-in component.
 *
 * It allows the user to login.
 *
 * @export
 * @class LobbyContainer
 * @extends {LitElement}
 */

@customElement('lobby-container')
class LobbyContainer extends connect(store)(LitElement) {
	static styles = css`${unsafeCSS(componentCSS)}`;
	userService = new UserService();
	jwtService = new JwtService();

	@property()
	formSuccess = false;

	@property()
	loading = false;

	@query('form')
	form!: HTMLFormElement;

	@query('#email')
	emailElement!: HTMLInputElement;

	@query('#password')
	passwordElement!: HTMLInputElement;

	@property()
	loggedUser: JwtPayload;

	async firstUpdated() {
		await this.loadUserData();
	}

	stateChanged() {
		if (!store.getState().loggedIn) this.loggedUser = undefined;
	}

	async loadUserData() {
		try {
			this.loggedUser = await this.jwtService.getJwtPayload();
		} catch (error) {
			this.logout();
		}
	}


	/**
	 * Notifies content script that user loggedIn successfully
	 *
	 * @memberof LobbyContainer
	 */
	chromeMessage(requestId: 'loggedIn' | 'loggedOut') {
		try {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, {
					id: requestId,
				});
			});
		} catch (error) {

		}
	}

	async logout() {
		this.loggedUser = undefined;
		await this.userService.logout();
		this.chromeMessage('loggedOut');
	}

	async submit(e?: MouseEvent) {
		e.stopImmediatePropagation();
		e ? e.preventDefault() : '';
		let jwtToken = '';
		if (this.isFormValid()) {
			const signInData: LoginUserDto = {
				email: this.emailElement.value,
				password: this.passwordElement.value
			};
			try {
				this.loading = true;
				jwtToken = await this.userService.login(signInData);
			} catch (error) {
				//
			}
			jwtToken ? this.formSuccess = true : '';
			this.loading = false;
		} else {
			this.form.classList.add('was-validated');
		}
		if (jwtToken) {
			// Notifies content script that user logged in
			this.chromeMessage('loggedIn');
			setTimeout(async () => {
				await this.loadUserData();
			}, 500);
		}
	}

	isFormValid() {
		return this.form.checkValidity();
	}

	render() {
		return html`
		${this.loggedUser && this.loggedUser.email ? html`
		<account-overview @logout=${async () => await this.logout()} .loggedUser=${this.loggedUser}></account-overview>
		` :
				html`
		<bubbles-animation>
			<div class="container ${this.formSuccess ? 'form-success' : ''}">
					<h1>Welcome</h1>
					${!this.formSuccess ? html`
					<form class="form">
						<input type="email" required id="email" name="email" placeholder="Email">
						<input type="password" required id="password" name="password" placeholder="Password">
						<button
						type="submit" id="login-button" @click=${(e: MouseEvent) => this.submit(e)}
						class="${this.loading ? 'loading' :

							''}"
				>${this.loading ? '...' : 'Login'}</button>
				</form>
				` : ''}
			</div>
		</bubbles-animation>
	`}
  `
	}
}