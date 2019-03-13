import * as net from 'net';
import { Local } from './local';

describe('local', () => {
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  describe('class Local', () => {
    describe('getDriver', () => {
      it('should create a selenium server and a driver', async () => {
        const capabilities = {
          browserName: 'chrome',
          chromeOptions: {
            args: ['--headless', '--disable-gpu', '--noSandbox']
          },
        };
        const browserConfig = {capabilities, portRangeStart: 5000,
          portRangeEnd: 6000};
        const local = new Local(browserConfig);
        const driver = await local.getDriver();
        expect(driver).not.toBeNull();
        expect(driver.constructor.name).toBe('WebDriver');
        await local.quitDriver();
      });
    });

    describe('findPort', () => {
      let server4000: net.Server;
      let server4001: net.Server;
      let server4002: net.Server;

      beforeAll(() => {
        server4000 = net.createServer().listen(4000);
        server4001 = net.createServer().listen(4001);
        server4002 = net.createServer().listen(4002);
      });

      afterAll(() => {
        server4000.close();
        server4001.close();
        server4002.close();
      });

      it('should find a port greater than 4002', async () => {
        const local = new Local({});
        const port = await local.findPort(4000, 4500);
        expect(port).toBeGreaterThanOrEqual(4002);
      });

      it('should not find a port', async () => {
        const local = new Local({});
        const port = await local.findPort(4000, 4002);
        expect(port).toBeNull();
      });
    });
  });
});