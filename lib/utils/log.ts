import * as chalk from 'chalk';
import * as loglevel from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';

export const log = loglevel.getLogger('protractor');

const colors = {
  TRACE: chalk.default.magenta,
  DEBUG: chalk.default.cyan,
  INFO: chalk.default.blue,
  WARN: chalk.default.yellow,
  ERROR: chalk.default.red,
};
 

prefix.reg(log);
prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.default.gray, (`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.default.green(`${name}:`)}`;
  },
});
