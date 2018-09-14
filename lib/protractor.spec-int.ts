import * as log from 'loglevel';
import {ChildProcess} from 'child_process';
import {By} from 'selenium-webdriver';
import {build} from './protractor';
import {spawnProcess} from '../spec/support/test_utils';
import * as env from '../spec/server/env';

log.setLevel('info');

const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless']
  },
};
const config = {capabilities, directConnect: true};
const {browser, element} = build(config);
const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let proc: ChildProcess;

const page1 = `${env.httpBaseUrl}/spec/website/html/page1.html`;
const page2 = `${env.httpBaseUrl}/spec/website/html/page2.html`;

describe('protractor', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('an example', () => {
    beforeAll(async () => {
      proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
      log.debug('http-server: ' + proc.pid);
      await browser.start();
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
    });

    afterAll(async () => {
      await browser.quit();
      process.kill(proc.pid);
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
    });

    it('should run a protractor test', async () => {
      await browser.get(page1);
      const navPage2 = element(By.css('.nav-page2'));
      expect(await navPage2.getText()).toBe('nav to page2');
      await navPage2.click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toBe(page2);
    });
  });
});