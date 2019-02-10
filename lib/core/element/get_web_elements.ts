import {WebElement} from 'selenium-webdriver';

/**
 * The interface for the GetWebElements method.
 */
export interface GetWebElements extends Function {
  /**
   * @returns promise for the web element array.
   */
  (): Promise<WebElement[]>;
}