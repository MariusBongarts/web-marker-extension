var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { By } from 'selenium-webdriver';
import { getShadowRoot } from './getShadowRoot';
export function login(username, password, appRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        const signInComponent = yield (yield getShadowRoot(appRoot)).findElement(By.tagName('app-sign-in'));
        const usernameInput = yield (yield getShadowRoot(signInComponent)).findElement(By.id('email'));
        yield usernameInput.sendKeys(username);
        const passwordInput = yield (yield getShadowRoot(signInComponent)).findElement(By.id('password'));
        yield passwordInput.sendKeys(password);
        const loginBtn = yield (yield getShadowRoot(signInComponent)).findElement(By.tagName('button'));
        yield loginBtn.click();
        yield timeout(1000);
    });
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=login.js.map