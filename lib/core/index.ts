import { Browser, BrowserConfig } from './browser';
import { By } from './by';
import { buildElementHelper } from './element';

export { BrowserConfig } from './browser';

/**
 * Builds the objects for protractor that use the same selenium browser session.
 * @param config A configuration object with a capabilities property.
 */
export function build(config: BrowserConfig) {
  const browser = new Browser(config);
  const by = new By();
  const element = buildElementHelper(browser);
  return {
    browser,
    by,
    element
  };
}

