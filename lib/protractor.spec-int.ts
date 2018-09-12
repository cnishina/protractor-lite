import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {By} from 'selenium-webdriver';
import {build} from './protractor';

log.setLevel('info');

const capabilities = { browserName: 'chrome' };
const config = {capabilities};
const wdmOptions = wdm.initOptions(
  [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);
const {browser, element} = build(config);
const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

describe('protractor', () => {
  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    await wdm.update(wdmOptions);
    await wdm.start(wdmOptions);
    await browser.start();
  });

  afterAll(async () => {
    await browser.quit();
    await wdm.shutdown(wdmOptions);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  it('should run a protractor test', async () => {
    await browser.get('https://github.com');
    await element(By.css('.btn-mktg.btn-primary-mktg.btn-large-mktg')).click();
    await new Promise((resolve, _) => {
      setTimeout(resolve, 3000);
    });
  });
});