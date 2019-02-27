import { ProtractorBy } from './protractor_by';

describe('protractor_by', () => {
  let protractorBy: ProtractorBy;

  beforeAll(() => {
    protractorBy = new ProtractorBy();
  });

  describe('by button text', () => {
    it('should create a protractor locator', () => {
      let locator = protractorBy.buttonText('search text');
      expect(typeof locator.findElementsOverride).toBe('function');
      expect(typeof locator.toString).toBe('function');
    });
  });

  describe('by css containing text', () => {
    it('should create a protractor locator', () => {
      let locator = protractorBy.cssContainingText('css', 'search text');
      expect(typeof locator.findElementsOverride).toBe('function');
      expect(typeof locator.toString).toBe('function');
    });
  });

  describe('by deep css', () => {
    it('should create a protractor locator', () => {
      let locator = protractorBy.deepCss('css');
      expect(typeof locator.findElementsOverride).toBe('function');
      expect(typeof locator.toString).toBe('function');
    });
  });

  describe('by deep css', () => {
    it('should create a protractor locator', () => {
      let locator = protractorBy.partialButtonText('search text');
      expect(typeof locator.findElementsOverride).toBe('function');
      expect(typeof locator.toString).toBe('function');
    });
  });
});