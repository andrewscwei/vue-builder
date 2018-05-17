/**
 * @file Webpack config for development environment.
 */

const merge = require(`webpack-merge`);
const path = require(`path`);
const webpack = require(`webpack`);
const HTMLPlugin = require(`html-webpack-plugin`);

module.exports = function(config, paths) {
  const shouldLint = config.dev.linter;
  const baseWebpackConfig = require(`./webpack.base.conf`)(config, paths);

  // Add hot-reload related code to entry chunks.
  Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = [path.resolve(__dirname, `../tasks/dev-client`)].concat(baseWebpackConfig.entry[name]);
  });

  return merge(baseWebpackConfig, {
    module: {
      rules: shouldLint ? [{
        test: /\.(js|vue)$/,
        loader: `eslint-loader`,
        enforce: `pre`,
        include: [paths.input],
        options: {
          ignorePath: path.join(paths.base, `.gitignore`),
          formatter: require(`eslint-friendly-formatter`)
        }
      }] : []
    },
    devtool: `#cheap-module-eval-source-map`,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HTMLPlugin({
        filename: `index.html`,
        template: path.resolve(paths.input, `index.html`),
        inject: true
      })
    ]
  });
};
