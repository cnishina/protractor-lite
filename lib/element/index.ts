import {Browser} from '../browser';
import {ElementArrayFinder, elementArrayFinderFactory} from './all';
import {ElementFinder, elementFinderFactory} from './element_finder';
import {Locator} from '../by/locator';

/**
 * The ElementHelper interface allows to create the factory functions:
 *   element(locator) => ElementFinder
 *   element.all(locator) => ElementArrayFinder
 */
export interface ElementHelper extends Function {
  /**
   * A factory to create new ElementFinder based on the locator.
   * @returns A new ElementFinder
   */
  (locator: Locator): ElementFinder;
  /**
   * A factory to create new ElementArrayFinder based on the locator.
   * @returns A new ElementArrayFinder
   */
  all?: (locator: Locator) => ElementArrayFinder;
}

/**
 * Build the helper 'element' function for a given browser instance.
 * @param browser A browser instance.
 * @returns ElementHelper functions
 */
export function buildElementHelper(browser: Browser): ElementHelper {
  let element: ElementHelper = (locator: Locator): ElementFinder => {
    return elementFinderFactory(browser, locator);
  }
  element['all'] = (locator: Locator): ElementArrayFinder => {
    return elementArrayFinderFactory(browser, locator);
  }
  return element;
}