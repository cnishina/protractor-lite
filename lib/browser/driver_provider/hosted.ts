import {BrowserConfig} from '../browser_config';
import {Builder, WebDriver} from 'selenium-webdriver';
import {Provider} from './provider';

export class Hosted implements Provider {
  constructor(public browserConfig: BrowserConfig) {}

  /**
   * Gets the driver generated when the selenium address is available.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    const builder = new Builder()
      .usingServer(this.browserConfig.seleniumAddress)
      .withCapabilities(this.browserConfig.capabilities);
    return builder.build();
  }

  /**
   * Quits the driver generated from directly connecting to the browser driver.
   * This is a no-op.
   * @returns A promise.
   */
  async quitDriver() {
    return Promise.resolve();
  }
}