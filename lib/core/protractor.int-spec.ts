import {By} from 'selenium-webdriver';
import {build} from './protractor';

import * as env from '../../spec/server/env';
import {HttpServer} from '../../spec/server/http_server';
import {startSession} from '../../spec/support/test_utils';
import { Browser } from './browser';
import { ElementHelper } from './element';

const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
const page1 = `${env.httpBaseUrl}/spec/website/html/page1.html`;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;
const httpServer = new HttpServer();
const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--disable-gpu', '--noSandbox']
  },
};

describe('protractor', () => {
  const seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
  let browser: Browser;
  let element: ElementHelper;

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
    const ptorBuild = build({seleniumAddress, seleniumSessionId});
    browser = ptorBuild.browser;
    element = ptorBuild.element;
  });

  afterAll(async () => {
    await browser.quit();
    httpServer.closeServer();
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
  });

  describe('an example', () => {
    it('should run a protractor test', async () => {
      await browser.get(page1);
      const navPage2 = element(By.css('.nav-page2'));
      expect(await navPage2.getText()).toBe('nav to page2');
      await navPage2.click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toBe(page2);
    });
  });
});