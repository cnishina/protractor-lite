import { ProtractorBy } from './protractor_by';

describe('protractor_by', () => {
  let protractorBy: ProtractorBy;

  beforeAll(() => {
    protractorBy = new ProtractorBy();
  });

  describe('by button text', () => {
    it('should create a protractor locator', () => {
      let locator = protractorBy.buttonText('foobar');
      expect(typeof locator.findElementsOverride).toBe('function');
    });
  });
});