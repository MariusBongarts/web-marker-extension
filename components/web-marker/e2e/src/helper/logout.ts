import { WebElement, Builder, Browser, WebDriver, By, until, logging } from 'selenium-webdriver';
import { getShadowRoot } from './getShadowRoot';
import { ElementFinder } from './ElementFinder';

export async function logout(appRoot: WebElement, driver: WebDriver) {
  const paperAvatar = await ElementFinder.findPaperAvatar(appRoot);

  await paperAvatar.click();

  const avatarSelectElement = await ElementFinder.findAvatarSelect(appRoot);

  const logoutBtn = await (await getShadowRoot(avatarSelectElement)).findElement(
    By.id('logout'));

  await logoutBtn.click();
  await driver.wait(until.urlContains('sign-in'));
  await driver.sleep(500);
}
