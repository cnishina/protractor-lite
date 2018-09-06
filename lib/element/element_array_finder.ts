import {promise, WebElement} from 'selenium-webdriver';
import {Browser} from '../browser';
import {GetWebElements} from './index';
import {isProtractorLocator, Locator} from '../locator';

export class ElementArrayFinder {
  constructor(
    public browser: Browser,
    public getWebElements: GetWebElements = null) {
  }

  static generate(browser: Browser, locator: Locator): ElementArrayFinder {
    let getWebElements: GetWebElements = (): promise.Promise<WebElement[]> => {
      if (!isProtractorLocator(locator)) {
        return browser.driver.findElements(locator);
      }
      return null;
    }
    return new ElementArrayFinder(browser, getWebElements);
  }

  all(locator: Locator): ElementArrayFinder {
    return ElementArrayFinder.generate(this.browser, locator);
  }
}
