import { Browser } from './browser';
import { startSession } from '../../../spec/support/test_utils';

describe('browser', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu']
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
    let seleniumSessionId: string;
    
    beforeAll(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 5000);
      });
      seleniumSessionId = await startSession(
        seleniumAddress, capabilities);
    });

    it('should navigate to a url', async () => {
      let browser = new Browser({seleniumAddress, seleniumSessionId});
      await browser.get(
        'http://127.0.0.1:4444/wd/hub/static/resource/hub.html');
      expect(await browser.getCurrentUrl()).toBe(
        'http://127.0.0.1:4444/wd/hub/static/resource/hub.html');
      await browser.quit();
    });
  });
});