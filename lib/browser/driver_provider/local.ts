import * as loglevel from 'loglevel';
import * as net from 'net';
import * as wdm from 'webdriver-manager-replacement';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder} from 'selenium-webdriver/chrome';
import {Driver as FirefoxDriver, ServiceBuilder as FirefoxServiceBuilder} from 'selenium-webdriver/firefox';
import {BrowserConfig} from '../browser_config';

const log = loglevel.getLogger('protractor');

export class Local {
  static getDriver() {
    // how will we pass the port to wdm?
  }

  /**
   * Find the port number.
   * @param portRangeStart
   * @param portRangeEnd
   */
  static async findPort(
      portRangeStart: number, portRangeEnd: number): Promise<number> {
    let portFound = null;
    for (let port = portRangeStart; port <= portRangeEnd; port++) {
      let server: net.Server;
      const portAvailable = await new Promise<boolean>(resolve => {
        server = net.createServer().listen(port)
          .on('error', () => {
            // EADDRINUSE or EACCES, move on.
            resolve(false);
          })
          .on('listening', () => {
            resolve(true);
          });
      });
      server.close();
      if (portAvailable) {
        portFound = port;
        break;
      }
    }
    return portFound;
  }
}