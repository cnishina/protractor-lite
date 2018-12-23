import {DirectConnect} from './direct_connect';

describe('direct_connect', () => {
  describe('class DirectConnect', () => {
    describe('getDriver', () => {
      it('should create a chromedriver', async () => {
        const browserConfig = {
          capabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: ['--headless', '--disable-gpu', '--noSandbox']
            }
          }
        };
        const directConnect = new DirectConnect(browserConfig);
        const driver = await directConnect.getDriver();
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('Driver');
        await directConnect.quitDriver();
      });
    });
  });
});