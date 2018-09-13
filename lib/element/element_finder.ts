import {promise, WebElement} from 'selenium-webdriver';
import {Browser} from '../browser';
import {GetWebElements} from './index';
import {isProtractorLocator, Locator} from '../by/locator';
import {wait} from '../wait';

export function elementFinderFactory(
    browser: Browser,
    locator: Locator): ElementFinder {
  let getWebElements: GetWebElements = (): promise.Promise<WebElement[]> => {
    if (isProtractorLocator(locator)) {
      return locator.findElementsOverride(browser.driver, null, browser.rootEl);
    } else {
      return browser.driver.findElements(locator);
    }
  }
  return new ElementFinder(browser, locator, getWebElements);
}

export class ElementFinder {

  constructor(
    public browser: Browser,
    public locator: Locator,
    public getWebElements: GetWebElements) {
  }

  /**
   * Clicks on a web element.
   * @param waitStrategy
   */
  async click(waitStrategy?: string): Promise<void> {
    await wait(this.browser.defaultWaitStrategy, waitStrategy);
    let webElements = await this.getWebElements();
    await webElements[0].click();
  }

  /**
   * Send keys to the input field.
   * @param keys
   * @param waitStrategy
   */
  async sendKeys(keys: string|number, waitStrategy?: string): Promise<void> {
    await wait(this.browser.defaultWaitStrategy, waitStrategy);
    let webElements = await this.getWebElements();
    await webElements[0].sendKeys(keys);
  }

  /**
   * Gets the text contents from the html tag.
   * @param waitStrategy
   */
  async getText(waitStrategy?: string): Promise<string> {
    await wait(this.browser.defaultWaitStrategy, waitStrategy);
    let webElements = await this.getWebElements();
    let text = await webElements[0].getText();
    return text;
  }

  /**
   * Gets the value of the provided attribute name.
   * @param attributeName
   * @param waitStrategy
   */
  async getAttribute(
      attributeName: string,
      waitStrategy?: string): Promise<string> {
    await wait(this.browser.defaultWaitStrategy, waitStrategy);
    let webElements = await this.getWebElements();
    let text = await webElements[0].getAttribute(attributeName);
    return text;
  }

}