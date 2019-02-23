import { Browser } from '../browser';
import { buildElement } from './index';

describe('buildElement', () => {
  let browser: Browser;
  beforeAll(() => {
    browser = new Browser({
      seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
      seleniumSessionId: '12345'
    });
  });

  it('should build element function', () => {
    const element = buildElement(browser.driver);
    expect(typeof element).toBe('function');
  });

  it('should build element function', () => {
    let element = buildElement(browser.driver);
    expect(typeof element.all).toBe('function');
  });
});