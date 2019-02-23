import { WebDriver } from 'selenium-webdriver';
import { Cookie } from './cookie';

/**
 * Shared results between tasks
 */
export interface SharedResults {
  [key: string]: any;

  // Reserved property names that are used in tasks. ---------------------------

  afterCookies?: Cookie[];
  afterDocumentReadyState?: string;
  afterPageSource?: string;
  afterUrl?: string;
  afterUtcTimestamp?: number; 
  
  beforeCookies?: Cookie[];
  beforeUrl?: string;
  beforeUtcTimestamp?: number;

  retry?: number;
  duration?: number;
  url?: string;
}

/**
 * Function tasks for browser and local execution.
 */
export interface Task {
  /**
   * A string representing a JavaScript function or a function to execute in
   * the browser.
   */
  browser?: Array<{
    func: Function|string;
    args?: any[]
  }>;

  /**
   * A function to execute locally in the node process.
   */
  local?: Array<(sharedResults?: SharedResults, driver?: WebDriver
    ) => Promise<void>|void>;
}

/**
 * Task events for before and after running an action. If there are retries, the
 * before or after might be executed more than once. This will depend on the
 * implementation of the API.
 */
export interface TaskEvents {
  /**
   * Should be executed before an action is executed. The order of execution is
   * from index 0 to the end of the list. If you want something to happen
   * before other tasks, you'll need to unshift the array.
   */
  before?: Task;
  /**
   * Should be executed after an action is executed only after the action
   * successfully runs. The order of execution is from index 0 to the end of the
   * list. If you want something to happen before other tasks, you'll need
   * to unshift the array.
   */
  after?: Task;
}

export interface TaskOptions {
  tasks?: TaskEvents;
  retries?: number;

  /**
   * After running the tasks, throw errors when the retries are complete but
   * the task did not complete.
   */
  validate?: boolean;

  /**
   * There are built in tasks to run checks. Setting this to false will turn off
   * the default validations.
   */
  useDefaults?: boolean;

  writeToFile?: boolean;
}