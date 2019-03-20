import { Session, WebDriver } from 'selenium-webdriver';
import { Executor, HttpClient } from 'selenium-webdriver/http';
import { log } from '../../utils/log';

log.setLevel('debug');

function getWebDriver() {
  const sessionId = '1234';
  const capabilities = {
    browserName: 'chrome'
  };
  const httpClient = new HttpClient('http://127.0.0.1:4444/wd/hub');
  const executor = new Executor(httpClient);
  const session = new Session(sessionId, capabilities);
    
  return new WebDriver(session, executor);
};

const WEBDRIVER = {
  staticFunctions: [
    'createSession',
  ],

  instanceFunctions: [
    'actions',
    'close',
    'executeAsyncScript',
    'findElement',
    'findElements', 
    'get',
    'getAllWindowHandles',
    'getCapabilities',
    'getCurrentUrl',
    'getPageSource',
    'getSession',
    'getTitle',
    'getWindowHandle',
    'manage',
    'navigate',
    'quit',
    'sleep',
    'switchTo',
    'takeScreenshot',
    'wait',
  ],
};

describe('browser', () => {
  describe('driver', () => {
    it('should have a static functions', () => {
      for (const pos in WEBDRIVER.staticFunctions) {
        const staticFunc = WEBDRIVER.staticFunctions[pos];
        if (typeof WebDriver[staticFunc] !== 'function') {
          log.error(`requires review: ${staticFunc}`);
        }
        expect(typeof WebDriver[staticFunc] === 'function').toBe(true);
      }
    });
  
    it('should have instance functions', () => {
      const webdriver = getWebDriver();
      for (const pos in WEBDRIVER.instanceFunctions) {
        const instanceFunc = WEBDRIVER.instanceFunctions[pos];
        if (typeof webdriver[instanceFunc] !== 'function') {
          log.error(`requires review: ${instanceFunc}`);
        }
        expect(typeof webdriver[instanceFunc] == 'function').toBe(true);
      }
    });
  });
});