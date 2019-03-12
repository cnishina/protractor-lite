import { Session, WebDriver, WebElement } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { BrowserConfig } from './browser_config';
import { Locator } from '../by';
import { ElementFinder, elementFinderFactory } from '../element/element_finder';
import * as taskHelpers from '../utils/task_helpers';
import { Capabilities, Cookie, runAction, SharedResults, sharedResultsInit, TaskOptions, taskOptionsInit } from '../utils';

const SHARED_RESULTS: SharedResults = { };
const TASK_OPTIONS: TaskOptions = {
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
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   */
  async addCookie(cookie: Cookie, taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);
    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeCookies);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterCookies);
    }

    const action = async () => {
      await this._driver.manage().addCookie(cookie);
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
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
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   */
  async deleteCookie(name: string, taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);
    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeCookies);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterCookies);
    }

    const action = async () => {
      await this._driver.manage().deleteCookie(name);
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
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
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   */
  async get(url: string, taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);

    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeUrl);

      // order: check the document readyState then verify the page source
      taskOptions.tasks.after.local.unshift(taskHelpers.afterUrl);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterPageSource);
      taskOptions.tasks.after.local.unshift(
          taskHelpers.afterDocumentReadyState);
    }

    const action = async (): Promise<void> => {
      sharedResults.url = url;
      await this._driver.get(url);
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
  }

  /**
   * Retrieves all cookies visible to the current page.
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   * @return A promise with the cookies visible to the current session.
   */
  async getAllCookies(taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<Cookie[]|null> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);
    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeCookies);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterCookies);
    }

    const action = async () => {
      const cookies = await this._driver.manage().getCookies() as Cookie[];
      return cookies;
    };
    return runAction(action, taskOptions, sharedResults, this._driver);
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
   * Get the current url string (includes the http protocol).
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   * @return A promise to the current url.
   */
  async getCurrentUrl(
      taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this._driver.getCurrentUrl();
    };
    return runAction(action, taskOptions, sharedResults, this._driver);
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
   * @param taskOptions Optional options for retries and functionHooks.
   * @param sharedResults Optional shared results to help debugging.
   * @return A promise to the title.
   */
  async getTitle(
      taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this._driver.getTitle();
    };
    return runAction(action, taskOptions, sharedResults, this._driver);
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
  async navigateBack(taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);

    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeUrl);

      // order: check the document readyState then verify the page source
      taskOptions.tasks.after.local.unshift(taskHelpers.afterUrl);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterPageSource);
      taskOptions.tasks.after.local.unshift(
          taskHelpers.afterDocumentReadyState);
    }

    const action = async () => {
      await this._driver.navigate().back();
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
  }

  /**
   * Moves forwards in the browser history.
   */
  async navigateForward(taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);

    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeUrl);

      // order: check the document readyState then verify the page source
      taskOptions.tasks.after.local.unshift(taskHelpers.afterUrl);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterPageSource);
      taskOptions.tasks.after.local.unshift(
          taskHelpers.afterDocumentReadyState);
    }

    const action = async () => {
      await this._driver.navigate().forward();
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
  }

  /**
   * Navigates to a new URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string, taskOptions: TaskOptions = TASK_OPTIONS,
      sharedResults: SharedResults = SHARED_RESULTS): Promise<void> {
    sharedResults = sharedResultsInit(sharedResults);
    taskOptions = taskOptionsInit(taskOptions);

    if (taskOptions.useDefaults) {
      taskOptions.tasks.before.local.push(taskHelpers.beforeUrl);

      // order: check the document readyState then verify the page source
      taskOptions.tasks.after.local.unshift(taskHelpers.afterUrl);
      taskOptions.tasks.after.local.unshift(taskHelpers.afterPageSource);
      taskOptions.tasks.after.local.unshift(
          taskHelpers.afterDocumentReadyState);
    }

    const action = async () => {
      sharedResults.url = url;
      await this._driver.navigate().to(url);
    };
    await runAction(action, taskOptions, sharedResults, this._driver);
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

  /**
   * Changes the focus of all future commands to another frame on the page. The
   * target frame may be specified as one of the following iframe or frame.
   * @param nameOrIndex The frame locator
   */
  async switchToFrame(nameOrIndex: number|WebElement): Promise<void> {
    await this._driver.switchTo().frame(nameOrIndex);
  }

  /**
   * Changes the focus of all future commands to the parent frame of the
   * currently selected frame. This command has no effect if the driver is
   * already focused on the top-level browsing context.
   */
  async switchToParent(): Promise<void> {
    // TODO(cnishina): fix when parent frame is supported.
    await (this._driver.switchTo() as any).parentFrame();
  }

  /**
   * Changes the focus of all future commands to another window.
   * @param nameOrHandle The name or window handle to switch focus to.
   */
  async switchToWindow(nameOrHandle: string): Promise<void> {
    await this._driver.switchTo().window(nameOrHandle);
  }

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