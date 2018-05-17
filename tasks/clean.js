/**
 * @file Clean task. This task compiles wipes the built files.
 */

const chalk = require(`chalk`);
const del = require(`del`);
const log = require(`../utils/log`);

module.exports = async function(config, paths) {
  log.info(`Cleaning ${chalk.cyan(paths.output)}...`);
  
  try {
    await del([paths.output]);
    log.succeed(`Clean complete`);
  }
  catch (err) {
    console.error(err);
    log.fail(`Clean failed`);
    process.exit(1);
  }
};
