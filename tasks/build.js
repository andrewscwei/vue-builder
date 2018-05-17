/**
 * @file Build task. This task compiles source files into production-ready
 *       files.
 */

const compile = require(`../utils/compile`);
const del = require(`del`);
const fs = require(`fs`);
const log = require(`../utils/log`);
const path = require(`path`);

module.exports = async function(config, paths) {
  log.info(`Building...`);

  try {
    await compile(require(`../config/webpack.prod.conf`)(config, paths));
    const outputDir = path.join(paths.output, config.build.rootPath);

    // Move the 404 HTML file to the build root.
    if (config.build.prerender && fs.existsSync(path.join(outputDir, `404`, `index.html`))) {
      fs.copyFileSync(path.join(outputDir, `404`, `index.html`), path.join(outputDir, `404.html`));
      await del(path.join(outputDir, `404`));
    }

    log.succeed(`Build complete`);
  }
  catch (err) {
    console.error(err);
    log.fail(`Build failed`);
    process.exit(1);
  }
};
