import { WebMarker } from './components/web-marker/src/components/app.component';
import { PopUpComponent } from './components/web-marker/src/components/pop-up/app.component';
const marker = document.createElement("web-marker") as WebMarker;
document.body.appendChild(marker);

const popup = document.createElement("pop-up") as PopUpComponent;
document.body.appendChild(popup);


// Listens for messages from background script
chrome.runtime.onMessage.addListener(async (request) => {
  closePopupOnOutsideClick();
  // Show or hides the popup component
  if (request.id === 'togglePopup') {
    popup.showAccountPopup ? popup.showAccountPopup = false : popup.showAccountPopup = true;
  };

  if (request.id === 'contextMenu') {
    marker.newContextMark = request.detail;
  };
});


function closePopupOnOutsideClick() {
  document.body.onclick = (e) => {
    if (e.target !== popup) {
      try {
        // document.body.onclick = undefined;
        // popup.remove();
        popup.showAccountPopup = false;
      } catch (error) {

      }
    }
  }
}
