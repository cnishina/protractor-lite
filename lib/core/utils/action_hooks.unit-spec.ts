import { WebDriver } from 'selenium-webdriver';
import { executeLocal, executeClientSide } from './action_hooks';
import { Hook } from './action_options';

describe('action_hooks', () => {
  describe('executeLocal', () => {
    it('should', async () => {
      let val = 0;
      const hook: Hook = {
        local: [
          () => { val++ },
          () => { val++ }
        ]
      };
  
      await executeLocal(hook);
      expect (val).toBe(2);
    });
  });

  describe('executeClientSide', () => {
    it('should', async () => {
      let val = 0;
      const hook: Hook = {
        browser: [
          () => { val++ },
          () => { val++ }
        ]
      };
      class MockDriver extends WebDriver {
        async executeScript<T>(func: Function|string,
            ...args: any[]): Promise<T> {
          let t: T = null;
          if (typeof func === 'string') {
          } else {
            func();
          }
          return t;
        }
      }
      const driver = new MockDriver(null, null);
      await executeClientSide(driver, hook);
      expect (val).toBe(2);
    });
  });
});