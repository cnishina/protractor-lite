import * as log from 'loglevel';
import { By } from 'selenium-webdriver';
import { Browser } from '../browser';
import { elementFinderFactory } from './element_finder';

log.setLevel('info');

describe('element_finder', () => {
  describe('elementFinderFactory', () => {
    it('should create a an elementFinder object', () => {
      const browser = new Browser({
        seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
        seleniumSessionId: '12345'
      });
      const elementFinder = elementFinderFactory(browser, By.css('.foo'));
      expect(elementFinder).not.toBeNull();
      expect(elementFinder.constructor.name).toBe('ElementFinder');
    });
  });
});