import * as log from 'loglevel';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {buildElementHelper} from './index';
import {HttpServer} from '../../spec/server/http_server';
import * as env from '../../spec/server/env';

log.setLevel('info');
const page1 = `${env.httpBaseUrl}/spec/website/html/page1.html`;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;
const httpServer = new HttpServer();

describe('index', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--noSandbox']
    },
  };
  let browser: Browser;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async () => {
    httpServer.createServer();
  });

  afterAll(async () => {
    httpServer.closeServer();
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('buildElementHelper', () => {
    describe('when browsing to the page', () => {
      beforeAll(async () => {
        browser = new Browser({capabilities, directConnect: true});
        await browser.start();
        await browser.get(page1);
      });

      afterAll(async () => {
        await browser.quit();
      });

      it('should click on an element', async () => {
        let element = buildElementHelper(browser);
        await element(By.css('.nav-page2')).click();
        expect(await browser.driver.getCurrentUrl()).toBe(page2);
      });
    });
  });
});