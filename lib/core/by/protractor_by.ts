import { ProtractorLocator } from './locator';
import { WebDriverBy } from './webdriver_by';
import { By, WebDriver, WebElement } from 'selenium-webdriver';

const findBy = require('../client_side/finders');

export class ProtractorBy extends WebDriverBy {
  /**
   * Find a button by text.
   * @param searchText
   * @return location strategy
   */
  buttonText(searchText: string): ProtractorLocator {
    return {
      findElementsOverride: async (driver: WebDriver,
          using: WebElement): Promise<WebElement[]> => {
        let webElements = await driver.findElements(
          By.js(findBy.buttonText, searchText, using));
        return webElements;
      },
      toString: (): string => {
        return `by.buttonText("${searchText}")`;
      }
    };
  }

  /**
   * Find elements by CSS which contain a certain string.
   * @param cssSelector css selector
   * @param searchString text search
   * @returns location strategy
   */
  cssContainingText(cssSelector: string, searchText: string|RegExp
      ): ProtractorLocator {
    searchText = (searchText instanceof RegExp) ?
        '__REGEXP__' + searchText.toString() : searchText;
    return {
      findElementsOverride: async (driver: WebDriver, using: WebElement):
                                Promise<WebElement[]> => {
        let webElements = await driver.findElements(By.js(
          findBy.cssContainingText, cssSelector, searchText,
            using));
        return webElements;
      },
      toString: (): string => {
        return `by.cssContainingText("${cssSelector}", "${searchText}")`;
      }
    };
  }

  /**
   * Find an element by css selector within the Shadow DOM.
   * @param {string} selector a css selector within the Shadow DOM.
   * @returns {Locator} location strategy
   */
  deepCss(selector: string): ProtractorLocator {
    // TODO: syntax will change from /deep/ to >>> at some point.
    // When that is supported, switch it here.
    return {
      findElementsOverride: async (driver: WebDriver,
          _: WebElement): Promise<WebElement[]> => {
        const webElements = await driver.findElements(
          By.css('* /deep/ ' + selector));
        return webElements;
      },
      toString: (): string => {
        return `by.css("* /deep/ ${selector}")`;
      }
    };
  }

  /**
   * Find a button by partial text.
   * @param searchText
   * @return location strategy
   */
  partialButtonText(searchText: string): ProtractorLocator {
    return {
      findElementsOverride: async (driver: WebDriver,
        using: WebElement): Promise<WebElement[]> => {
        return driver.findElements(
            By.js(findBy.partialButtonText,
              searchText, using));
      },
      toString: (): string => {
        return `by.partialButtonText("${searchText}")`;
      }
    };
  }
}