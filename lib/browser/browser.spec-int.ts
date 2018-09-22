// import * as log from 'loglevel';
// import * as os from 'os';
// import * as path from 'path';
// import * as wdm from 'webdriver-manager-replacement';
// import {Browser} from './browser';
// import {requestBody} from '../../spec/support/http_utils';

// log.setLevel('info');

// describe('browser', () => {
//   const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
//   const capabilities = {
//     browserName: 'chrome',
//     chromeOptions: {
//       args: ['--headless', '--disable-gpu']
//     },
//   };

//   beforeAll(() => {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
//   });
//   const tempDir = path.resolve(os.tmpdir(), 'test');
//   const options: wdm.Options = {
//     browserDrivers: [{name: 'chromedriver'}],
//     server: {
//       name: 'selenium',
//       runAsDetach: true,
//       runAsNode: true,
//       port: 4445
//     },
//     outDir: tempDir
//   }

//   afterAll(() => {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
//   });

//   describe('start and stop', () => {
//     beforeAll(async() => {
//       await wdm.update(options);
//       await wdm.start(options);
//     });
  
//     afterAll(async() => {
//       await wdm.shutdown(options);
//     });
  
//     let browser = new Browser({capabilities});
//     let wdSessions = 'http://127.0.0.1:4445/wd/hub/sessions';

//     it('should start a browser session', async() => {
//       let body = await requestBody(wdSessions, {});
//       expect(JSON.parse(body)['value'].length).toBe(0);

//       await browser.start();

//       body = await requestBody(wdSessions, {});
//       expect(JSON.parse(body)['value'].length).toBe(1);
//     });

//     it('should stop a browser', async() => {
//       let body = await requestBody(wdSessions, {});
//       expect(JSON.parse(body)['value'].length).toBe(1);

//       await browser.quit();

//       body = await requestBody(wdSessions, {});
//       expect(JSON.parse(body)['value'].length).toBe(0);
//     });
//   });
// });