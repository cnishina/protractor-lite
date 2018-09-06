import {addWaitStrategy, wait, waitStrategy} from './wait';

describe('wait', () => {
  beforeAll(() => {
    addWaitStrategy('foo', () => {
      console.log('hello foo');
      return Promise.resolve();
    });

    addWaitStrategy('bar', () => {
      console.log('hello bar');
      return Promise.resolve();
    });
  });

  it('should execute the default value foo', async () => {
    spyOn(waitStrategy, 'foo');
    await wait('foo', undefined);
    expect(waitStrategy['foo']).toHaveBeenCalled();
  });

  it('should execute the override value bar', async () => {
    spyOn(waitStrategy, 'bar');
    await wait('foo', 'bar');
    expect(waitStrategy['bar']).toHaveBeenCalled();
  });

  it('should not execute any function', async () => {
    spyOn(waitStrategy, 'foo');
    spyOn(waitStrategy, 'bar');
    await wait(undefined, undefined);
    expect(waitStrategy['foo']).not.toHaveBeenCalled();
    expect(waitStrategy['bar']).not.toHaveBeenCalled();
  });
});