import {promise, WebElement} from 'selenium-webdriver';
import {Browser} from '../../browser';
import {GetWebElements} from '../get_web_elements';
import {isProtractorLocator, Locator} from '../../by/locator';

export function elementArrayFinderFactory(
    browser: Browser,
    locator: Locator): ElementArrayFinder {
  let getWebElements: GetWebElements = (): promise.Promise<WebElement[]> => {
    if (isProtractorLocator(locator)) {
      return locator.findElementsOverride(browser.driver, null);
    } else {
      return browser.driver.findElements(locator);
    }
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
