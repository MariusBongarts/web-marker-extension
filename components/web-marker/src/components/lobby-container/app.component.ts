import { JwtService } from '../../services/jwt.service';
import { JwtPayload } from '../../models/jwtPayload';
import { store } from '../../store/store';
import { connect } from 'pwa-helpers';
import { LoginUserDto } from '../../models/loginUserDto';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { UserService } from '../../services/user.service';
import { initData, login } from '../../store/actions';
import './sign-up/sign-up.component.ts';
import './sign-in/sign-in.component.ts';

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
	activeTab: 'signIn' | 'signUp' = 'signIn';

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
		if (!store.getState().loggedIn) {
			this.loggedUser = undefined;
			this.formSuccess = false;
		};
	}

	async loadUserData() {
		try {
			this.loggedUser = await this.jwtService.getJwtPayload();
			if (!this.loggedUser) this.logout();
		} catch (error) {
			this.logout();
		}
	}

	async loggedIn() {
		this.formSuccess = true;
		setTimeout(async () => {
			this.loggedUser = await this.jwtService.getJwtPayload();
		}, 500);
		this.chromeMessage('loggedIn');
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
		this.formSuccess = false;
		await this.userService.logout();
		this.chromeMessage('loggedOut');
	}


	render() {
		return html`
		${this.loggedUser && this.loggedUser.email ? html`
		<account-overview @logout=${async () => await this.logout()} .loggedUser=${this.loggedUser}></account-overview>
		` :
				html`
		<bubbles-animation>
			<div class="container ${this.formSuccess ? 'form-success' : ''}">
			<div class="tabs">
			<button @click=${() => this.activeTab = 'signIn'} class="${this.activeTab === 'signIn' ? 'active' : ''}">Sign in</button>
			<button @click=${() => this.activeTab = 'signUp'} class="${this.activeTab === 'signUp' ? 'active' : ''}">Sign up</button>
			</div>
			<h1>Welcome</h1>
			${!this.formSuccess ? html`
			${this.activeTab === 'signIn' ? html`
					<!-- Sign in View -->
					<sign-in @loggedIn=${async () => await this.loggedIn()}></sign-in>
` : html`
<!-- Sign Up view -->
<sign-up @registered=${async () => await this.loggedIn()}></sign-up>

`}
				` : ''}
			</div>
		</bubbles-animation>
	`}
  `
	}
}