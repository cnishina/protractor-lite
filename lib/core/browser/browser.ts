import {Session, WebDriver} from 'selenium-webdriver';
import {Executor, HttpClient} from 'selenium-webdriver/http';
import {BrowserConfig} from './browser_config';
import {wait} from '../wait';

export class Browser {
  driver: WebDriver;
  session: Session;

  constructor(
      public browserConfig?: BrowserConfig,
      public defaultWaitStrategy?: string) {
    const httpClient = new HttpClient(this.browserConfig.seleniumAddress);
    const executor = new Executor(httpClient);
    const session = new Session(this.browserConfig.seleniumSessionId, null);
    this.driver = new WebDriver(session, executor);
  }

  /**
   * Navigates to the url.
   * @param url
   * @param waitStrategy Try to execute this wait function.
   */
  async get(url: string, waitStrategy?: string): Promise<void> {
    await wait(this.defaultWaitStrategy, waitStrategy);
    await this.driver.get(url);
  }

  /**
   * Get the current url string (includes the http protocol).
   * @param waitStrategy Try to execute this wait function.
   */
  async getCurrentUrl(waitStrategy?: string): Promise<string> {
    await wait(this.defaultWaitStrategy, waitStrategy);
    let currentUrl = await this.driver.getCurrentUrl();
    return currentUrl;
  }

  /**
   * Gets the title value.
   * @param waitStrategy Try to execute this wait function.
   */
  async getTitle(waitStrategy?: string): Promise<string> {
    await wait(this.defaultWaitStrategy, waitStrategy);
    let title = await this.driver.getTitle();
    return title;
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this.driver.quit();
  }
}