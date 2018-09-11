import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {ElementArrayFinder } from './element_array_finder';

log.setLevel('info');

describe('ElementArrayFinder', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  const capabilities = {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless']
    }
  };
  let browser: Browser;
  const wdmOptions = wdm.initOptions(
    [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);

  beforeAll(async() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
  });

  afterAll(async() => {
    await wdm.shutdown(wdmOptions);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('generate', () => {

    describe('when browsing to the page', () => {
      beforeAll(async () => {
        browser = new Browser(capabilities);
        await browser.start();
        await browser.driver.get('https://github.com');
      });

      afterAll(async () => {
        await browser.quit();
      });

      let invertocats: ElementArrayFinder;
      it('should create a promise for all elements', () => {
        invertocats = ElementArrayFinder.generate(browser,
          By.css('.header-logo-invertocat'));
        expect(invertocats).not.toBeNull();
      });

      it('await all', async () => {
        let awaitInvertocats = await invertocats.getWebElements();
        expect(awaitInvertocats.length).toBe(1);
      });
    });

    describe('when browser session exists, but not on page', () => {
      let invertocats: ElementArrayFinder;

      beforeAll(async () => {
        browser = new Browser(capabilities);
        await browser.start();
        invertocats = ElementArrayFinder.generate(browser,
          By.css('.header-logo-invertocat'));
      });

      afterAll(async () => {
        await browser.quit();
      });

      it('should find an element', async () => {
        await browser.driver.get('https://github.com');
        expect(invertocats).not.toBeNull();
      });

      it('await all', async () => {
        let awaitInvertocats = await invertocats.getWebElements();
        expect(awaitInvertocats.length).toBe(1);
      });
    });
  });
});