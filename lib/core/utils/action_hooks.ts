import * as loglevel from 'loglevel';
import { WebDriver, WebElement } from 'selenium-webdriver';
import { ActionOptions, Hook }  from './action_options';

const log = loglevel.getLogger('protractor');

/**
 * Executes the command that are local.
 * @param hook
 */
export async function executeLocal(hook: Hook): Promise<void> {
  if (hook.local) {
    for (let func of hook.local) {
      await func();
    }
  }
}

/**
 * Executes the command on the browser.
 * @param driver The WebDriver object.
 * @param hook 
 */
export async function executeClientSide(driver: WebDriver,
    hook: Hook): Promise<void> {
  if (hook.browser) {
    for (let func of hook.browser) {
      await driver.executeScript(func);
    }
  }
}

export async function executeBefore(driver: WebDriver, hook: Hook
    ): Promise<void> {
  await executeLocal(hook);
  await executeClientSide(driver, hook);
}

export async function executeAfter(driver: WebDriver, hook: Hook
    ): Promise<void> {
  await executeClientSide(driver, hook);
  await executeLocal(hook);
}

/**
 * Runs an action with options.
 * @param action The action function to execute that returns a Promise T.
 * @param actionOptions The options for retries, before and after hooks.
 * @param webElementOrWebDriver The WebDriver or WebElement object.
 * @return A promise to the return type of the action.
 */
export async function runAction<T>(action: () => Promise<T>,
    actionOptions: ActionOptions,
    webElementOrWebDriver: WebDriver|WebElement|Promise<WebDriver|WebElement>
    ): Promise<T> {
  let driver: WebDriver;
  const awaitedWebElementOrWebDriver = await webElementOrWebDriver;
  if (awaitedWebElementOrWebDriver instanceof WebElement) {
    driver = await awaitedWebElementOrWebDriver.getDriver();
  } else {
    driver = awaitedWebElementOrWebDriver;
  }
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