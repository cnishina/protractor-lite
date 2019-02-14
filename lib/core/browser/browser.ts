import { Session, WebDriver, WebElement } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { BrowserConfig } from './browser_config';
import { Locator } from '../by';
import { ElementFinder, elementFinderFactory } from '../element';
import { ActionOptions, runAction } from '../utils';

const ACTION_OPTIONS: ActionOptions = {
  retries: 1
};

export class Browser {
  private _driver: WebDriver;
  private _session: Session;

  constructor(private _browserConfig?: BrowserConfig) {
    const httpClient = new HttpClient(this._browserConfig.seleniumAddress);
    const executor = new Executor(httpClient);
    this._session = new Session(this._browserConfig.seleniumSessionId, null);
    this._driver = new WebDriver(this._session, executor);
  }

  /**
   * Executes the script and returns the result as T.
   * @param func The function represented as a string or a function.
   * @param args Arguments for the func.
   * @return A promise to the value T.
   */
  async execute<T>(func: string|Function, ...args: any[]): Promise<T> {
    return await this._driver.executeScript(func, args) as T;
  }

  /**
   * Navigates to the url.
   * @param url
   * @param actionOptions Optional options for retries and functionHooks.
   */
  async get(url: string,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<void> {
    const action = async (): Promise<void> => {
      await this._driver.get(url);
    };
    return runAction(action, actionOptions, this._driver);
  }

  /**
   * Returns the WebDriver running the session.
   * @return The WebDriver object.
   */
  get driver(): WebDriver {
    return this._driver;
  }

  /**
   * Get the current url string (includes the http protocol).
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the current url.
   */
  async getCurrentUrl(
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this._driver.getCurrentUrl();
    };
    return runAction(action, actionOptions, this._driver);
  }

  /**
   * Gets the title value.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the title.
   */
  async getTitle(
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this._driver.getTitle();
    };
    return runAction(action, actionOptions, this._driver);
  }

  /**
   * Checks to see if the element is present.
   * @param locatorOrElement The web element, locator, or element finder.
   * @return A promised boolean. True if the element is present.
   */
  async isElementPresent(locatorOrElement: Locator|WebElement|ElementFinder
      ): Promise<boolean> {
    let elementFinder: ElementFinder;
    if (locatorOrElement instanceof ElementFinder) {
      elementFinder = locatorOrElement;
    } else if (locatorOrElement instanceof WebElement) {
      elementFinder = await ElementFinder.fromWebElement(
        this._driver, locatorOrElement);
    } else {
      elementFinder = elementFinderFactory(this.driver, locatorOrElement);
    }
    return elementFinder.isPresent();
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this._driver.quit();
  }
}