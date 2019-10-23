import { WebElement, Builder, Browser, WebDriver, By, until, logging } from 'selenium-webdriver';
import { getShadowRoot } from './getShadowRoot';

export async function login(username: string, password: string, appRoot: WebElement) {
  const signInComponent = await (await getShadowRoot(appRoot)).findElement(
    By.tagName('app-sign-in'));

  const usernameInput = await (await getShadowRoot(signInComponent)).findElement(
    By.id('email'));
  await usernameInput.sendKeys(username);
  const passwordInput = await (await getShadowRoot(signInComponent)).findElement(
    By.id('password'));
  await passwordInput.sendKeys(password);
  const loginBtn = await (await getShadowRoot(signInComponent)).findElement(
    By.tagName('button'));
  await loginBtn.click();

  await timeout(1000);
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}