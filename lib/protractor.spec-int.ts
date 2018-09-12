import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
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
const config = {capabilities};
const wdmOptions = wdm.initOptions(
  [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);
const {browser, element} = build(config);
const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let proc: ChildProcess;


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
      await wdm.update(wdmOptions);
      await wdm.start(wdmOptions);
      await browser.start();
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
    });
  
    afterAll(async () => {
      await browser.quit();
      await wdm.shutdown(wdmOptions);
      process.kill(proc.pid);
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
    });

    it('should run a protractor test', async () => {
      await browser.get(`${env.httpBaseUrl}/spec/website/html/page1.html`);
      const foo = element(By.css('.foo'));
      expect(await foo.getText()).toBe('nav to page2');
      await foo.click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toBe(`${env.httpBaseUrl}/spec/website/html/page2.html`);
    });
  });
});