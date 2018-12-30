import {Session, WebDriver} from 'selenium-webdriver';
import {BrowserConfig} from './browser_config';
import {DirectConnect, Hosted, Local, Provider} from './driver_provider';
import {wait} from '../wait';

export class Browser {
  driver: WebDriver;
  session: Session;
  provider: Provider;

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
      this.provider = new DirectConnect(this.browserConfig);
    } else if (this.browserConfig.seleniumAddress) {
      this.provider = new Hosted(this.browserConfig);
    } else {
      this.provider = new Local(this.browserConfig);
    }
    this.driver = await this.provider.getDriver();
    this.session = await this.driver.getSession();
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this.driver.quit();
  }

  /**
   * Shuts down the provider.
   */
  async shutdown(): Promise<void> {
    await this.provider.quitDriver();
  }
}