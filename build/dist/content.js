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
// Listens for messages from background script
chrome.runtime.onMessage.addListener((request) => __awaiter(void 0, void 0, void 0, function* () {
    closePopupOnOutsideClick();
    // Show or hides the popup component
    if (request.id === 'togglePopup') {
        popup.showAccountPopup ? popup.showAccountPopup = false : popup.showAccountPopup = true;
    }
    ;
    if (request.id === 'contextMenu') {
        marker.newContextMark = request.detail;
    }
    ;
}));
function closePopupOnOutsideClick() {
    document.body.onclick = (e) => {
        if (e.target !== popup) {
            try {
                // document.body.onclick = undefined;
                // popup.remove();
                popup.showAccountPopup = false;
            }
            catch (error) {
            }
        }
    };
}
//# sourceMappingURL=content.js.map