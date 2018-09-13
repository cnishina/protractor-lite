import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {ChildProcess} from 'child_process';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {ElementArrayFinder, elementArrayFinderFactory} from './element_array_finder';
import {spawnProcess} from '../../spec/support/test_utils';
import * as env from '../../spec/server/env';

log.setLevel('info');

describe('element_array_finder', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless']
    }
  };
  let browser: Browser;
  const wdmOptions = wdm.initOptions(
    [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);

  let proc: ChildProcess;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async() => {
    proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
    log.debug('http-server: ' + proc.pid);
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
  });

  afterAll(async() => {
    await wdm.shutdown(wdmOptions);
    process.kill(proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  beforeEach(async () => {
    browser = new Browser(capabilities);
    await browser.start();
  });

  afterEach(async() => {
    await browser.quit();
  });

  describe('elementArrayFinderFactory', () => {
    it('should create a an elementArrayFinder object', () => {
      let elementArrayFinder = elementArrayFinderFactory(
        browser, By.css('.foo'));
      expect(elementArrayFinder).not.toBeNull();
      expect(elementArrayFinder.constructor.name).toBe('ElementArrayFinder');
    });
  });

  describe('ElementArrayFinder', () => {
    it('should find a list of web elements', async () => {
      let elementArrayFinder = elementArrayFinderFactory(
        browser, By.css('.foo'));
      await browser.get(`${env.httpBaseUrl}/spec/website/html/page2.html`);
      let webElements = await elementArrayFinder.getWebElements();
      expect(webElements.length).toBe(5);
    });
  });
});