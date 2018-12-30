import {By as wdBy, ByHash, WebDriver, WebElement} from 'selenium-webdriver';

/**
 * Selenium webdriver's location strategy.
 */
export type WebDriverLocator = wdBy | ByHash | Function;

/**
 * Protractor's location strategy.
 */
export interface ProtractorLocator {
  findElementsOverride:
      (driver: WebDriver, using: WebElement,
       rootSelector: string) => Promise<WebElement[]>;
  row?: (index: number) => Locator;
  column?: (index: string) => Locator;
  toString?: () => string;
}
export type Locator = ProtractorLocator | WebDriverLocator;

/**
 * Returns if the locator is a Protractor locator
 * @param locator a locator that is either a Protractor or WebDriver Locator
 */
export function isProtractorLocator(
    locator: Locator): locator is ProtractorLocator {
  const typeFindElementsOverride = typeof(locator as any).findElementsOverride;
  return locator && (typeFindElementsOverride === 'function');
}