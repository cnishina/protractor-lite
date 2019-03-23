import { Browser } from './browser';
import { SeleniumConfig } from '../../utils/selenium_config';
import { Options, Session, WebDriver } from 'selenium-webdriver';
import { Executor } from 'selenium-webdriver/http';


class MockOption extends Options {
  async addCookie(): Promise<void> {}
  async deleteCookie(_: string): Promise<void> {}
  async getCookies(): Promise<any> {}
}

class Driver extends WebDriver {
  constructor(session: Session = null, executor: Executor = null) {
    super(session, executor);
  }
  async close(): Promise<void> {}
  async executeScript(_: string|Function, ...args: any[]): Promise<any> {}
  async get(_: string): Promise<void> {}
  async getAllWindowHandles(): Promise<any> {}
  async getCapabilities(): Promise<any> {}
  async getCurrentUrl(): Promise<any> {}
  manage(): MockOption {
    return new MockOption(null);
  }
}

export class MockBrowser extends Browser {
  constructor(_: SeleniumConfig = null) {
    super(null);
    this._driver = new Driver(null, null);
  }
}