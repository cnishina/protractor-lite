import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {Browser} from './browser';
import {requestBody} from '../spec/support/http_utils';

log.setLevel('info');

describe('browser', () => {
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless']
    }
  };

  const wdmOptions = wdm.initOptions(
    [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);

  beforeAll(async() => {
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
  });

  afterAll(async() => {
    await wdm.shutdown(wdmOptions);
  });

  describe('start and stop', () => {
    let browser = new Browser(capabilities);

    it('should start a browser session', async() => {
      let body = await requestBody('http://127.0.0.1:4444/wd/hub/sessions', {});
      expect(JSON.parse(body)['value'].length).toBe(0);

      await browser.start();

      body = await requestBody('http://127.0.0.1:4444/wd/hub/sessions', {});
      expect(JSON.parse(body)['value'].length).toBe(1);
    });

    it('should stop a browser', async() => {
      let body = await requestBody('http://127.0.0.1:4444/wd/hub/sessions', {});
      expect(JSON.parse(body)['value'].length).toBe(1);

      await browser.quit();

      body = await requestBody('http://127.0.0.1:4444/wd/hub/sessions', {});
      expect(JSON.parse(body)['value'].length).toBe(0);
    });
  });
});