import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { UserService } from '../../../services/user.service';

const componentCSS = require('./account-overview.component.scss');

@customElement('account-overview')
class LobbyContainer extends LitElement{
	static styles = css`${unsafeCSS(componentCSS)}`;
	userService = new UserService();

	@property()
	loggedUser: JwtPayload;

	emitLogout() {
		this.dispatchEvent(
			new CustomEvent('logout', {
				bubbles: true
			})
		);
	}


	render() {
		return html`
			<div class="container">
			<div class="header">
			</div>
			<div class="main">
				<p>${this.loggedUser.email}</p>
				<hr class="divider">

				<p><a class="goToPageBtn" href="https://marius96.uber.space/" target="_blank">See all marks</a></p>

				<hr class="divider">
			</div>

			<button class="logoutBtn" @click=${() => this.emitLogout()}>Logout</button>
			</div>

		`
	}

}
