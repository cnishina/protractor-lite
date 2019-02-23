import { ProtractorBy } from './protractor_by';
import { buildElement } from '../element';
import { Browser } from '../browser';

import { HttpServer } from '../../../spec/server/http_server';
import { startSession } from '../../../spec/support/test_utils';

const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
const seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
const httpServer = new HttpServer();
const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--disable-gpu', '--noSandbox']
  },
};

describe('protractor_by', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('byButtonText', () => {
    let browser: Browser;

    beforeAll(async () => {
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

    it('should find a button by text', async () => {
      await browser.get('http://127.0.0.1:8812/spec/website/html/page1.html');
      let element = buildElement(browser.driver);
      let by = new ProtractorBy();
      await element(by.buttonText('button enabled')).click();
      expect(await browser.getTitle()).toBe('page 2');
    });
  });
});