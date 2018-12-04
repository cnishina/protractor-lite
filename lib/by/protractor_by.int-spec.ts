import {ChildProcess} from 'child_process';
import * as loglevel from 'loglevel';
import {ProtractorBy} from './protractor_by';
import {buildElementHelper} from '../element';
import {Browser} from '../browser';
import {spawnProcess} from '../../spec/support/test_utils'

const log = loglevel.getLogger('protractor-test');

const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
let proc: ChildProcess;
let browser: Browser;
const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--disable-gpu', '--noSandbox']
  },
};

describe('protractor_by', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('byButtonText', () => {
    beforeAll(async () => {
      proc = spawnProcess('node', ['dist/spec/server/http_server.js']);
      log.debug('http-server: ' + proc.pid);
      browser = new Browser({capabilities, directConnect: true});
      await browser.start();
      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000);
      });
    });

    afterAll(async () => {
      await browser.quit();
      process.kill(proc.pid);
      await new Promise((resolve, _) => {
        setTimeout(resolve, 5000);
      });
    });

    it('should find a button by text', async () => {
      await browser.get('http://localhost:8812/spec/website/html/page1.html');
      let element = buildElementHelper(browser);
      let by = new ProtractorBy();
      await element(by.buttonText('button enabled')).click();
      expect(await browser.getTitle()).toBe('page 2');
    });
  });
});