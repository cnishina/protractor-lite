import * as wdm from 'webdriver-manager-replacement';
import {Hosted} from './hosted';

const options: wdm.Options = {
  browserDrivers: [{name: 'chromedriver'}],
  server: {
    name: 'selenium',
    runAsDetach: true,
    runAsNode: true,
    port: 5555
  },
  outDir: 'downloads'
};

describe('hosted', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    wdm.setLogLevel('debug');
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
        const browserConfig = {
          capabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: ['--headless', '--disable-gpu', '--noSandbox']
            },
          },
          seleniumAddress: 'http://127.0.0.1:5555/wd/hub'
        };
        const hosted = new Hosted(browserConfig);
        const driver = await hosted.getDriver();
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('WebDriver');
        await hosted.quitDriver();
      });
    });
  });
});