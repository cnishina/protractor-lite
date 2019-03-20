/**
 * Generic actions for interacting with the Pantheon UI in integration tests.
 * Every action will automatically wait for the relevant elements to be
 * in view and capable of interaction, and will retry upon failure.
 *
 * Examples of usage:
 *    see('Sandwich Order Form');
 *    under('Cheese').see('Provelone');
 *    under('Cheese').not.see('American');
 *    click('Order Sandwich');
 */
import { WebDriver, WebElement } from 'selenium-webdriver';

import { BrowserSideOptions, retryingFind } from './find';
import { FlexibleLocator, Position, PositionalLocator } from './locator_types';
import { log } from '../utils/log';

const FIND_TIMEOUT = 6 * 1000;
const SLOW_FIND_TIMEOUT = 90 * 1000;
const AGONIZINGLY_SLOW_FIND_TIMEOUT = 10 * 60 * 1000;
const PAGE_LOAD_TIMEOUT = 60 * 1000;

interface Timing {
  description: string;
  timeout: number;
}

/**
 * An enum declaring how slow a test should be.
 * Don't use this directly.
 */
export enum Slowness {
  REGULAR,
  SLOW,
  AGONIZINGLY_SLOW,
}

/**
 * Map between slowness and what that actually means.
 */
const SLOWNESS_MAP = new Map<Slowness, Timing>([
  [Slowness.REGULAR, {description: '', timeout: FIND_TIMEOUT}],
  [Slowness.SLOW, {description: 'slow.', timeout: SLOW_FIND_TIMEOUT}],
  [
    Slowness.AGONIZINGLY_SLOW, {
      description: 'agonizinglySlow.',
      timeout: AGONIZINGLY_SLOW_FIND_TIMEOUT
    }
  ]
]);

/**
 * Information necessary to determine how to find an element.
 */
export class ActionContext {
  static default(driver: WebDriver) {
    return new ActionContext([], Slowness.REGULAR, false, driver);
  }

  get driver(): WebDriver {
    return this._driver;
  }

  private constructor(
      readonly locators: ReadonlyArray<PositionalLocator>,
      readonly slow: Slowness, readonly wantZero: boolean,
      protected readonly _driver) {}

  addLocator(position: Position, locator: FlexibleLocator): ActionContext {
    const newLocators = [...this.locators, {position, locator}];

    return new ActionContext(
      newLocators, this.slow, this.wantZero, this._driver);
  }

  setSlow(newSlow: Slowness) {
    return new ActionContext(
      this.locators, newSlow, this.wantZero, this._driver);
  }

  setNot(newNot: boolean) {
    return new ActionContext(
      this.locators, this.slow, newNot, this._driver);
  }
}

/**
 * A ChainedAction captures information on how to interact with the page
 * under test. The class contain modifier methods, e.g. leftOf and below,
 * which return a new ChainedAction with additional context. It also contains
 * action methods, e.g. see and click, which perform the action and complete
 * the chain.
 */
export class ChainedAction {
  // ActionContext is treated as immutable so that we can reuse chained actions.
  constructor(private readonly context: ActionContext) {
    this.not = {see: this.notSee.bind(this)};
  }

  not: {see: Function};

  /**
   * Specify that the element to be found must be rendered below AND in the same
   * vertical space as the element found by this locator.
   */
  under(locator: FlexibleLocator): ChainedAction {
    return new ChainedAction(this.context.addLocator(Position.UNDER, locator));
  }

  /**
   * Specify that the element to be found must be rendered below the element
   * found by this locator.
   */
  below(locator: FlexibleLocator): ChainedAction {
    return new ChainedAction(this.context.addLocator(Position.BELOW, locator));
  }

  /**
   * Specify that the element to be found must be rendered inside the element
   * found by this locator.
   */
  inside(locator: FlexibleLocator): ChainedAction {
    return new ChainedAction(this.context.addLocator(Position.INSIDE, locator));
  }

  /**
   * Specify that the element to be found must rendered to the right of the
   * element found by this locator.
   */
  rightOf(locator: FlexibleLocator): ChainedAction {
    return new ChainedAction(
        this.context.addLocator(Position.RIGHTOF, locator));
  }

  /**
   * Specify that the element to be found must be rendered to the left of the
   * element found by the locator.
   */
  leftOf(locator: FlexibleLocator): ChainedAction {
    return new ChainedAction(this.context.addLocator(Position.LEFTOF, locator));
  }

  private notSee(locator: FlexibleLocator, options?: BrowserSideOptions):
      Promise<boolean> {
    return new ChainedAction(this.context.setNot(true)).see(locator, options);
  }

  private description(): string {
    let text = '';
    text += (this.context.wantZero ? 'not.' : '');
    text += SLOWNESS_MAP.get(this.context.slow)!.description;
    for (const modifier of this.context.locators) {
      text += `${modifier.position}(${this.pretty(modifier.locator)}).`;
    }
    return text;
  }

  private pretty(loc: FlexibleLocator): string {
    if (typeof (loc) === 'string') {
      return `"${loc}"`;
    } else {
      return loc.toString();
    }
  }

  private timeout(): number {
    return SLOWNESS_MAP.get(this.context.slow)!.timeout;
  }

  private async getElement(locator: FlexibleLocator, description: string):
      Promise<WebElement> {
    const response = await retryingFind(
        this.context.addLocator(Position.GLOBAL, locator).locators,
        this.timeout(), description, {allowUnseen: true}, this.context.driver);
    if (response === true) {
      throw new Error(
          'An element is expected, but the client side script did ' +
          'not return an element. This should never happen.');
    }

    return response as WebElement;
  }

  /**
   * Returns a WebElement from the given locator and satisfying the
   * current context, or null if no element was found.
   * Only use this method if you need to use the returned WebElement, otherwise
   * prefer `see`.
   * Note that this method, unlike other actions, does not throw if the element
   * is not found.
   */
  async find(locator: FlexibleLocator):
      Promise<WebElement|null> {
    const description = `${this.description()}find(${this.pretty(locator)})`;
    log.info(description);

    try {
      return await this.getElement(locator, description);
    } catch (e) {
      if (e.message.startsWith(`Failed to find ${description}`)) {
        return null;
      }
      throw e;
    }
  }

  /**
   * Returns true if an element with the given locator and satisfying the
   * current context exists. Throws an error if an element cannot be found.
   */
  async see(locator: FlexibleLocator, options?: BrowserSideOptions):
      Promise<boolean> {
    const descriptionArgs = options ?
        `${this.pretty(locator)}, ${JSON.stringify(options)}` :
        this.pretty(locator);
    const description = `${this.description()}see(${descriptionArgs})`;
    log.info(description);

    const findOptions =
        Object.assign({wantZero: this.context.wantZero}, options);

    const response = await retryingFind(
        this.context.addLocator(Position.GLOBAL, locator).locators,
        this.timeout(), description, findOptions, this.context.driver);
    return !!response;
  }

  /**
   * Finds and clicks on the first element with the given locator and satisfying
   * the current context. Throws an error if an element cannot be found.
   */
  async click(locator: FlexibleLocator) {
    const description = `${this.description()}click(${this.pretty(locator)})`;
    log.info(description);

    const response = await this.getElement(locator, description);
    try {
      await response.click();
    } catch (e) {
      // If the error is due to something masked by an <input>, click on that
      // location on the page anyway. This allows us to click on <input>
      // elements using Material components which hide the label under the
      // <input>.
      if (/Other element would receive the click/.test(e.message) &&
          /mat-input-element/.test(e.message)) {
        console.log(`Input element is blocking the click - retrying with
                     specific coordinates`);
        // TODO(ralphj): We should be able to use the shorthand below,
        // but a bug in webdriver bindings causes issues with this and the
        // control flow:
        //   await browser.actions().click(response).perform();
        await this.context.driver.actions().mouseMove(response).perform();
        await this.context.driver.actions().click().perform();
      } else {
        throw e;
      }
    }
  }

  /**
   * Do a long press on the first element with the given locator and satisfying
   * the current context. Throws an error if the element cannot be found.
   * This function is used in mobile testing with simulated mobile device.
   */
  async longPress(locator: FlexibleLocator) {
    const description =
        `${this.description()}longPress(${this.pretty(locator)})`;
    log.info(description);

    const element = await this.getElement(locator, description);

    // Chrome dev tools will show context menu on long press, which does not
    // happen on real mobile device. Disable the context menu.
    // https://stackoverflow.com/questions/41060472/how-to-disable-the-context-menu-on-long-press-when-using-device-mode-in-chrome
    await this.context.driver.executeScript(`
      window.pantheonTestOriginalOnContextMenuHandler = window.oncontextmenu;
      window.oncontextmenu = () => false;
    `);
    await this.context.driver.touchActions().longPress(element).perform();
    await this.context.driver.executeScript(`
      window.oncontextmenu = window.pantheonTestOriginalOnContextMenuHandler;
      delete window.pantheonTestOriginalOnContextMenuHandler;
    `);
  }

  /**
   * Taps on the first element with the given locator and satisfying
   * the current context. Throws an error if the element cannot be found.
   * This function is used in mobile testing with simulated mobile device.
   */
  async tap(locator: FlexibleLocator) {
    const description = `${this.description()}tap(${this.pretty(locator)})`;
    log.info(description);

    const element = await this.getElement(locator, description);
    await this.context.driver.touchActions().tap(element).perform();
  }
}

/**
 * Types text into the browser (into the currently active element).
 *
 * Usage:
 *   below('Description').click(by.css('textarea'));
 *   type('some text');
 */
export async function type(text: string) {
  const description = `type(${text})`;
  log.info(description);
  const element = await this.context.driver.switchTo().activeElement();
  await element.sendKeys(text);
}

/**
 * Navigate to a page in Pantheon.
 * Usage:
 *   go('/compute/instances');
 *   go('/start?tutorial=quickstart');
 */
export async function go(path: string): Promise<void> {
  log.info(`go(${path})`);
  await this.context.driver.get(path, PAGE_LOAD_TIMEOUT);
}