var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Builder, Browser, By } from 'selenium-webdriver';
describe('app', () => __awaiter(void 0, void 0, void 0, function* () {
    let driver;
    let broncoButton;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        driver = yield new Builder().forBrowser(Browser.CHROME).build();
        yield driver.get('http://localhost:8080');
        broncoButton = yield driver.findElement(By.tagName('bronco-button'));
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield driver.quit();
    }));
    it('should find title element', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(broncoButton).toBeTruthy();
    }), 3000);
}));
//# sourceMappingURL=app.e2e-spec.js.map