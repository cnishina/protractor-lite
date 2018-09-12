import {promise, WebElement} from 'selenium-webdriver';
import {Browser} from '../browser';
import {GetWebElements} from './index';
import {isProtractorLocator, Locator} from '../locator';

export function elementArrayFinderFactory(
    browser: Browser,
    locator: Locator): ElementArrayFinder {
  let getWebElements: GetWebElements = (): promise.Promise<WebElement[]> => {
    if (!isProtractorLocator(locator)) {
      return browser.driver.findElements(locator);
    }
    // TODO(cnishina): when it is a protractor locator, we should do something.
    return null;
  }
  return new ElementArrayFinder(browser, locator, getWebElements);
}

export class ElementArrayFinder {
  constructor(
    public browser: Browser,
    public locator: Locator,
    public getWebElements: GetWebElements) {
  }
}
