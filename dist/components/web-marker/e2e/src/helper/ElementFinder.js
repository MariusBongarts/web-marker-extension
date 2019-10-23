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
export class ElementFinder {
    static findPaperAvatar(appRoot) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerElement = yield (yield getShadowRoot(appRoot)).findElement(By.tagName('app-header'));
            const paperAvatarElement = yield (yield getShadowRoot(headerElement)).findElement(By.tagName('paper-avatar'));
            return paperAvatarElement;
        });
    }
    static findAvatarSelect(appRoot) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerElement = yield (yield getShadowRoot(appRoot)).findElement(By.tagName('app-header'));
            const avatarSelectElement = yield (yield getShadowRoot(headerElement)).findElement(By.tagName('app-avatar-select'));
            return avatarSelectElement;
        });
    }
}
//# sourceMappingURL=ElementFinder.js.map