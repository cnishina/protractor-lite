import { Browser, BrowserConfig } from './browser';
import { By } from './by';
import { buildElement, Element } from './element';

export { Browser, BrowserConfig } from './browser';
export { By } from './by';
export { Element, ElementArrayFinder, ElementFinder } from './element';

/**
 * Builds the objects for protractor that use the same selenium browser session.
 * @param config A configuration object with a capabilities property.
 */
export function build(config: BrowserConfig): Protractor {
  const browser = new Browser(config);
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

