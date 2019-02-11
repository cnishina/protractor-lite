import { WebElement } from 'selenium-webdriver';
import { Browser } from '../browser';
import { GetWebElements } from './get_web_elements';
import { isProtractorLocator, Locator } from '../by/locator';
import { ActionOptions, runAction } from '../utils';

export function elementFinderFactory(
    browser: Browser,
    locator: Locator): ElementFinder {
  let getWebElements: GetWebElements = async (): Promise<WebElement[]> => {
    if (isProtractorLocator(locator)) {
      return locator.findElementsOverride(browser.driver, null);
    } else {
      return await browser.driver.findElements(locator);
    }
  }
  return new ElementFinder(browser, locator, getWebElements);
}

const ACTION_OPTIONS: ActionOptions = {
  retries: 1
};

export class ElementFinder {

  constructor(public browser: Browser, public locator: Locator,
    public getWebElements: GetWebElements) {
  }

  /**
   * Clears the text from an input or textarea web element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to this object.
   */
  async clear(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<ElementFinder> {
    const action = async (): Promise<void> => {
      const webElements = await this.getWebElements();
      await webElements[0].clear();
    };
    await runAction(action, actionOptions, this.browser);
    return this;
  }

  /**
   * Clicks on a web element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to this object.
   */
  async click(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<ElementFinder> {
    // Gets the first web element matching the locator and clicks on it.
    const action = async (): Promise<void> => {
      const webElements = await this.getWebElements();
      await webElements[0].click();
    };
    await runAction(action, actionOptions, this.browser);
    return this;
  }

  /**
   * Gets the value of the provided attribute name.
   * @param attributeName The attribute key.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the attribute value.
   */
  getAttribute(attributeName: string,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      const webElements = await this.getWebElements();
      return webElements[0].getAttribute(attributeName);
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Gets the tag name of the web element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the tag name.
   */
  getTagName(actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      const webElements = await this.getWebElements();
      return webElements[0].getTagName();
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Gets the text contents from the html tag.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the text.
   */
  getText(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<string> {
    const action = async (): Promise<string> => {
      const webElements = await this.getWebElements();
      return webElements[0].getText();
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Whether the element is displayed.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is displayed.
   */
  isDisplayed(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElements = await this.getWebElements();
      return webElements[0].isDisplayed();
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Whether the web element is enabled.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is enabled.
   */
  isEnabled(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElements = await this.getWebElements();
      return webElements[0].isEnabled();
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Whether the element is currently selected.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is selected.
   */
  isSelected(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElements = await this.getWebElements();
      return webElements[0].isSelected();
    };
    return runAction(action, actionOptions, this.browser);
  }

  /**
   * Send keys to the input field.
   * @param keys
   * @param waitStrategy
   */
  async sendKeys(keys: string|number,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<ElementFinder> {
    const action = async (): Promise<void> => {
      const webElements = await this.getWebElements();
      return webElements[0].sendKeys(keys);
    };
    await runAction(action, actionOptions, this.browser);
    return this;
  }
}