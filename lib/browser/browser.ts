import {Builder, WebDriver, Session} from 'selenium-webdriver';
import {wait} from '../wait';

export class Browser {
  seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
  driver: WebDriver;
  session: Session;

  // TODO(cnishina): implement later?
  rootEl: any;

  constructor(
    public capabilities: Object,
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
    const builder = new Builder()
      .usingServer(this.seleniumAddress)
      .withCapabilities(this.capabilities);
    this.driver = await builder.build();
    this.session = await this.driver.getSession();
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this.driver.quit();
  }
}