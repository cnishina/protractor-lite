import { build, Protractor, Browser, By, Element } from 'protractor-lite';
import { newWebDriverSession } from 'protractor-lite/dist/lib/drivers/hosted';
import { driverConfig, seleniumAddress } from '../../config';

let protractor: Protractor;
let browser: Browser;
let by: By;
let element: Element;

async function init() {
  const seleniumSessionId = await newWebDriverSession(driverConfig);
  return build({ seleniumAddress, seleniumSessionId });
}

describe('button-overview', () => {
  beforeEach(async () => {
    protractor = await init();
    browser = protractor.browser;
    by = protractor.by;
    element = protractor.element;
  });

  afterEach(async () => {
    await browser.quit();
  });

  it('should click the button', async () => {
    await browser.get('http://localhost:4200/');
    console.log(browser.sharedResults);
    await browser.sleep(100);
    const button = element(by.id('button-overview'));
    expect(await button.getText()).toBe('not clicked');
    await button.click();
    expect(await button.getText()).toBe('clicked');
  });
});