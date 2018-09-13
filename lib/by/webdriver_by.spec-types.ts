import {By} from 'selenium-webdriver';

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
      expect(typeof By[func] == 'function').toBe(true);
    }
  });
});