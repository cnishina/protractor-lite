import { WebDriver, WebElement } from 'selenium-webdriver';
import { ElementFinder, elementFinderFactory } from './element_finder';
import { ElementArrayFinder, elementArrayFinderFactory } from './all';
import { Locator } from '../by/locator';

export { ElementFinder } from './element_finder';
export { ElementArrayFinder } from './all';

/**
 * The ElementHelper interface allows to create the factory functions:
 *   element(locator) => ElementFinder
 *   element.all(locator) => ElementArrayFinder
 */
export interface ElementHelper extends Function {
  /**
   * A factory to create new ElementFinder based on the locator.
   * @return A new ElementFinder
   */
  (locator: Locator): ElementFinder;
  /**
   * A factory to create new ElementArrayFinder based on the locator.
   * @return A new ElementArrayFinder
   */
  all?: (locator: Locator) => ElementArrayFinder;
}

/**
 * Build the helper 'element' function for a given browser instance.
 * @param driver A WebDriver or WebElement instance.
 * @return ElementHelper functions
 */
export function buildElementHelper(
    driver: WebDriver|WebElement): ElementHelper {
  let element: ElementHelper = (locator: Locator): ElementFinder => {
    return elementFinderFactory(driver, locator);
  }
  element['all'] = (locator: Locator): ElementArrayFinder => {
    return elementArrayFinderFactory(driver, locator);
  }
  return element;
}