import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {Browser} from './browser';
import {requestBody} from '../spec/support/http_utils';

log.setLevel('info');

describe('browser', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless']
    },
  };

  const wdmOptions = wdm.initOptions(
    [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async() => {
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
  });

  afterAll(async() => {
    await wdm.shutdown(wdmOptions);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('start and stop', () => {
    let browser = new Browser(capabilities);
    let wdSessions = 'http://127.0.0.1:4444/wd/hub/sessions';

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