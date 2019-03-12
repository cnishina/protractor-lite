import * as wdm from 'webdriver-manager';

export const options: wdm.Options = {
  browserDrivers: [{name: 'chromedriver'}],
  server: {
    name: 'selenium',
    port: 4444,
    runAsDetach: true,
    runAsNode: true
  },
  outDir: 'downloads'
};