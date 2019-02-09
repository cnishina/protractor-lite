import { By } from 'selenium-webdriver';
import * as log from 'loglevel';

log.setLevel('debug');

const BY = {
  staticFunctions: [
    'className',
    'css',
    'id',
    'linkText',
    'js',
    'name',
    'partialLinkText',
    'tagName',
    'xpath']
};

describe('webdriver_by', () => {
  it('should have a static functions', () => {
    for (const pos in BY.staticFunctions) {
      const func = BY.staticFunctions[pos];
      if (typeof By[func] !== 'function') {
        log.error(`requires review: ${func}`);
      }
      expect(typeof By[func] === 'function').toBe(true);
    }
  });
});