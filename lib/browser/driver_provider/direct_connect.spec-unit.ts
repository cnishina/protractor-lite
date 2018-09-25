import {DirectConnect} from './direct_connect';

describe('direct_connect', () => {
  describe('DirectConnect', () => {
    describe('getDriver', () => {
      it('should create a chromedriver', async () => {
        const browserConfig = {capabilities: {browserName: 'chrome'}};
        const driver = await new DirectConnect(browserConfig).getDriver();
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('Driver');
      });
    });
  });
});