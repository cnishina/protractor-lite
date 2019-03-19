import { Session, WebDriver, WebElement } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { SeleniumConfig } from '../../utils/selenium_config';
import { Locator } from '../by';
import { ElementFinder, elementFinderFactory } from '../element/element_finder';
import * as taskHelpers from '../utils/task_helpers';
import { Capabilities, Cookie, runAction, SharedResults, sharedResultsInit, TaskOptions, taskOptionsInit } from '../utils';
import { getDriver } from '../../utils/webdriver';

export class Browser {
  protected _driver: WebDriver;
  protected _session: Session;
  protected _taskOptions: TaskOptions;
  protected _sharedResults: SharedResults;

  constructor(protected _seleniumConfig?: SeleniumConfig) {
    this._driver = getDriver(this._seleniumConfig);
  }

  /**
   * Adds a cookie.
   * @param cookie The cookie interface.
   * @return A promise when completed.
   */
  async addCookie(cookie: Cookie): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    if (this._taskOptions.useDefaults) {
      this._taskOptions.tasks.before.local.push(taskHelpers.beforeCookies);
      this._taskOptions.tasks.after.local.push(taskHelpers.afterCookies);
    }

    const action = async () => {
      await this._driver.manage().addCookie(cookie);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Closes the current window.
   * @return A promise when completed.
   */
  async close(): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      await this._driver.close();
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Deletes the cookie with the given name. This command is a no-op if there is
   * no cookie with the given name visible to the current page.
   * @param name The name of the cookie to delete.
   * @return A promise when completed.
   */
  async deleteCookie(name: string): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    if (this._taskOptions.useDefaults) {
      this._taskOptions.tasks.before.local.push(taskHelpers.beforeCookies);
      this._taskOptions.tasks.after.local.push(taskHelpers.afterCookies);
    }

    const action = async () => {
      await this._driver.manage().deleteCookie(name);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
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
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      return await this._driver.executeScript(func, args) as T;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Navigates to the url.
   * @param url
   * @return A promise when completed.
   */
  async get(url: string): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeUrl);
      tasks.after.local.push(taskHelpers.afterUrl);
      tasks.after.local.push(taskHelpers.afterPageSource);
      tasks.after.local.push(taskHelpers.afterDocumentReadyState);
    }

    const action = async (): Promise<void> => {
      this._sharedResults.url = url;
      await this._driver.get(url);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Retrieves all cookies visible to the current page.
   * @return A promise with the cookies visible to the current session.
   */
  async getAllCookies(): Promise<Cookie[]|null> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      const cookies = await this._driver.manage().getCookies() as Cookie[];
      return cookies;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Retrieves a list of all available window handles.
   * @return A promise to the array of window handles.
   */
  async getAllWindowHandles(): Promise<string[]> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<string[]> => {
      const handles = await this._driver.getAllWindowHandles();
      return handles;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Gets the capabilities.
   * @return A promise to this session's capabilities.
   */
  async getCapabilities(): Promise<Capabilities> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<Capabilities> => {
      const capabilities = await this._driver.getCapabilities();
      return capabilities as Capabilities;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Get the current url string (includes the http protocol).
   * @return A promise to the current url.
   */
  async getCurrentUrl(): Promise<string> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<string> => {
      const currentUrl = await this._driver.getCurrentUrl();
      return currentUrl;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Retrieves the current page's source. The returned souce is a representation
   * of the underlying DOM.
   * @return A promise to the current page source.
   */
  async getPageSource(): Promise<string> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<string> => {
      const pageSource = await this._driver.getPageSource();
      return pageSource;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  get sharedResults(): SharedResults {
    return this._sharedResults;
  }

  /**
   * Gets the title value.
   * @return A promise to the title.
   */
  async getTitle(): Promise<string> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<string> => {
      return await this._driver.getTitle();
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Retrieves the current window handle.
   * @return A promise to the current window handle.
   */
  async getWindowHandle(): Promise<string> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async (): Promise<string> => {
      const handle = await this._driver.getWindowHandle();
      return handle;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
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
   * @return A promise when completed.
   */
  async navigateBack(): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeUrl);
      tasks.after.local.push(taskHelpers.afterUrl);
      tasks.after.local.push(taskHelpers.afterPageSource);
      tasks.after.local.push(taskHelpers.afterDocumentReadyState);
    }
    const action = async () => {
      await this._driver.navigate().back();
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Moves forwards in the browser history.
   * @return A promise when completed.
   */
  async navigateForward(): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();

    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeUrl);
      tasks.after.local.push(taskHelpers.afterUrl);
      tasks.after.local.push(taskHelpers.afterPageSource);
      tasks.after.local.push(taskHelpers.afterDocumentReadyState);
    }
    const action = async () => {
      await this._driver.navigate().forward();
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Navigates to a new URL.
   * @param url The URL to navigate to.
   * @return A promise when completed.
   */
  async navigateTo(url: string): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeUrl);
      tasks.after.local.push(taskHelpers.afterUrl);
      tasks.after.local.push(taskHelpers.afterPageSource);
      tasks.after.local.push(taskHelpers.afterDocumentReadyState);
    }
    const action = async () => {
      this._sharedResults.url = url;
      await this._driver.navigate().to(url);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Quits this browser session.
   * @return A promise when completed.
   */
  async quit(): Promise<void> {
    await this._driver.quit();
  }

  /**
   * Refreshes the current page.
   * @return A promise when completed.
   */
  async refresh(): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      await this._driver.navigate().refresh();
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Makes the driver sleep for the given amount of time.
   * @param milliseconds The amount of time, in milliseconds, to sleep.
   * @return A promise when completed.
   */
  async sleep(milliseconds: number): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      await this._driver.sleep(milliseconds);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Changes the focus of all future commands to another frame on the page. The
   * target frame may be specified as one of the following iframe or frame.
   * @param nameOrIndex The frame locator
   * @return A promise when completed.
   */
  async switchToFrame(nameOrIndex: number|WebElement): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeActiveWebElementId);
      tasks.after.local.push(taskHelpers.afterActiveWebElementId);
    }
    const action = async () => {
      await this._driver.switchTo().frame(nameOrIndex);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Changes the focus of all future commands to the parent frame of the
   * currently selected frame. This command has no effect if the driver is
   * already focused on the top-level browsing context.
   * @return A promise when completed.
   */
  async switchToParent(): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeActiveWebElementId);
      tasks.after.local.push(taskHelpers.afterActiveWebElementId);
    }
    const action = async () => {
      // TODO(cnishina): fix when parent frame is supported.
      await (this._driver.switchTo() as any).parentFrame();
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Changes the focus of all future commands to another window.
   * @param nameOrHandle The name or window handle to switch focus to.
   * @return A promise when completed.
   */
  async switchToWindow(nameOrHandle: string): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    if (this._taskOptions.useDefaults) {
      let tasks = this._taskOptions.tasks;
      tasks.before.local.push(taskHelpers.beforeWindowHandle);
      tasks.after.local.push(taskHelpers.afterWindowHandle);
    }
    const action = async () => {
      await this._driver.switchTo().window(nameOrHandle);
    };
    await runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }

  /**
   * Take a screenshot of the visible region encompassed by this element's
   * bounding rectangle.
   * @param scroll Optional argument that indicates whether the element should
   *   be scrolled into view before taking a screenshot.
   * @return The screenshot as a base-64 encoded PNG.
   */
  async takeScreenshot(scroll = false): Promise<string> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      // TODO(cnishina): fix when screenshot scroll is supported.
      const content = await (this._driver as any).takeScreenshot(scroll);
      return content;
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }
  
  /**
   * Waits for a condition to evaluate to a "truthy" value.
   * @param condition Function that returns a boolean or promise boolean.
   * @param timeoutMilliseconds Timeout for the condition.
   * @param message Optional message.
   */
  async wait(condition: () => boolean|Promise<boolean>,
      timeoutMilliseconds: number, message?: string,
      pollMilliseconds?: number): Promise<void> {
    this._sharedResults = sharedResultsInit();
    this._taskOptions = taskOptionsInit();
    const action = async () => {
      // TODO(cnishina): fix when wait takes 4 parameters.
      await (this._driver as any).wait(condition, timeoutMilliseconds,
          message, pollMilliseconds);
    };
    return runAction(action, this._taskOptions,
      this._sharedResults, this._driver);
  }
}