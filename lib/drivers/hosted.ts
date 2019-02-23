import { WebDriver } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { Provider } from './provider';
import { DriverConfig } from "./driver_config";

export class Hosted implements Provider {
  constructor(public config: DriverConfig) {}

  /**
   * Gets the driver generated when the selenium address is available.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    const httpClient = new HttpClient(this.config.seleniumAddress);
    const executor = new Executor(httpClient);
    return WebDriver.createSession(executor, this.config.capabilities);
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

export async function newWebDriverSession(config: DriverConfig) {
  const hosted = new Hosted(config);
  const webDriver = await hosted.getDriver();
  const session = await webDriver.getSession();
  return session.getId();
}