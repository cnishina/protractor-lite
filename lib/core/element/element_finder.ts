import { WebElement } from 'selenium-webdriver';
import { Browser } from '../browser';
import { GetWebElements } from './get_web_elements';
import { isProtractorLocator, Locator } from '../by/locator';
import { ActionOptions, Rectangle, runAction } from '../utils';

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

  constructor(private _browser: Browser, private _locator: Locator,
    private _getWebElements: GetWebElements) {
  }

  /**
   * Clears the text from an input or textarea web element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to this object.
   */
  async clear(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<ElementFinder> {
    const action = async (): Promise<void> => {
      const webElement = await this.getWebElement();
      await webElement.clear();
    };
    await runAction(action, actionOptions, this._browser);
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
      const webElement = await this.getWebElement();
      await webElement.click();
    };
    await runAction(action, actionOptions, this._browser);
    return this;
  }

  /**
   * The count of web elements.
   * @return A promise of the number of elements matching the locator.
   */
  async count(): Promise<number> {
    try {
      const webElements = await this._getWebElements();
      return webElements.length;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Compares an element to this one for equality.
   * @param webElement The element to compare to.
   * @return A promise that will be resolved if they are equal.
   */
  async equals(webElement: ElementFinder | WebElement): Promise<boolean> {
    const a = await this.getWebElement();
    const b = (webElement['getWebElement']) ?
      await (webElement as ElementFinder).getWebElement() :
      webElement as WebElement;
    return this._browser.execute<boolean>(
      'return arguments[0] === arguments[1]', a, b);
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
      const webElement = await this.getWebElement();
      return webElement.getAttribute(attributeName);
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Retrieves the value of a computed style property for this instance.
   * @param cssStyleProperty The name of the CSS style property to look up.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise that will be resolved with the requested CSS value.
   */
  getCssValue(cssStyleProperty: string,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      const webElement = await this.getWebElement();
      return webElement.getCssValue(cssStyleProperty);
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Returns an object describing an element's location, in pixels relative to
   * the document element, and the element's size in pixels.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A rectangle.
   */
  getRect(actionOptions: ActionOptions = ACTION_OPTIONS): Promise<Rectangle> {
    const action = async (): Promise<Rectangle> => {
      const webElement = await this.getWebElement();
      return (webElement as any).getRect();
    }
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Gets the tag name of the web element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the tag name.
   */
  getTagName(actionOptions: ActionOptions = ACTION_OPTIONS): Promise<string> {
    const action = async (): Promise<string> => {
      const webElement = await this.getWebElement();
      return webElement.getTagName();
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Gets the text contents from the html tag.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to the text.
   */
  getText(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<string> {
    const action = async (): Promise<string> => {
      const webElement = await this.getWebElement();
      return webElement.getText();
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Returns the WebElement represented by this ElementFinder. This method does
   * not retry. Throws the WebDriver error if the element doesn't exist.
   * @return A promise of the WebElement.
   */
  async getWebElement(): Promise<WebElement> {
    const webElements = await this._getWebElements();
    return webElements[0];
  }

  /**
   * Whether the element is displayed.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is displayed.
   */
  isDisplayed(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElement = await this.getWebElement();
      return webElement.isDisplayed();
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Whether the web element is enabled.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is enabled.
   */
  isEnabled(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElement = await this.getWebElement();
      return webElement.isEnabled();
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Checks if the web element is present.
   * @param actionOptions Optional options for retries and functionHooks.
   */
  isPresent(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      return await this.count() >= 1;
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Whether the element is currently selected.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise if the web element is selected.
   */
  isSelected(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<boolean> {
    const action = async (): Promise<boolean> => {
      const webElement = await this.getWebElement();
      return webElement.isSelected();
    };
    return runAction(action, actionOptions, this._browser);
  }

  /**
   * Send keys to the input field.
   * @param keys
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to this object.
   */
  async sendKeys(keys: string|number,
      actionOptions: ActionOptions = ACTION_OPTIONS): Promise<ElementFinder> {
    const action = async (): Promise<void> => {
      const webElement = await this.getWebElement();
      return webElement.sendKeys(keys);
    };
    await runAction(action, actionOptions, this._browser);
    return this;
  }

  /**
   * Submits the form containing this element.
   * @param actionOptions Optional options for retries and functionHooks.
   * @return A promise to this object.
   */
  async submit(actionOptions: ActionOptions = ACTION_OPTIONS
      ): Promise<ElementFinder> {
    const action = async (): Promise<void> => {
      const webElement = await this.getWebElement();
      return webElement.submit();
    }
    await runAction(action, actionOptions, this._browser);
    return this;
  }
}