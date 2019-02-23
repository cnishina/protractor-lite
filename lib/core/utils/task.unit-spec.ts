import { WebDriver } from 'selenium-webdriver';
import { executeLocal, executeClientSide } from './task';
import { SharedResults, Task } from './task_options';

describe('action_hooks', () => {
  describe('executeLocal', () => {
    it('should', async () => {
      let val = 0;
      const task: Task = {
        local: [
          (sharedResults: SharedResults) => {
            val++;
            sharedResults['value'] = val;
          },
          () => { val++ }
        ]
      };
  
      const sharedResults: SharedResults = {};
      await executeLocal(task, sharedResults);
      expect (val).toBe(2);
      expect (sharedResults['value']).toBe(1);
    });
  });

  describe('executeClientSide', () => {
    it('should', async () => {
      let val = 0;
      const task: Task = {
        browser: [
          {
            func: () => { val++ }
          }, {
            func: () => { val++ }
          }
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
      await executeClientSide(task, driver);
      expect (val).toBe(2);
    });
  });
});