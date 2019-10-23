var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { By, until } from 'selenium-webdriver';
import { getShadowRoot } from './getShadowRoot';
import { ElementFinder } from './ElementFinder';
export function logout(appRoot, driver) {
    return __awaiter(this, void 0, void 0, function* () {
        const paperAvatar = yield ElementFinder.findPaperAvatar(appRoot);
        yield paperAvatar.click();
        const avatarSelectElement = yield ElementFinder.findAvatarSelect(appRoot);
        const logoutBtn = yield (yield getShadowRoot(avatarSelectElement)).findElement(By.id('logout'));
        yield logoutBtn.click();
        yield driver.wait(until.urlContains('sign-in'));
        yield driver.sleep(500);
    });
}
//# sourceMappingURL=logout.js.map