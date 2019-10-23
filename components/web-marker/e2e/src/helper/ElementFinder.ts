import { WebElement, By } from 'selenium-webdriver';
import { getShadowRoot } from './getShadowRoot';
export class ElementFinder {

  public static async findPaperAvatar(appRoot: WebElement): Promise<WebElement> {
    const headerElement = await (await getShadowRoot(appRoot)).findElement(
      By.tagName('app-header'));
    const paperAvatarElement = await (await getShadowRoot(headerElement)).findElement(
      By.tagName('paper-avatar'));
    return paperAvatarElement;
  }

  public static async findAvatarSelect(appRoot: WebElement): Promise<WebElement> {
    const headerElement = await (await getShadowRoot(appRoot)).findElement(
      By.tagName('app-header'));
    const avatarSelectElement = await (await getShadowRoot(headerElement)).findElement(
      By.tagName('app-avatar-select'));
    return avatarSelectElement;
  }

}