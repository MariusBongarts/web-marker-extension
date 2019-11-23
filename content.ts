import { WebMarker } from './components/web-marker/src/components/app.component';
import { PopUpComponent } from './components/web-marker/src/components/pop-up/app.component';

const marker = document.createElement("web-marker") as WebMarker;
document.body.appendChild(marker);

const popup = document.createElement("pop-up") as PopUpComponent;
document.body.appendChild(popup);

// Listens for messages from popup in browser action
chrome.runtime.onMessage.addListener(async (request) => {

  if (request.id === 'loggedIn') {
    await popup.loadUserData();
  };

  if (request.id === 'loggedOut') {
    await popup.logout();
  };

});

