import { WebElement, Builder, Browser, WebDriver, By, until, logging } from 'selenium-webdriver';

export async function getShadowRoot(shadowHost: WebElement) {
  const script = 'return arguments[0].shadowRoot';
  return (await shadowHost.getDriver().executeScript(script,
    shadowHost)) as WebElement;
}
