import {ProtractorLocator} from './locator';
import {By, WebDriver, WebElement} from 'selenium-webdriver';
import * as clientSideScripts from '../client_side/finders';

export class ProtractorBy {
  /**
   * Find a button by text.
   * @param {string} searchText
   * @returns {ProtractorLocator} location strategy
   */
  buttonText(searchText: string): ProtractorLocator {
    return {
      findElementsOverride: async (driver: WebDriver, using: WebElement,
          rootSelector: string): Promise<WebElement[]> => {
        let webElements = await driver.findElements(
          By.js(clientSideScripts.findByButtonText, searchText,
            using, rootSelector));
        return webElements;
      },
      toString: (): string => {
        return 'by.buttonText("' + searchText + '")';
      }
    };
  };

}