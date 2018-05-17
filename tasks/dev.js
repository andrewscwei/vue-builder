/**
 * @file Dev task. This task spins up a local dev server with hot module 
 *       reloading enabled.
 */

const express = require(`express`);
const opn = require(`opn`);
const path = require(`path`);
const log = require(`../utils/log`);
const webpack = require(`webpack`);

module.exports = async function(config, paths) {
  const webpackConfig = require(`../config/webpack.dev.conf`)(config, paths);

  // Default port where dev server listens for incoming traffic.
  const port = process.env.PORT || config.dev.port;

  // Automatically open browser, if not set will be false.
  const autoOpenBrowser = !!config.dev.autoOpenBrowser;

  const app = express();
  const compiler = webpack(webpackConfig);
  const devMiddleware = require(`webpack-dev-middleware`)(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    noInfo: true,
    stats: { colors: true }
  });

  const hotMiddleware = require(`webpack-hot-middleware`)(compiler, {
    log: false,
    heartbeat: 2000
  });

  // Force page reload when html-webpack-plugin template changes.
  compiler.plugin(`compilation`, (compilation) => {
    compilation.plugin(`html-webpack-plugin-after-emit`, (data, cb) => {
      hotMiddleware.publish({ action: `reload` });
      cb();
    });
  });

  // Handle fallback for HTML5 history API.
  app.use(require(`connect-history-api-fallback`)());

  // Serve webpack bundle output.
  app.use(devMiddleware);

  // Enable hot-reload and state-preserving compilation error display.
  app.use(hotMiddleware);

  // Serve pure static assets.
  const staticPath = path.posix.join(config.dev.publicPath, config.staticPath);
  app.use(staticPath, express.static(paths.static));

  const uri = `http://localhost:` + port;

  log.info(`Starting dev server...`);

  devMiddleware.waitUntilValid(() => {
    log.info(`Listening at ` + uri + `\n`);
    if (autoOpenBrowser) opn(uri);
  });

  app.listen(port);
};
