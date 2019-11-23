var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const marker = document.createElement("web-marker");
document.body.appendChild(marker);
const popup = document.createElement("pop-up");
document.body.appendChild(popup);
// Listens for messages from popup in browser action
chrome.runtime.onMessage.addListener((request) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.id === 'loggedIn') {
        yield popup.loadUserData();
    }
    ;
    if (request.id === 'loggedOut') {
        yield popup.logout();
    }
    ;
}));
//# sourceMappingURL=content.js.map