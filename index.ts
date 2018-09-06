import * as log from 'loglevel';
import * as wdm from 'webdriver-manager-replacement';
import {By} from 'selenium-webdriver';
import {build} from './lib/build';

log.setLevel('info');

const capabilities = { browserName: 'chrome' };
const config = {capabilities};

const wdmOptions = wdm.initOptions(
  [wdm.Provider.ChromeDriver, wdm.Provider.Selenium], true);


async function run() {
  // on prepare: we can download and start a selenium server
  await wdm.update(wdmOptions);
  await wdm.start(wdmOptions);

  // beforeEach: start a browser
  const {browser, element} = build(config);
  await browser.start();

  // do some tests
  await browser.get('https://github.com');
  await element(By.css('.btn-mktg.btn-primary-mktg.btn-large-mktg')).click();
  await new Promise((resolve, _) => {
    setTimeout(resolve, 3000);
  });

  // afterEach: stop the browser
  await browser.quit();

  // onComplete: shutdown the selenium server
  wdm.shutdown(wdmOptions);
}

run().then(() => {});