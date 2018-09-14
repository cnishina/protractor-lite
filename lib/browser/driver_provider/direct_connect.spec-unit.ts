import {DirectConnect} from './direct_connect';

describe('direct_connect', () => {
  describe('DirectConnect', () => {
    describe('getDriver', () => {
      it('should create a chrome driver', () => {
        const browserConfig = {capabilities: {browserName: 'chrome'}};
        const driver = DirectConnect.getDriver(browserConfig);
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('Driver');
      });
    });

    describe('getDriver', () => {
      it('should create a chrome driver', () => {
        const browserConfig = {capabilities: {browserName: 'chrome'}};
        const driver = DirectConnect.getDriver(browserConfig);
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('Driver');
      });
    });
  });
});