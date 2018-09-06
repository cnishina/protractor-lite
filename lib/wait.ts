export interface WaitFunction {
  (...args): Promise<any>|any;
}

/**
 * The wait strategy dictionary.
 */
export let waitStrategy: {[key:string]: WaitFunction} = {
  waitForAngular
};

/**
 * The wait for angular strategy.
 */
export function waitForAngular(): Promise<any> {
  // TODO(cnishina): Fix this.
  return Promise.resolve();
}

/**
 * Add to the dictionary of wait methods.
 * @param key The wait for strategy name.
 * @param fn The wait function to register to the dictionary.
 */
export function addWaitStrategy(key: string, fn: WaitFunction) {
  waitStrategy[key] = fn;
}

/**
 * Execute the wait strategy using either the default or override values
 * @param defaultWaitStrategy The default value.
 * @param overrideWaitStrategy The value that will override the default value.
 * @returns A promise of the wait method.
 */
export function wait(
    defaultWaitStrategy: string,
    overrideWaitStrategy: string): Promise<any> {
  let strat = '';
  if (defaultWaitStrategy) {
    strat = defaultWaitStrategy;
  }
  if (overrideWaitStrategy) {
    strat = overrideWaitStrategy;
  }
  if (waitStrategy[strat]) {
    let result = waitStrategy[strat]();
    if (result && typeof result.then === 'function') {
      return result;
    } else {
      return Promise.resolve(result);
    }
  }
  return Promise.resolve();
}
