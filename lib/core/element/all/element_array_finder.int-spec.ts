import {By} from 'selenium-webdriver';

import {Browser} from '../../browser';
import {elementArrayFinderFactory} from './element_array_finder';

import * as env from '../../../../spec/server/env';
import {HttpServer} from '../../../../spec/server/http_server';
import {startSession} from '../../../../spec/support/test_utils';

const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;
const httpServer = new HttpServer();
const seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--disable-gpu', '--noSandbox']
  }
};

describe('element_array_finder', () => {
  let browser: Browser;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  beforeAll(async() => {
    httpServer.createServer();
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    const seleniumSessionId = await startSession(
      seleniumAddress, capabilities);
    browser = new Browser({seleniumAddress, seleniumSessionId});
  });

  afterAll(async () => {
    await browser.quit()
    httpServer.closeServer();
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
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