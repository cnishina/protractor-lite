import {Hosted} from './hosted';
import * as wdm from 'webdriver-manager-replacement';

const options: wdm.Options = {
  browserDrivers: [{name: 'chromedriver'}],
  server: {
    name: 'selenium',
    runAsDetach: true,
    runAsNode: true
  }
};

describe('hosted', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('class Hosted', () => {
    beforeAll(async () => {
      await wdm.start(options);
    });

    afterAll(async () => {
      await wdm.shutdown(options);
    });

    describe('getDriver', () => {
      it('should create a driver using seleniumAddress', async () => {
        const capabilities = {
          browserName: 'chrome',
          chromeOptions: {
            args: ['--headless', '--disable-gpu', '--noSandbox']
          },
        };
        const browserConfig = {capabilities,
          seleniumAddress: 'http://127.0.0.1:4444/wd/hub'};
        const driver = await new Hosted(browserConfig).getDriver();
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('mixin');
      });
    });
  });
});