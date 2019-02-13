import * as loglevel from 'loglevel';
import { WebDriver, WebElement } from 'selenium-webdriver';

const log = loglevel.getLogger('protractor');

/**
 * Function hooks for browser and local execution.
 */
export interface Hook {
  /**
   * A string representing a JavaScript function or a function to execute in
   * the browser.
   */
  browser?: Array<Function|string>;
  /**
   * A function to execute locally in the node process.
   */
  local?: Array<Function>;
}

/**
 * Function hooks before and after running an action. If there are retries, the
 * before or after might be executed more than once. This will depend on the
 * implementation of the API.
 */
export interface Hooks {
  /**
   * Should be executed before an action is executed.
   */
  before?: Hook;
  /**
   * Should be executed after an action is executed only after the action
   * successfully runs.
   */
  after?: Hook;
}

export interface ActionOptions {
  hooks?: Hooks;
  retries?: number;
}

async function executeLocal(hook: Hook): Promise<void> {
  if (hook.local) {
    for (let func of hook.local) {
      await func();
    }
  }
}

async function executeClientSide(driver: WebDriver|WebElement,
    hook: Hook): Promise<void> {
  if (hook.browser) {
    for (let func of hook.browser) {
      if (driver instanceof WebElement) {
        await driver.getDriver().executeScript(func);
      } else {
        await driver.executeScript(func);
      }
    }
  }
}

async function executeBefore(driver: WebDriver|WebElement, hook: Hook
    ): Promise<void> {
  await executeLocal(hook);
  await executeClientSide(driver, hook);
}

async function executeAfter(driver: WebDriver|WebElement, hook: Hook
    ): Promise<void> {
  await executeClientSide(driver, hook);
  await executeLocal(hook);
}

/**
 * Runs an action with options.
 * @param action The action function to execute that returns a Promise T.
 * @param actionOptions The options for retries, before and after hooks.
 * @return A promise to the return type of the action.
 */
export async function runAction<T>(action: () => Promise<T>,
    actionOptions: ActionOptions,
    driver: WebDriver|WebElement): Promise<T> {
  const hooks = actionOptions.hooks;
  const retries = actionOptions.retries || 1;
  let result = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    if (hooks && hooks.before) {
      try {
        await executeBefore(driver, hooks.before);
      } catch (err) {
        if (attempt !== retries) {
          log.warn('Attempt ${attempt} failed before action.', err);
        } else {
          log.error('Failed to execute the before action.', err);
          throw err;
        }
        continue;
      }
    }
    try {
      result = await action();
    } catch (err) {
      if (attempt !== retries) {
        log.warn('Attempt ${attempt} failed to do action.', err);
      } else {
        log.error('Failed to do the action.', err);
        throw err;
      }
      continue;
    }

    if (hooks && hooks.after) {
      try {
        await executeAfter(driver, hooks.after);
      } catch (err) {
        if (attempt !== retries) {
          log.warn('Attempt ${attempt} failed after action.', err);
        } else {
          log.error('Failed to execute the after action.', err);
          throw err;
        }
        continue;
      }
    }
    // successfully completed the before, action, and after.
    break;
  }
  return result;
}

/**
 * Interface for WebElement rectangles to find the position and dimensions.
 */
export interface Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;
}