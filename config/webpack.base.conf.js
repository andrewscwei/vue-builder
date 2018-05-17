/**
 * @file Base Webpack config included in both production and development
 *       environments.
 */

const _ = require(`lodash`);
const chalk = require(`chalk`);
const fs = require(`fs`);
const log = require(`../utils/log`);
const path = require(`path`);
const routes = require(`../utils/routes`);
const webpack = require(`webpack`);
const MiniCSSExtractPlugin = require(`mini-css-extract-plugin`);
const { VueLoaderPlugin } = require(`vue-loader`);

module.exports = function(config, paths) {
  const isProduction = process.env.NODE_ENV === `production`;
  const useSourceMap = isProduction ? config.build.sourceMap : config.dev.sourceMap;
  const generatedRoutes = routes.generate(config, paths);
  const locales = fs.readdirSync(path.resolve(paths.base, `config/locales`))
    .filter(v => !(/(^|\/)\.[^/.]/g).test(v))
    .map(val => path.basename(val, `.json`));

  log.info(`Resolved locales: ${locales.map(v => chalk.cyan(v)).join(`, `)}`);
  log.info(`Resolved routes: ${generatedRoutes.map(route => chalk.cyan(route.path)).join(`, `)}`);

  return {
    mode: isProduction ? `production` : `development`,
    entry: {
      app: path.join(paths.input, `main.js`)
    },
    output: {
      path: paths.output,
      filename: `[name].js`,
      publicPath: isProduction ? config.build.publicPath : config.dev.publicPath
    },
    resolve: {
      extensions: [`.js`, `.vue`, `.json`],
      alias: _({
        '@': paths.input
      })
        .assign(config.bundleCompiler && {
          vue$: `vue/dist/vue.esm.js`
        })
        .value(),
      modules: [
        path.resolve(paths.base, `node_modules`),
        path.resolve(__dirname, `../node_modules`),
        path.resolve(paths.input)
      ]
    },
    module: {
      rules: [{
        test: /\.vue$/,
        loader: `vue-loader`
      }, {
        test: /\.js$/,
        include: [paths.input],
        loader: `babel-loader`,
        options: {
          presets: [`env`],
          plugins: [`transform-object-rest-spread`, `transform-runtime`]
        }
      }, {
        test: /\.(s?css)(\?.*)?$/,
        oneOf: (function() {
          function loaders(modules) {
            return [isProduction ? MiniCSSExtractPlugin.loader : `vue-style-loader`].concat([{
              loader: `css-loader`,
              options: {
                modules: modules,
                importLoaders: 1,
                localIdentName: modules ? `[hash:6]` : undefined,
                minimize: isProduction,
                sourceMap: useSourceMap
              }
            }, {
              loader: `postcss-loader`,
              options: {
                ident: `postcss`,
                sourceMap: useSourceMap,
                browsers: [`last 2 versions`, `ie >= 11`],
                plugins: () => [require(`autoprefixer`)()]
              }
            }, {
              loader: `sass-loader`,
              options: {
                indentedSyntax: false,
                sourceMap: useSourceMap
              }
            }]);
          }

          return [{
            resourceQuery: /module/,
            use: loaders(true)
          }, {
            use: loaders(false)
          }];
        })()
      }, {
        test: /\.html$/,
        use: `vue-html-loader`
      }, {
        test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
        use: `url-loader?limit=10000&name=assets/images/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: `url-loader?limit=10000&name=assets/media/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: `url-loader?limit=10000&name=assets/fonts/[name]${isProduction ? `.[hash:6]` : ``}.[ext]`
      }]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        "$config": JSON.stringify(config),
        "$routes": JSON.stringify(generatedRoutes),
        "$locales": JSON.stringify(locales),
        'process.env': _({
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        })
          .assign(config.env && _.mapValues(config.env, (val) => JSON.stringify(val)))
          .value()
      })
    ]
  };
};
