import { Session, WebDriver } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { BrowserConfig } from './browser_config';
import { ActionOptions, runAction } from '../utils';

const ACTION_OPTIONS: ActionOptions = {
  retries: 1
};

export class Browser {
  driver: WebDriver;
  session: Session;

  constructor(public browserConfig?: BrowserConfig) {
    const httpClient = new HttpClient(this.browserConfig.seleniumAddress);
    const executor = new Executor(httpClient);
    const session = new Session(this.browserConfig.seleniumSessionId, null);
    this.driver = new WebDriver(session, executor);
  }

  async execute(func: string|Function): Promise<void> {

  }

  /**
   * Navigates to the url.
   * @param url
   * @param actionOptions Optional options for retries and functionHooks.
   */
  async get(url: string,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<void> {
    const action = async (): Promise<void> => {
      await this.driver.get(url);
    };
    return runAction(action, actionOptions, this);
  }

  /**
   * Get the current url string (includes the http protocol).
   * @param actionOptions Optional options for retries and functionHooks.
   */
  async getCurrentUrl(
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this.driver.getCurrentUrl();
    };
    return runAction(action, actionOptions, this);
  }

  /**
   * Gets the title value.
   * @param actionOptions Optional options for retries and functionHooks.
   */
  async getTitle(
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      return await this.driver.getTitle();
    };
    return runAction(action, actionOptions, this);
  }

  /**
   * Quits this browser session.
   */
  async quit(): Promise<void> {
    await this.driver.quit();
  }
}