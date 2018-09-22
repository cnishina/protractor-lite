import * as os from 'os';
import * as path from 'path';
import * as wdm from 'webdriver-manager-replacement';


const tempDir = path.resolve(os.tmpdir(), 'test');
export const options: wdm.Options = {
  browserDrivers: [{name: 'chromedriver'}],
  server: {
    name: 'selenium',
    runAsDetach: true,
    runAsNode: true
  },
  outDir: tempDir
};

wdm.update(options).then(() => {});