import { WebDriver, WebElement } from 'selenium-webdriver';
import { GetWebElements } from '../get_web_elements';
import { ElementFinder } from '../element_finder';
import { isProtractorLocator, Locator } from '../../by/locator';

export function elementArrayFinderFactory(
    driver: WebDriver|WebElement|Promise<WebDriver|WebElement>,
    locator: Locator): ElementArrayFinder {
  let getWebElements: GetWebElements = async (): Promise<WebElement[]> => {
    const awaitedDriver = await driver;
    if (isProtractorLocator(locator)) {
      return locator.findElementsOverride(awaitedDriver, null);
    } else {
      return await awaitedDriver.findElements(locator);
    }
  }
  return new ElementArrayFinder(driver, locator, getWebElements);
}

export class ElementArrayFinder {
  constructor(
    private _driver: WebDriver|WebElement|Promise<WebDriver|WebElement>,
    private _locator: Locator,
    private _getWebElements: GetWebElements) {
  }

  /**
   * Gets the parent driver.
   * @return The WebDriver parent object.
   */
  async getDriver(): Promise<WebDriver> {
    const webElements = await this._getWebElements();
    return webElements[0].getDriver();
  }

  /**
   * Gets all the web elements from all of these web elements.
   * @param locator The locator object.
   * @return An element array finder object.
   */
  all(locator: Locator): ElementArrayFinder {
    let getWebElements: GetWebElements = async (): Promise<WebElement[]> => {
      const webElements = await this._getWebElements();
      let allEls = [];
      for (let webEl of webElements) {
        if (isProtractorLocator(locator)) {
          return locator.findElementsOverride(webEl, null);
        } else {
          allEls.concat(await webEl.findElements(locator));
        }
      }
      return allEls;
    }
    return new ElementArrayFinder(this._driver, locator, getWebElements);
  }

  /**
   * Gets the locator strategy.
   * @return The locator object.
   */
  get locator(): Locator {
    return this._locator;
  }

  /**
   * Gets the web element array.
   * @return A promise of web elements.
   */
  async getWebElements(): Promise<WebElement[]> {
    return this._getWebElements();
  }

  /**
   * Gets the element finder array.
   * @return A promise of element finders.
   */
  async getElementFinders(): Promise<ElementFinder[]> {
    const arr = await this.getWebElements();
    return Promise.all(arr.map((webElem: WebElement) => {
      return ElementFinder.fromWebElement(webElem, this.locator);
    }));
  }
}