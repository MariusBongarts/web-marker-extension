import { environment } from './../../../environments/environment.dev';
import { connect } from 'pwa-helpers';
import { store } from './../../../store/store';
import { JwtPayload } from './../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { UserService } from '../../../services/user.service';
import { navigateExternal } from '../../../helper/router';

const componentCSS = require('./account-overview.component.scss');

@customElement('account-overview')
class LobbyContainer extends connect(store)(LitElement) {
	static styles = css`${unsafeCSS(componentCSS)}`;
	userService = new UserService();

	@property()
	marksLength = 0;
	@property()
	bookmarksLength = 0;
	@property()
	tagsLength = 0;

	@property()
	loggedUser: JwtPayload;

	emitLogout() {
		this.dispatchEvent(
			new CustomEvent('logout', {
				bubbles: true
			})
		);
	}

	stateChanged() {
		this.marksLength = store.getState().marks.length;
		this.bookmarksLength = store.getState().bookmarks.length;
		this.tagsLength = store.getState().tags.length;
	}


	render() {
		return html`
<div class="container">
	<div class="entry">
		<div class="stat">
		<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 544 512"><path d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"/></svg>
			${this.marksLength}
	</div>
	<div  class="stat">
	<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-bookmark">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
			${this.bookmarksLength}
	</div>
	<div  class="stat"  style="margin-top: 2px">
	<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tags" class="svg-inline--fa fa-tags fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path></svg>
			${this.tagsLength}
	</div>
	</div>

	<div class="entry">
		<div>
			E-Mail
		</div>
		<div>
			${this.loggedUser.email}
		</div>
	</div>

	<div class="entry">
		<div>
			My account
		</div>
		<div>
			<button class="goToPageBtn"  @click=${() => navigateExternal(environment.FRONTEND_URL)}>See all marks</button>
		</div>
	</div>

	<div class="entry footer">
		<button class="logoutBtn" @click=${() => this.emitLogout()}>Logout</button>
	</div>

</div>

`
	}

}