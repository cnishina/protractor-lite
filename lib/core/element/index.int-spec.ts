import * as log from 'loglevel';
import { By } from 'selenium-webdriver';
import { Browser } from '../browser';
import { buildElementHelper } from './index';

import * as env from '../../../spec/server/env';
import { HttpServer } from '../../../spec/server/http_server';
import { startSession } from '../../../spec/support/test_utils';

log.setLevel('info');
const page1 = `${env.httpBaseUrl}/spec/website/html/page1.html`;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;
const seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
const httpServer = new HttpServer();
const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--disable-gpu', '--noSandbox']
    },
};

describe('index', () => {
  let browser: Browser;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async () => {
    httpServer.createServer();
  });

  afterAll(async () => {
    httpServer.closeServer();
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('buildElementHelper', () => {
    describe('when browsing to the page', () => {
      beforeAll(async () => {
        const seleniumSessionId = await startSession(
            seleniumAddress, capabilities);
        browser = new Browser({seleniumAddress, seleniumSessionId});
        await browser.get(page1);
      });

      afterAll(async () => {
        await browser.quit();
      });

      it('should click on an element', async () => {
        let element = buildElementHelper(browser.driver);
        await element(By.css('.nav-page2')).click();
        expect(await browser.driver.getCurrentUrl()).toBe(page2);
      });
    });
  });
});