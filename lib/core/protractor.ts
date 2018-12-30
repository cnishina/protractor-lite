import {Browser} from './browser';
import {buildElementHelper} from './element';

/**
 * Builds the objects for protractor that use the same selenium browser session.
 * @param config A configuration object with a capabilities property.
 */
export function build(config) {
  let browser = new Browser(config);
  let element = buildElementHelper(browser);
  return {
    browser,
    element
  };
}

