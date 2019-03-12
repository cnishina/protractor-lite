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
  useDefaults?: boolean;
  validate?: boolean;
}
