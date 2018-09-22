import * as wdm from 'webdriver-manager-replacement';
import * as loglevel from 'loglevel';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder} from 'selenium-webdriver/chrome';
import {Driver as FirefoxDriver, ServiceBuilder as FirefoxServiceBuilder} from 'selenium-webdriver/firefox';
import {BrowserConfig} from '../browser_config';

const log = loglevel.getLogger('protractor');

export class Local {
  static getDriver() {
    // how will we pass the port to wdm?
  }

  static findPort() {
    // try to create a selenium server on an open port.
    // keep a range of 4000 - 50000

    // start servers at the port, if they encounter a 
    // EADDRINUSE or EACCES, move on.
  }
}