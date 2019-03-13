import * as wdm from 'webdriver-manager';
import * as loglevel from 'loglevel';
import { Capabilities, WebDriver } from 'selenium-webdriver';
import { Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder } from 'selenium-webdriver/chrome';
import { Driver as FirefoxDriver, ServiceBuilder as FirefoxServiceBuilder } from 'selenium-webdriver/firefox';
import { Provider } from './provider';
import { DriverConfig } from './driver_config';

const log = loglevel.getLogger('protractor');

export class DirectConnect implements Provider {
  constructor(public config: DriverConfig) {}

  /**
   * Gets the driver generated from directly connecting to the browser driver.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    let driver: WebDriver;
    const outDir = this.config.outDir || "downloads";
    if (this.config.capabilities.browserName === 'chrome') {
      const chromeDriverPath = new wdm.ChromeDriver({outDir}).getBinaryPath();
      driver = ChromeDriver.createSession(
        new Capabilities(this.config.capabilities),
        new ChromeServiceBuilder(chromeDriverPath).build());
    } else if (this.config.capabilities.browserName === 'firefox') {
      const geckoDriverPath = new wdm.GeckoDriver({outDir}).getBinaryPath();
      driver = FirefoxDriver.createSession(
        new Capabilities(this.config.capabilities),
        new FirefoxServiceBuilder(geckoDriverPath).build());
    } else {
      log.warn('Browser provided is not supported.')
      log.warn('Supported browsers: chrome and firefox');
    }
    return Promise.resolve(driver);
  }

  /**
   * Quits the driver generated from directly connecting to the browser driver.
   * This is a no-op.
   * @returns A promise.
   */
  async quitDriver():Promise<void> {
    return Promise.resolve();
  }
}





