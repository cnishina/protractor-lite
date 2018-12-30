import * as loglevel from 'loglevel';
import {ProtractorBy} from './protractor_by';
import {buildElementHelper} from '../element';
import {Browser} from '../browser';
import {HttpServer} from '../../../spec/server/http_server';

const log = loglevel.getLogger('protractor-test');

const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
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
    beforeAll(async () => {
      httpServer.createServer();
    });

    afterAll(async () => {
      httpServer.closeServer();

      await new Promise((resolve, _) => {
        setTimeout(resolve, 5000);
      });
    });

    it('should find a button by text', async () => {
      let browser = new Browser({
        capabilities,
        directConnect: true
        // ,
        // outDir: 'downloads'
      });
      await browser.start();
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
      await browser.get('http://localhost:8812/spec/website/html/page1.html');
      let element = buildElementHelper(browser);
      let by = new ProtractorBy();
      await element(by.buttonText('button enabled')).click();
      expect(await browser.getTitle()).toBe('page 2');
      await browser.quit();
    });
  });
});