import * as loglevel from 'loglevel';
import { WebDriver, WebElement } from 'selenium-webdriver';
import { SharedResults, TaskOptions, Task }  from './task_options';

const log = loglevel.getLogger('protractor');

/**
 * Executes the command that are local.
 * @param task
 * @param sharedResults Shared results for tasks that execute locally.
 * @param driver The WebDriver object.
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
 * Executes the command on the browser. Does not have access to sharing results.
 * If you need to share results, think about using local.
 * @param task 
 * @param driver The WebDriver object.
 */
export async function executeClientSide(task: Task, 
    driver: WebDriver): Promise<void> {
  if (task.browser) {
    for (let browserTask of task.browser) {
      await driver.executeScript(browserTask.func, browserTask.args);
    }
  }
}

/**
 * Executes tasks before the action. The order is local first then browser.
 * @param task The tasks before the action.
 * @param sharedResults Shared results for tasks that execute locally.
 * @param driver The WebDriver object.
 */
export async function executeBefore(task: Task, sharedResults: SharedResults,
    driver: WebDriver): Promise<void> {
  await executeLocal(task, sharedResults, driver);
  await executeClientSide(task, driver);
}

/**
 * Executes tasks after the action. The order is reverse from the before task.
 * @param task The tasks after the action.
 * @param sharedResults Shared results for tasks that execute locally.
 * @param driver The WebDriver object.
 */
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
 * @param sharedResults The shared results object (mostly for debugging).
 * @return A promise to the return type of the action.
 */
export async function runAction<T>(action: () => Promise<T>,
    taskOptions: TaskOptions,
    webElementOrWebDriver?: WebDriver|WebElement|Promise<WebDriver|WebElement>,
    sharedResults?: SharedResults): Promise<T> {

  let driver: WebDriver = null;
  if (webElementOrWebDriver) {
    const awaitedWebElementOrWebDriver = await webElementOrWebDriver;
    if (awaitedWebElementOrWebDriver instanceof WebElement) {
      driver = await awaitedWebElementOrWebDriver.getDriver();
    } else {
      driver = awaitedWebElementOrWebDriver;
    }
  }
  const tasks = taskOptions.tasks;
  const retries = taskOptions.retries || 1;
  let result = null;

  sharedResults.beforeUtcTimestamp = new Date().getTime();
  for (let attempt = 1; attempt <= retries; attempt++) {
    sharedResults.retry = attempt;
    if (tasks && tasks.before) {
      try {
        await executeBefore(tasks.before, sharedResults, driver);
      } catch (err) {
        if (attempt !== retries) {
          log.warn('Attempt ${attempt} failed before action.', err);
        } else {
          sharedResults.afterUtcTimestamp = new Date().getTime();
          sharedResults.duration =
            sharedResults.afterUtcTimestamp - sharedResults.beforeUtcTimestamp;
          log.error('Failed to execute the before action.', err);
          if (taskOptions.validate) {
            // Only throw errors if we are validating. If we are not, we should
            // just log the error.
            throw err;
          }
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
        sharedResults.afterUtcTimestamp = new Date().getTime();
        sharedResults.duration =
          sharedResults.afterUtcTimestamp - sharedResults.beforeUtcTimestamp;
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
          sharedResults.afterUtcTimestamp = new Date().getTime();
          sharedResults.duration =
            sharedResults.afterUtcTimestamp - sharedResults.beforeUtcTimestamp;
          log.error('Failed to execute the after action.', err);
          if (taskOptions.validate) {
            // Only throw errors if we are validating. If we are not, we should
            // just log the error.
            throw err;
          }
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
 * Since these options is just an interface, initialize objects and create empty
 * arrays.
 * @param taskOptions The task options.
 * @return The initialized task options.
 */
export function taskOptionsInit(taskOptions: TaskOptions): TaskOptions {
  if (!taskOptions) {
    taskOptions = {
      retries: 1,
      useDefaults: true,
      validate: true,
    };
  }
  if (!taskOptions.tasks) {
    taskOptions.tasks = {};
  }
  if (!taskOptions.tasks.before) {
    taskOptions.tasks.before = {};
  }
  if (!taskOptions.tasks.before.browser) {
    taskOptions.tasks.before.browser = [];
  }
  if (!taskOptions.tasks.before.local) {
    taskOptions.tasks.before.local = [];
  }
  if (!taskOptions.tasks.after) {
    taskOptions.tasks.after = {};
  }
  if (!taskOptions.tasks.after.browser) {
    taskOptions.tasks.after.browser = [];
  }
  if (!taskOptions.tasks.after.local) {
    taskOptions.tasks.after.local = [];
  }
  return taskOptions;
}

export function sharedResultsInit(sharedResults: SharedResults): SharedResults {
  if (!sharedResults) {
    sharedResults = {};
  }
  return sharedResults;
}