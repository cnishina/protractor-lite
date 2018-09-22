import * as log from 'loglevel';
import {ChildProcess} from 'child_process';
import {By} from 'selenium-webdriver';
import {Browser} from '../../browser';
import {elementArrayFinderFactory} from './element_array_finder';
import {spawnProcess} from '../../../spec/support/test_utils';
import * as env from '../../../spec/server/env';

log.setLevel('info');
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;

describe('element_array_finder', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu']
    }
  };
  let browser: Browser;
  let proc: ChildProcess;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async() => {
    proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
    log.debug('http-server: ' + proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    browser = new Browser({capabilities, directConnect: true});
    await browser.start();
  });

  afterAll(async () => {
    await browser.quit();
    process.kill(proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
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
        browser, By.css('.nav-page1'));
      await browser.get(page2);
      let webElements = await elementArrayFinder.getWebElements();
      expect(webElements.length).toBe(5);
    });
  });
});