import {Builder, WebDriver, Session} from 'selenium-webdriver';
import {BrowserConfig} from './browser_config';
import {DirectConnect} from './driver_provider';
import {wait} from '../wait';

export class Browser {
  driver: WebDriver;
  session: Session;

  // TODO(cnishina): implement later?
  rootEl: any;

  constructor(
    public browserConfig?: BrowserConfig,
    public defaultWaitStrategy?: string) {
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
   * Start a browser with capabilities using a selenium address.
   */
  async start(): Promise<void> {
    if (this.browserConfig.directConnect) {
      this.driver = DirectConnect.getDriver(this.browserConfig);
    } else {
      // TODO(cnishina): remove this use something from driver_provider
      const builder = new Builder()
        .usingServer(this.browserConfig.seleniumAddress)
        .withCapabilities(this.browserConfig.capabilities);
      this.driver = await builder.build();
    }
    this.session = await this.driver.getSession();
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this.driver.quit();
  }
}