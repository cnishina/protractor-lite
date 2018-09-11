import {promise, WebElement} from 'selenium-webdriver';
import {Browser} from '../browser';
import {GetWebElements} from './index';
import {isProtractorLocator, Locator} from '../locator';
import {wait} from '../wait';

export class ElementFinder {
  locator: Locator;

  constructor(
    public browser: Browser,
    public getWebElements: GetWebElements = null) {
  }

  static generate(browser: Browser, locator: Locator): ElementFinder {
    let getWebElements: GetWebElements = (): promise.Promise<WebElement[]> => {
      if (!isProtractorLocator(locator)) {
        return browser.driver.findElements(locator);
      }
      return null;
    }
    return new ElementFinder(browser, getWebElements);
  }

  async click(waitStrategy?: string): Promise<void> {
    await wait(this.browser.defaultWaitStrategy, waitStrategy);
    let webElements = await this.getWebElements();
    await webElements[0].click();
  }
}