import { By } from 'selenium-webdriver';

/**
 * Explicitly define webdriver.By.
 *
 * We do this because we want to inherit the static methods of webdriver.By,
 * as opposed to inheriting from the webdriver.By class itself, which is
 * actually analogous to ProtractorLocator.
 */
export class WebDriverBy {
  className: (className: string) => By = By.className;
  css: (css: string) => By = By.css;
  id: (id: string) => By = By.id;
  linkText: (linkText: string) => By = By.linkText;
  js: (js: string|Function, ...var_args: any[]) => By = By.js;
  name: (name: string) => By = By.name;
  partialLinkText: (partialText: string) => By = By.partialLinkText;
  tagName: (tagName: string) => By = By.tagName;
  xpath: (xpath: string) => By = By.xpath;
}