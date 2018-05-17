/**
 * @file Webpack config for production environment.
 */

const chalk = require(`chalk`);
const log = require(`../utils/log`);
const merge = require(`webpack-merge`);
const path = require(`path`);
const routes = require(`../utils/routes`);
const CopyPlugin = require(`copy-webpack-plugin`);
const HTMLPlugin = require(`html-webpack-plugin`);
const MiniCSSExtractPlugin = require(`mini-css-extract-plugin`);
const OptimizeCSSPlugin = require(`optimize-css-assets-webpack-plugin`);
const SitemapPlugin = require(`sitemap-webpack-plugin`).default;

module.exports = function(config, paths) {
  const baseWebpackConfig = require(`./webpack.base.conf`)(config, paths);

  const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.sourceMap ? `#source-map` : false,
    output: {
      path: path.join(paths.output, config.build.rootPath),
      filename: `[name].[chunkhash].js`,
      sourceMapFilename: `[file].map`
    },
    plugins: [
      new MiniCSSExtractPlugin({ filename: `[name].[chunkhash:8].css` }),
      new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }),
      new HTMLPlugin({
        filename: path.join(paths.output, config.build.rootPath, `index.html`),
        template: path.resolve(paths.input, `index.html`),
        inject: true,
        // For more options, see https://github.com/kangax/html-minifier#options-quick-reference
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        // Necessary to consistently work with multiple chunks via
        // CommonsChunkPlugin.
        chunksSortMode: `dependency`
      }),
      // Copy custom static assets.
      new CopyPlugin([{
        from: paths.static,
        to: config.staticPath,
        ignore: config.staticIgnorePatterns
      }])
    ]
  });

  if (config.build.gzip) {
    const CompressionWebpackPlugin = require(`compression-webpack-plugin`);

    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: `[path].gz[query]`,
        algorithm: `gzip`,
        test: new RegExp(`\\.(` + config.build.productionGzipExtensions.join(`|`) + `)$`),
        threshold: 10240,
        minRatio: 0.8
      })
    );
  }

  // Handle bundle analyzer.
  if (config.build.analyzer) {
    const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  // Handle prerendering.
  // @see https://github.com/chrisvfritz/prerender-spa-plugin/issues/61
  if (config.build.prerender) {
    const PrerenderSpaPlugin = require(`prerender-spa-plugin`);
    const pathsToPrerender = (config.build.prerender instanceof Array) ? config.build.prerender : routes.generate(config, paths).map(route => {
      // Translate `*` to 404 page.
      if (route.path === `*`) return `/404`;
      // Ignore routes with params in it.
      if (~route.path.indexOf(`:`)) return undefined;
      // Return the path of the route.
      return route.path;
    })
      .filter(v => v);

    log.info(`Prerendering paths: ${pathsToPrerender.map(v => chalk.cyan(v)).join(`, `)}...`);

    webpackConfig.plugins.push(new PrerenderSpaPlugin(path.join(paths.output, config.build.rootPath), pathsToPrerender, {
      ignoreJSErrors: config.build.prerenderQuietly,
      postProcessHtml: function(context) {
        return context.html.replace(
          /http:\/\/localhost:[0-9]+/gi, ``
        );
      }
    }));
  }

  // Generate sitemap.
  const baseUrl = require(path.join(paths.base, `package.json`)).homepage;
  const pathsForSitemap = (config.build.prerender instanceof Array) ? config.build.prerender : routes.generate(config, paths).map(route => {
    // Don't generate 404 page.
    if (route.path === `*`) return undefined;
    // Ignore routes with params in it.
    if (~route.path.indexOf(`:`)) return undefined;
    // Return the path of the route.
    return route.path;
  })
    .filter(v => v);

  if (!baseUrl || (baseUrl === ``)) {
    log.warn(`No homepage specified in package.json file, skipping sitemap generation. To enable sitemap generation, set the homepage key in your package.json file. For example: homepage: "https://www.example.com"`);
  }
  else {
    webpackConfig.plugins.push(new SitemapPlugin(baseUrl, pathsForSitemap, {
      skipGzip: true
    }));
  }

  return webpackConfig;
};
