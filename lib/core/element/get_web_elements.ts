import {WebElement} from 'selenium-webdriver';

/**
 * The interface for the GetWebElements method.
 */
export interface GetWebElements extends Function {
  /**
   * @return promise for the web element array.
   */
  (): Promise<WebElement[]>;
}