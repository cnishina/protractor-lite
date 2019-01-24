import {Browser} from '../browser';
import {buildElementHelper} from './index';

describe('buildElementHelper', () => {
  let browser: Browser;
  beforeAll(() => {
    browser = new Browser({
      seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
      seleniumSessionId: '12345'
    });
  });

  it('should build element function', () => {
    let element = buildElementHelper(browser);
    expect(typeof element).toBe('function');
  });

  it('should build element function', () => {
    let element = buildElementHelper(browser);
    expect(typeof element.all).toBe('function');
  });
});