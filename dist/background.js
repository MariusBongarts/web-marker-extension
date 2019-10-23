//+++++++++++++++++++++++
//+++++++++++++++++++++++
//+++++++++++++++++++++++
// START INTERFACES START
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// END INTERFACES
//+++++++++++++++++++++++
//+++++++++++++++++++++++
//+++++++++++++++++++++++
window.marks = [];
//+++++++++++++++++++++++
//+++++++++++++++++++++++
//+++++++++++++++++++++++
// START CHROME STUFF
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.marks.push(request.selection);
    sendResponse(window.marks);
});
// Sends message to current contentScript when page changes
chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const marks = window.marks.filter(mark => mark.url === tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, {
            id: 'init',
            marks: marks
        });
    });
});
chrome.runtime.onInstalled.addListener(function () {
    // chrome.storage.sync.set({jwt_key: 'mySecretKey'});
    chrome.contextMenus.create({
        id: "selection",
        title: "Save: ' %s '",
        contexts: ["selection"]
    });
    // Listen for context menu to create mark
    chrome.contextMenus.onClicked.addListener((e) => __awaiter(this, void 0, void 0, function* () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                id: 'contextMenu',
                detail: e.selectionText
            });
        });
    }));
});
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            id: 'togglePopup',
        });
    });
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
    }
});
// Sends message to current contentScript when context menu is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            id: 'create'
        });
    });
});
// END CHROME STUFF
//+++++++++++++++++++++++
//+++++++++++++++++++++++
//+++++++++++++++++++++++
//   window.marks.push(mark);
//   // Sends message to current contentScript
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const marks = window.marks;
//     chrome.tabs.sendMessage(tabs[0].id, {
//       marks
//     });
//   });
// });
//# sourceMappingURL=background.js.map