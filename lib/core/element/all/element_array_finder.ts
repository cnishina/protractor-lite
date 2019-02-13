import { WebDriver, WebElement } from 'selenium-webdriver';
import { Browser } from '../../browser';
import { GetWebElements } from '../get_web_elements';
import { isProtractorLocator, Locator } from '../../by/locator';

export function elementArrayFinderFactory(
    driver: WebDriver|WebElement,
    locator: Locator): ElementArrayFinder {
  let getWebElements: GetWebElements = async (): Promise<WebElement[]> => {
    if (isProtractorLocator(locator)) {
      return locator.findElementsOverride(driver, null);
    } else {
      return driver.findElements(locator);
    }
  }
  return new ElementArrayFinder(driver, locator, getWebElements);
}

export class ElementArrayFinder {
  constructor(
    private _driver: WebDriver|WebElement,
    private _locator: Locator,
    public getWebElements: GetWebElements) {
  }

  /**
   * Gets the parent driver.
   * @return The WebDriver parent object.
   */
  async getDriver(): Promise<WebDriver> {
    const webElements = await this.getWebElements();
    return webElements[0].getDriver();
  }

  /**
   * Gets the locator strategy.
   * @return The locator object.
   */
  get locator(): Locator {
    return this._locator;
  }
}
