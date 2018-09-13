import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {ChildProcess} from 'child_process';
import {By} from 'selenium-webdriver';
import {Browser} from '../browser';
import {elementFinderFactory} from './element_finder';
import {spawnProcess} from '../../spec/support/test_utils';
import * as env from '../../spec/server/env';

log.setLevel('info');
const page1 = `${env.httpBaseUrl}/spec/website/html/page1.html`;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;

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
    describe('clear', () => {
      it('should clear the input', async () => {
        const inputEmpty = elementFinderFactory(
          browser, By.css('.input-empty'));
        const inputValue = elementFinderFactory(
          browser, By.css('.input-value'));
        await browser.get(page1);
        await inputEmpty.clear();
        await inputValue.clear();
        expect(await inputEmpty.getAttribute('value')).toBe('');
        expect(await inputValue.getAttribute('value')).toBe('');
      });
    });

    describe('click', () => {
      it('should click a link', async () => {
        const navPage2 = elementFinderFactory(
          browser, By.css('.nav-page2'));
        await browser.get(page1);
        await navPage2.click();
        let currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).toBe(page2);
      });
    });

    describe('getAttribute', () => {
      it('should get the contents from the input tag', async () => {
        const inputEmpty = elementFinderFactory(
          browser, By.css('.input-empty'));
        const inputValue = elementFinderFactory(
          browser, By.css('.input-value'));
        await browser.get(page1);
        expect(await inputEmpty.getAttribute('value')).toBe('');
        expect(await inputValue.getAttribute('value')).toBe('foobar');
      });
    });

    describe('getText', () => {
      it('should get the contents of the html tag', async () => {
        const navPage2 = elementFinderFactory(
          browser, By.css('.nav-page2'));
        await browser.get(page1);
        expect(await navPage2.getText()).toBe('nav to page2');
      });
    });

    describe('sendKeys', () => {
      it('should get the contents of the html tag', async () => {
        const inputEmpty = elementFinderFactory(
          browser, By.css('.input-empty'));
        await browser.get(page1);
        await inputEmpty.sendKeys('foo bar baz');
        let value = await inputEmpty.getAttribute('value');
        expect(value).toBe('foo bar baz');
      });
    });
  });
});