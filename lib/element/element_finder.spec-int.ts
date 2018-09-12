import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {ChildProcess} from 'child_process';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {elementFinderFactory} from './element_finder';
import {spawnProcess} from '../../spec/support/test_utils';
import * as env from '../../spec/server/env';

log.setLevel('info');

describe('element_finder', () => {
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

  let proc: ChildProcess;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async() => {
    proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
    log.info('http-server: ' + proc.pid);
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
  });

  afterAll(async() => {
    await wdm.shutdown(wdmOptions);
    process.kill(proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  beforeEach(async () => {
    browser = new Browser(capabilities);
    await browser.start();
  });

  afterEach(async() => {
    await browser.quit();
  });

  describe('elementFinderFactory', () => {
    it('should create a an elementFinder object', () => {
      const elementFinder = elementFinderFactory(browser, By.css('.foo'));
      expect(elementFinder).not.toBeNull();
      expect(elementFinder.constructor.name).toBe('ElementFinder');
    });
  });

  describe('ElementFinder', () => {
    describe('click', () => {
      it('should click a link', async () => {
        const elementFinder = elementFinderFactory(browser, By.css('.foo'));
        await browser.get(`${env.httpBaseUrl}/spec/website/html/page1.html`);
        await elementFinder.click();
        let currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toBe(
          `${env.httpBaseUrl}/spec/website/html/page2.html`);
      });
    });

    describe('getText', () => {
      it('should get the contents of the html tag', async () => {
        const elementFinder = elementFinderFactory(browser, By.css('.foo'));
        await browser.get(`${env.httpBaseUrl}/spec/website/html/page1.html`);
        expect(await elementFinder.getText()).toBe('nav to page2');
      });
    });

    describe('sendKeys and getAttribute', () => {
      it('should get the contents of the html tag', async () => {
        const elementFinder = elementFinderFactory(browser, By.css('.bar'));
        await browser.get(`${env.httpBaseUrl}/spec/website/html/page1.html`);
        let placerHolder = await elementFinder.getAttribute('value');
        expect(placerHolder).toBe('');
        await elementFinder.sendKeys('foo bar baz');
        let value = await elementFinder.getAttribute('value');
        expect(value).toBe('foo bar baz');
      });
    });
  });
});