import * as loglevel from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {Browser} from './browser';
import {startSession} from '../../../spec/support/test_utils';
import {options} from '../../../spec/support/wdm_options';

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

  describe('get and getCurrentUrl', () => {
    const seleniumAddress = 'http://127.0.0.1:4444/wd/hub';
    let browser: Browser;

    beforeAll(async () => {
      await wdm.start(options);
      const seleniumSessionId = await startSession(
        seleniumAddress, capabilities);
      browser = new Browser({seleniumAddress, seleniumSessionId});
      await new Promise((resolve, _) => {
        setTimeout(resolve, 3000);
      });
    });

    afterAll(async () => {
      await wdm.shutdown(options);
      await new Promise((resolve, _) => {
        setTimeout(resolve, 3000);
      });
    });

    it('should navigate to a url', async () => {
      await browser.get('https://wwww.google.com/');
      expect(await browser.getCurrentUrl()).toBe('https://wwww.google.com/');
    });
  });
});