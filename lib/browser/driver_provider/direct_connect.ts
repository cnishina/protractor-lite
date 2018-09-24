import * as wdm from 'webdriver-manager-replacement';
import * as loglevel from 'loglevel';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder} from 'selenium-webdriver/chrome';
import {Driver as FirefoxDriver, ServiceBuilder as FirefoxServiceBuilder} from 'selenium-webdriver/firefox';
import {BrowserConfig} from '../browser_config';

const log = loglevel.getLogger('protractor');

export class DirectConnect {
  // TODO(cnsihina): What if the out_dir is different?
  static getDriver(browserConfig: BrowserConfig): WebDriver {
    let driver: WebDriver;
    const outDir = browserConfig.outDir;
    if (browserConfig.capabilities.browserName === 'chrome') {
      const chromeDriverPath = new wdm.ChromeDriver({outDir}).getBinaryPath();
      driver = ChromeDriver.createSession(
        new Capabilities(browserConfig.capabilities),
        new ChromeServiceBuilder(chromeDriverPath).build());
    } else if (browserConfig.capabilities.browserName === 'firefox') {
      const geckoDriverPath = new wdm.GeckoDriver({outDir}).getBinaryPath();
      driver = FirefoxDriver.createSession(
        new Capabilities(browserConfig.capabilities),
        new FirefoxServiceBuilder(geckoDriverPath).build());
    } else {
      log.warn('Browser provided is not supported.')
      log.warn('Supported browsers: chrome and firefox');
    }
    return driver;
  }
}





