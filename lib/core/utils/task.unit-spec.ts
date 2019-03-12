import { WebDriver } from 'selenium-webdriver';
import { executeLocal, executeClientSide } from './task';
import { Task } from './task_options';

describe('task', () => {
  describe('executeLocal', () => {
    it('should', async () => {
      let val = 0;
      const task: Task = {
        local: [
          () => { val++ },
          () => { val++ }
        ]
      };
  
      await executeLocal(task, {});
      expect (val).toBe(2);
    });
  });

  describe('executeClientSide', () => {
    it('should', async () => {
      let val = 0;
      const task: Task = {
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
      await executeClientSide(task, driver);
      expect (val).toBe(2);
    });
  });
});