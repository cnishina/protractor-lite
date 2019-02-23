const fs = require('fs');
const path = require('path');

const outDir = 'src/assets/';
const e2eFiles = [
  'button-overview/button-overview.e2e-spec.ts',
];
const inDir = 'e2e/src/app/';

const contents = fs.readFileSync(
  path.resolve(inDir, e2eFiles[0]));
let justTest = '';
if (contents) {
  const lines = contents.toString().split('\n');
  for (let line of lines) {
    if (!line.startsWith('import {')) {
      justTest += line + '\n';
    }
  }
}
console.log('here');
console.log(justTest);

try {
fs.mkdirSync(path.resolve(outDir, 'button-overview'));
} catch (err) {}
fs.writeFileSync(path.resolve(outDir, e2eFiles[0]), justTest);
