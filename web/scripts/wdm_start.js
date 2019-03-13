const wdm = require('webdriver-manager');

const options = {
  browserDrivers: [{
    name: 'chromedriver',
    version: '73.0.3683.68'
  }],
  server: {
    name: 'selenium',
    runAsNode: true,
    runAsDetach: true
  },
  outDir: 'downloads'
}

async function main() {
  wdm.setLogLevel('INFO');
  await wdm.update(options);
  await wdm.start(options);
}

main().then(() => {});
