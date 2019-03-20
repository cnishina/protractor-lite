import { Browser } from './browser';
import { By } from './by';
import { buildElement, Element } from './element';
import { SeleniumConfig } from '../utils/selenium_config';

export { Browser } from './browser';
export { By } from './by';
export { Element, ElementArrayFinder, ElementFinder } from './element';
export { SeleniumConfig } from '../utils/selenium_config';

/**
 * Builds the objects for protractor that use the same selenium browser session.
 * @param seleniumConfig A configuration object with a capabilities property.
 */
export function build(seleniumConfig: SeleniumConfig) {
  const browser = new Browser(seleniumConfig);
  const by = new By();
  const element = buildElement(browser.driver);
  return {
    browser,
    by,
    element
  };
}

export interface Protractor {
  browser: Browser,
  by: By,
  element: Element
}
