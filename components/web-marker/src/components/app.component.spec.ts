import { LitElement } from 'lit-element';
import { WebMarker } from './app.component';
import './app.component';
import { emit } from 'cluster';

describe('bronco-button', () => {
  let element: WebMarker;

  beforeEach(async () => {
    element = document.createElement('bronco-button') as WebMarker;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => { element.remove(); });



});
