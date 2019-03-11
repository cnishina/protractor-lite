/**
 * Function hooks for browser and local execution.
 */
export interface Task {
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
export interface TaskEvents {
  /**
   * Should be executed before an action is executed.
   */
  before?: Task;
  /**
   * Should be executed after an action is executed only after the action
   * successfully runs.
   */
  after?: Task;
}

export interface TaskOptions {
  tasks?: TaskEvents;
  retries?: number;
}