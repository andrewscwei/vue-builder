/* globals window */
/**
 * @file Webpack hot middleware client, appended entry files in Webpack config.
 */

require(`eventsource-polyfill`);

const hotClient = require(`webpack-hot-middleware/client?noInfo=true&reload=true`);

hotClient.subscribe(function(event) {
  if (event.action === `reload`) {
    window.location.reload();
  }
});
