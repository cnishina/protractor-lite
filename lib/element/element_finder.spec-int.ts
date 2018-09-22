import * as log from 'loglevel';
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
      args: ['--headless', '--disable-gpu']
    },
  };
  let browser: Browser;
  let proc: ChildProcess;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  beforeAll(async() => {
    proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
    log.info('http-server: ' + proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    browser = new Browser({capabilities, directConnect: true});
    await browser.start();
  });

  afterAll(async() => {
    await browser.quit();
    process.kill(proc.pid);
    await new Promise((resolve, _) => {
      setTimeout(resolve, 1000);
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
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

    describe('isDisplayed', () => {
      it('should check if the spans are visible', async () => {
        const spanHidden = elementFinderFactory(
          browser, By.css('.span-hidden'));
        const spanVisible = elementFinderFactory(
          browser, By.css('.span-visible'));
        await browser.get(page1);
        expect(await spanHidden.isDisplayed()).toBeFalsy();
        expect(await spanVisible.isDisplayed()).toBeTruthy();
      });
    });

    describe('isEnabled', () => {
      it('should check if the buttons are enabled', async () => {
        const buttonDisabled = elementFinderFactory(
          browser, By.css('.button-disabled'));
        const buttonEnabled = elementFinderFactory(
          browser, By.css('.button-enabled'));
        await browser.get(page1);
        expect(await buttonDisabled.isEnabled()).toBeFalsy();
        expect(await buttonEnabled.isEnabled()).toBeTruthy();
      });
    });

    describe('isSelected', () => {
      it('should check if the checkboxes are selected', async () => {
        const checkboxNotSelected = elementFinderFactory(
          browser, By.css('.checkbox-not-selected'));
        const checkboxSelected = elementFinderFactory(
          browser, By.css('.checkbox-selected'));
        await browser.get(page1);
        expect(await checkboxNotSelected.isSelected()).toBeFalsy();
        expect(await checkboxSelected.isSelected()).toBeTruthy();
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