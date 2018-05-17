#!/usr/bin/env node
/* eslint no-console: 0 */

const chalk = require(`chalk`);
const fs = require(`fs`);
const log = require(`./utils/log`);
const merge = require(`webpack-merge`);
const path = require(`path`);
const program = require(`commander`);
const spawn = require(`./utils/spawn`);
const version = require(`./package.json`).version;

// Root path of the project.
let baseDir = process.cwd();

// Default input CLI command.
let command = ``;

// Default path to the input directory.
let inputDir = `src`;

// Default path to the output directory.
let outputDir = `dist`;

// Default path to the config file.
let configFile = `config/app.conf`;

// Specifies whether the linter (if executed) should attempt fixes.
let shouldLintFix = false;

// Target builder tag.
let builderTag = `1.0.0`;

// Resolve CLI command and options.
function resolveOptions(cmd, options) {
  if (typeof cmd !== undefined) command = cmd;
  if (options.inputDir !== undefined) inputDir = options.inputDir;
  if (options.outputDir !== undefined) outputDir = options.outputDir;
  if (options.configFile !== undefined) configFile = options.configFile;
  if (options.tag) builderTag = `${options.tag}`;
  shouldLintFix = options.fix;
}

// Main process.
async function main() {
  // Resolve config.
  let config = require(`./config/app.conf`);
  let hasConfig = false;

  try {
    const projectConfig = require(path.resolve(baseDir, configFile));
    config = merge.strategy({
      "templateEngine": `replace`,
      "staticIgnorePatterns": `replace`,
      'build.gzipExtensions': `replace`
    })(config, projectConfig);
    hasConfig = true;
  }
  catch (err) {
    // Do nothing.
  }

  // Construct `paths` object to pass resolved paths along the pipeline.
  const paths = {
    base: baseDir,
    input: path.resolve(baseDir, inputDir),
    output: path.resolve(baseDir, outputDir),
    static: path.resolve(baseDir, `static`)
  };

  // Catch unsupported commands.
  const supportedCommands = [`clean`, `build`, `dev`, `lint`, `patch`, `upgrade`, ``];

  if (!~supportedCommands.indexOf(command)) {
    log.error(`Unrecognized command ${chalk.cyan(command)}. Try ${chalk.cyan(`vue-builder --help`)}`);
    process.exit(1);
  }

  // Sanity checks.
  if (!fs.existsSync(paths.input)) {
    log.error(`Input directory ${chalk.cyan(paths.input)} does not exist`);
    process.exit(1);
  }

  log.info(`${chalk.cyan(`v${chalk.cyan(version)}`)}: Using input dir ${chalk.cyan(inputDir)} and ouptut dir ${chalk.cyan(outputDir)}${hasConfig ? `` : ` with default config`}`);

  // Run the builder as per specified command.
  switch (command) {
  case `clean`:
    await require(`./tasks/clean`)(config, paths);
    break;
  case `build`:
    process.env.NODE_ENV = `production`;
    if (config.build.linter) {
      try {
        await require(`./tasks/lint`)(config, paths, false);
      }
      catch (err) {
        console.log(`\n`);
        log.error(`Linter failed`);
        console.log(`\n`);
        process.exit(1);
      }
    }
    await require(`./tasks/clean`)(config, paths);
    await require(`./tasks/build`)(config, paths);
    break;
  case `dev`:
    process.env.NODE_ENV = `development`;
    await require(`./tasks/dev`)(config, paths);
    break;
  case `lint`:
    try {
      await require(`./tasks/lint`)(config, paths, shouldLintFix);
    }
    catch (err) {
      // Do nothing.
    }
    break;
  case `patch`:
    await require(`./tasks/patch`)(config, paths);
    break;
  case `upgrade`:
    // Use Yarn if `yarn.lock` file exists.
    if (fs.existsSync(path.resolve(paths.base, `yarn.lock`))) {
      await spawn(`yarn`, [`remove`, `vue-builder`], { stdio: `inherit` });
      await spawn(`yarn`, [`add`, `git+ssh://git@github.com/andrewscwei/vue-builder.git#${builderTag}`, `--dev`], { stdio: `inherit` });
    }
    else {
      await spawn(`npm`, [`uninstall`, `vue-builder`], { stdio: `inherit` });
      await spawn(`npm`, [`install`, `git+ssh://git@github.com/andrewscwei/vue-builder.git#${builderTag}`, `--save-dev`], { stdio: `inherit` });
    }

    // Patch files when done.
    await require(`./tasks/patch`)(config, paths);

    break;
  default:
    program.help();
  }
}

program
  .version(version)
  .usage(`[options] <command>\n\n` +
         `  where <command> is one of:\n` +
         `    build:  builds the project in production\n` +
         `      dev:  runs the project on a local dev server with hot module reloading\n` +
         `    clean:  wipes the built files\n` +
         `     lint:  lints the input directory\n` +
         `    patch:  patches config files\n` +
         `  upgrade:  upgrades the builder to the latest version`)
  .arguments(`<cmd>`)
  .option(`-c, --config <config>`, `the config file relative to project root`)
  .option(`-i, --inputDir <inputDir>`, `the input directory relative to project root`)
  .option(`-o, --outputDir <outputDir>`, `the output directory relative to project root`)
  .option(`-t, --tag <tag>`, `specifies the builder tag to upgrade to`)
  .option(`-f, --fix`, `specifies whether the linter should automatically fix issues`)
  .action(resolveOptions)
  .parse(process.argv);

main();
