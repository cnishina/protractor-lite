import * as chalk from 'chalk';
import * as loglevel from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';

const colors = {
  TRACE: chalk.default.magenta,
  DEBUG: chalk.default.cyan,
  INFO: chalk.default.blue,
  WARN: chalk.default.yellow,
  ERROR: chalk.default.red,
};

prefix.reg(loglevel);
prefix.apply(loglevel, {
  format(level, name, timestamp) {
    return `${chalk.default.gray, (`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.default.green(`${name}:`)}`;
  },
});

export const log = loglevel.getLogger('protractor');