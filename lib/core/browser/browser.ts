import { Session, WebDriver, WebElement } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { BrowserConfig } from './browser_config';
import { Locator } from '../by';
import { ElementFinder, elementFinderFactory } from '../element/element_finder';
import { ActionOptions, Capabilities, Cookie, runAction } from '../utils';

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
   * Adds a cookie.
   * @param cookie The cookie interface.
   */
  async addCookie(cookie: Cookie): Promise<void> {
    this._driver.manage().addCookie(cookie);
  }

  /**
   * Closes the current window.
   */
  async close(): Promise<void> {
    await this._driver.close();
  }

  /**
   * Deletes the cookie with the given name. This command is a no-op if there is
   * no cookie with the given name visible to the current page.
   * @param name The name of the cookie to delete.
   */
  async deleteCookie(name: string) {
    await this._driver.manage().deleteCookie(name);
  }

  /**
   * Returns the WebDriver running the session.
   * @return The WebDriver object.
   */
  get driver(): WebDriver {
    return this._driver;
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
   * Retrieves all cookies visible to the current page.
   * @return A promise with the cookies visible to the current session.
   */
  async getAllCookies(): Promise<Cookie[]|null> {
    const cookies = await this._driver.manage().getCookies() as Cookie[];
    return cookies;
  }

  /**
   * Retrieves a list of all available window handles.
   * @return An array of window handles.
   */
  async getAllWindowHandles(): Promise<string[]> {
    const handles = await this._driver.getAllWindowHandles();
    return handles;
  }

  /**
   * Gets the capabilities.
   * @return A promise that will resolve with the this instance's capabilities.
   */
  async getCapabilities(): Promise<Object> {
    const capabilities = await this._driver.getCapabilities();
    return capabilities as Capabilities;
  }

    /**
   * Retrieves the cookie with the given name. Returns null if there is no such
   * cookie.
   * @param name The name of the cookie to retrieve.
   * @return A promise to the cookie or null.
   */
  async getCookie(name: string): Promise<Cookie|null> {
    const cookie = await this._driver.manage().getCookie(name) as Cookie;
    return cookie;
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
   * Retrieves the current page's source. The returned souce is a representation
   * of the underlying DOM.
   * @return The current page source.
   */
  async getPageSource() {
    const content = await this._driver.getPageSource();
    return content;
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
   * Retrieves the current window handle.
   * @return The current window handle.
   */
  async getWindowHandle(): Promise<string> {
    const handle = await this._driver.getWindowHandle();
    return handle;
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
   * Moves backwards in the browser history.
   */
  async navigateBack(): Promise<void> {
    await this._driver.navigate().back();
  }

  /**
   * Moves forwards in the browser history.
   */
  async navigateForward(): Promise<void> {
    await this._driver.navigate().forward();
  }

  /**
   * Navigates to a new URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this._driver.navigate().to(url);
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this._driver.quit();
  }

  /**
   * Refreshes the current page.
   */
  async refresh(): Promise<void> {
    await this._driver.navigate().refresh();
  }

  /**
   * Makes the driver sleep for the given amount of time.
   * @param milliseconds The amount of time, in milliseconds, to sleep.
   */
  async sleep(milliseconds: number): Promise<void> {
    await this._driver.sleep(milliseconds);
  }

  switchToWindow() {}

  /**
   * Take a screenshot of the visible region encompassed by this element's
   * bounding rectangle.
   * @param scroll Optional argument that indicates whether the element should
   *   be scrolled into view before taking a screenshot.
   * @return The screenshot as a base-64 encoded PNG.
   */
  async takeScreenshot(scroll = false): Promise<string> {
    const content = await this._driver.takeScreenshot();
    return content;
  }
  
  /**
   * Waits for a condition to evaluate to a "truthy" value.
   * @param condition Function that returns a boolean or promise boolean.
   * @param timeoutMilliseconds Timeout for the condition.
   * @param message Optional message.
   */
  async wait(condition: () => boolean|Promise<boolean>,
      timeoutMilliseconds: number, message?: string): Promise<void> {
    await this._driver.wait(condition, timeoutMilliseconds, message);
  }
}