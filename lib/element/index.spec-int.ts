import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {buildElementHelper} from './index';

log.setLevel('info');

describe('index', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless']
    },
  };
  let browser: Browser;
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

  describe('buildElementHelper', () => {

    describe('when browsing to the page', () => {
      beforeAll(async () => {
        browser = new Browser(capabilities);
        await browser.start();
        await browser.driver.get('https://github.com');
      });

      afterAll(async () => {
        await browser.quit();
      });

      it('should click on an element', async () => {
        let element = buildElementHelper(browser);
        await element(By.css('.btn-mktg.btn-primary-mktg.btn-large-mktg'))
          .click();
        expect(await browser.driver.getCurrentUrl())
          .toBe('https://github.com/join');
      });
    });
  });
});