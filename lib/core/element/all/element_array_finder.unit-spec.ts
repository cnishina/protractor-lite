import * as log from 'loglevel';
import {By} from 'selenium-webdriver';
import {Browser} from '../../browser';
import {elementArrayFinderFactory} from './element_array_finder';

log.setLevel('info');

describe('element_array_finder', () => {
  describe('elementArrayFinderFactory', () => {
    it('should create a an elementArrayFinder object', () => {
      const browser = new Browser(); 
      const elementArrayFinder = elementArrayFinderFactory(
        browser, By.css('.foo'));
      expect(elementArrayFinder).not.toBeNull();
      expect(elementArrayFinder.constructor.name).toBe('ElementArrayFinder');
    });
  });
});