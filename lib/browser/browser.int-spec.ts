import * as loglevel from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {Browser} from './browser';
import {requestBody} from '../../spec/support/http_utils';
import {options} from '../../spec/support/wdm_options';

const log = loglevel.getLogger('protractor-test');
log.setLevel('info');

describe('browser', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--noSandbox']
    },
  };

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('start and stop', () => {
    let seleniumAddress: string;
    let browser: Browser;
    let wdSessions: string;

    beforeAll(async() => {
      await wdm.start(options);
      seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
      browser = new Browser({capabilities, seleniumAddress});
      wdSessions = seleniumAddress + '/sessions';
      await new Promise((resolve, _) => {
        log.info('sleeping for 10 seconds');
        setTimeout(resolve, 10000);
      });
    });

    afterAll(async() => {
      await wdm.shutdown(options);
      await new Promise((resolve, _) => {
        setTimeout(resolve, 3000);
      });
    });

    it('should start a browser session', async() => {
      let body = await requestBody(wdSessions, {});
      expect(JSON.parse(body)['value'].length).toBe(0);
      await browser.start();

      body = await requestBody(wdSessions, {});
      expect(JSON.parse(body)['value'].length).toBe(1);
    });

    it('should stop a browser', async() => {
      let body = await requestBody(wdSessions, {});
      expect(JSON.parse(body)['value'].length).toBe(1);
      await browser.quit();

      body = await requestBody(wdSessions, {});
      expect(JSON.parse(body)['value'].length).toBe(0);
    });
  });
});