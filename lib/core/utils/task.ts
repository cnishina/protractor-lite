import * as loglevel from 'loglevel';
import { WebDriver, WebElement } from 'selenium-webdriver';
import { SharedResults } from './shared_results';
import { TaskOptions, Task }  from './task_options';

const log = loglevel.getLogger('protractor');

/**
 * Executes the command that are local.
 * @param task
 */
export async function executeLocal(task: Task, sharedResults: SharedResults,
    driver?: WebDriver): Promise<void> {
  if (task.local) {
    for (let func of task.local) {
      await func(sharedResults, driver);
    }
  }
}

/**
 * Executes the command on the browser.
 * @param driver The WebDriver object.
 * @param task 
 */
export async function executeClientSide(task: Task,
    driver: WebDriver): Promise<void> {
  if (task.browser) {
    for (let func of task.browser) {
      await driver.executeScript(func);
    }
  }
}

export async function executeBefore(task: Task, sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  await executeLocal(task, sharedResults, driver);
  await executeClientSide(task, driver);
}

export async function executeAfter(task: Task, sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  await executeClientSide(task, driver);
  await executeLocal(task, sharedResults, driver);
}

/**
 * Runs an action with options.
 * @param action The action function to execute that returns a Promise T.
 * @param taskOptions The options for retries, before and after hooks.
 * @param webElementOrWebDriver The WebDriver or WebElement object.
 * @return A promise to the return type of the action.
 */
export async function runAction<T>(action: () => Promise<T>,
    taskOptions: TaskOptions, sharedResults: SharedResults,
    webElementOrWebDriver: WebDriver|WebElement|Promise<WebDriver|WebElement>
    ): Promise<T> {
  let driver: WebDriver;
  const awaitedWebElementOrWebDriver = await webElementOrWebDriver;
  if (awaitedWebElementOrWebDriver instanceof WebElement) {
    driver = await awaitedWebElementOrWebDriver.getDriver();
  } else {
    driver = awaitedWebElementOrWebDriver;
  }
  const tasks = taskOptions.tasks;
  const retries = taskOptions.retries || 1;
  let result = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    if (tasks && tasks.before) {
      try {
        await executeBefore(tasks.before, sharedResults, driver);
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

    if (tasks && tasks.after) {
      try {
        await executeAfter(tasks.after, sharedResults, driver);
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