import * as net from 'net';
import * as wdm from 'webdriver-manager-replacement';
import {Builder, WebDriver} from 'selenium-webdriver';
import * as http from 'selenium-webdriver/http';
import {BrowserConfig} from '../browser_config';
import {Provider} from './provider';

export class Local implements Provider {
  options: wdm.Options;
  constructor(public browserConfig: BrowserConfig) {
    // Generate the options for webdriver-manager to start the selenium server.
    const outDir = this.browserConfig.outDir || "downloads";
    this.options = {
      browserDrivers: [],
      outDir
    };

    if (new wdm.SeleniumServer({outDir}).getBinaryPath()) {
      this.options.server = {
        name: 'selenium',
        runAsDetach: true,
        runAsNode: true
      };
    } else {
      throw new Error('No selenium server jar file.');
    }
    if (new wdm.ChromeDriver({outDir}).getBinaryPath()) {
      this.options.browserDrivers.push({name: 'chromedriver'});
    }
    if (new wdm.GeckoDriver({outDir}).getBinaryPath()) {
      this.options.browserDrivers.push({name: 'geckodriver'});
    }
    if (new wdm.IEDriver({outDir}).getBinaryPath()) {
      this.options.browserDrivers.push({name: 'iedriver'});
    }
    if (this.options.browserDrivers.length === 0) {
      throw new Error('No browser drivers were found.');
    }
  }

  /**
   * Starts the selenium server standalone on an available port range. After
   * starting the server, it will build the driver.
   * @returns A promise for the WebDriver.
   */
  async getDriver(): Promise<WebDriver> {
    const port = await this.findPort(
      this.browserConfig.portRangeStart, this.browserConfig.portRangeEnd);
    const seleniumAddress = `http://127.0.0.1:${port}/wd/hub`;
    this.options.server.port = port;

    await wdm.start(this.options);

    // TODO(cnishina): A event listener on SIGNIT to quit the driver. This will
    // be a good clean up step to not leave any selenium servers running in the
    // background.
    const httpClient = new http.HttpClient(seleniumAddress);
    const executor = new http.Executor(httpClient);
    return new WebDriver(null, executor);
  }

  /**
   * Shutsdown the selenium server standalone. If this is not called after
   * the test ends, the java command will still run in the background.
   */
  async quitDriver(): Promise<void> {
    await wdm.shutdown(this.options);
  }

  /**
   * Find the port number that is available for the port range provided.
   * Assumes that the portRangeStart < portRangeEnd and that the portRangeEnd
   * should also be checked.
   * @param portRangeStart
   * @param portRangeEnd
   */
  async findPort(
      portRangeStart: number, portRangeEnd: number): Promise<number> {
    
    // When no start is provided but an end range is provided, create
    // an arbitrary start point.
    if (!portRangeStart && portRangeEnd) {
      portRangeStart = portRangeEnd - 1000;
    }
    // When no end is provided but a start range is provided, create
    // an arbitrary end point.
    if (portRangeStart && !portRangeEnd) {
      portRangeEnd = portRangeStart + 1000;
    }
    // If no start and end are provided, create a range from 4000 to 5000.
    if (!portRangeStart && !portRangeEnd) {
      portRangeStart = 4000;
      portRangeEnd = 5000;
    }
    
    let portFound = null;
    for (let port = portRangeStart; port <= portRangeEnd; port++) {
      let server: net.Server;
      let shouldBreak = await new Promise<boolean>(resolve => {
        // Start a server to check if we can listen to a port.
        server = net.createServer().listen(port)
          .on('error', () => {
            // EADDRINUSE or EACCES, move on.
            resolve(false);
          })
          .on('listening', () => {
            resolve(true);
          });
      }).then(result => {
        if (result) {
          // If the server is listening, close the server.
          server.close();
          portFound = port;
        }
        return result;
      });
      if (shouldBreak) {
        break;
      }
    }
    return portFound;
  }
}