import * as wdm from 'webdriver-manager-replacement';
import * as loglevel from 'loglevel';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder} from 'selenium-webdriver/chrome';
import {Driver as FirefoxDriver, ServiceBuilder as FirefoxServiceBuilder} from 'selenium-webdriver/firefox';
import {BrowserConfig} from '../browser_config';
import {Provider} from './provider';

const log = loglevel.getLogger('protractor');

export class DirectConnect implements Provider {
  constructor(public browserConfig: BrowserConfig) {}

  /**
   * Gets the driver generated from directly connecting to the browser driver.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    let driver: WebDriver;
    const outDir = this.browserConfig.outDir || "downloads";
    if (this.browserConfig.capabilities.browserName === 'chrome') {
      const chromeDriverPath = new wdm.ChromeDriver({outDir}).getBinaryPath();
      driver = ChromeDriver.createSession(
        new Capabilities(this.browserConfig.capabilities),
        new ChromeServiceBuilder(chromeDriverPath).build());
    } else if (this.browserConfig.capabilities.browserName === 'firefox') {
      const geckoDriverPath = new wdm.GeckoDriver({outDir}).getBinaryPath();
      driver = FirefoxDriver.createSession(
        new Capabilities(this.browserConfig.capabilities),
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





