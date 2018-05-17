/**
 * @file Default config. Options specified in project specific config files will
 *       overwrite the ones defined here. In essence, this file simply lays out
 *       the default options.
 */

module.exports = {
  // Default locale to use. This is only used if there is more than one
  // locale file in your config.
  defaultLocale: `en`,

  // @see {@link https://router.vuejs.org/en/api/options.html#mode}
  routerMode: `history`,

  // Specifies whether the Vue compiler is bundled into the built files.
  // @see {@link https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only}
  bundleCompiler: false,

  // Path to copy static assets to. This path is relative to the output
  // directory.
  staticPath: ``,

  // File glob patterns to ignore when copying static assets.
  staticIgnorePatterns: [`.*`],

  // Define variables to populate the `process.env` namespace in compile time.
  env: undefined,

  // Config options specific to the `build` task.
  build: {
    // Root path of the site. If serving from a subdirectory called `foo`, set
    // this to `/foo/`.
    rootPath: `/`,

    // Public path of assets. You might want to change this to `./` when you
    // want to serve local files, such as in a Cordova app.
    publicPath: `/`,

    // Specifies whether JS and CSS sourcemaps are enabled. Be aware that CSS
    // source maps are buggy in Chrome dev tools.
    sourceMap: false,

    // Specifies whether the linter should run.
    linter: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: false,

    // Specifies whether prerendering is enabled. If `true`, paths to prerender
    // will be automatically inferred based on the routes and locales. If
    // `false`, prerendering will be disabled altogether. To manually specify
    // your own paths to prerender, simply provide an array of paths instead of
    // a boolean.
    prerender: true,

    // Specifies whether the prerenderer should ignore JS errors. This is hacky.
    // Use with caution.
    prerenderQuietly: false,

    // Specifies whether assets should be gzipped. You might want to skip this
    // if your web host already does it.
    gzip: false,

    // The extensions of the files to gzip, if enabled.
    gzipExtensions: [`js`, `css`]
  },

  // Config options specific to the `dev` task.
  dev: {
    // Root path of the site. If serving from a subdirectory called `foo`, set
    // this to `/foo/`. In dev you almost always don't need to change this.
    rootPath: `/`,

    // Public path of assets. You almost always don't need to change this.
    publicPath: `/`,

    // Specifies whether JS and CSS sourcemaps are enabled. Be aware that CSS
    // source maps are buggy in Chrome dev tools.
    sourceMap: false,

    // Specifies whether the linter should run.
    linter: false,

    // Specifies the port of the dev server.
    port: 8080,

    // Specifies whether the browser should automatically open when the dev
    // server is live.
    autoOpenBrowser: true
  }
};
