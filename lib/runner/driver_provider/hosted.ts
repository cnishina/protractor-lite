import { WebDriver } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { Provider } from './provider';
import { RunnerConfig } from '../runner_config';

export class Hosted implements Provider {
  constructor(public runnerConfig: RunnerConfig) {}

  /**
   * Gets the driver generated when the selenium address is available.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    const httpClient = new HttpClient(this.runnerConfig.seleniumAddress);
    const executor = new Executor(httpClient);
    return WebDriver.createSession(executor, this.runnerConfig.capabilities);
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