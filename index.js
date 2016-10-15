'use strict';

require('babel-core/register')({});

var path = require('path');

if (process.env.NODE_ENV !== 'production') {
  var fs = require('fs');
  fs.closeSync(fs.openSync(path.join(__dirname, 'webpack-assets.json'), 'w'));
}

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var projectRoot = path.resolve(__dirname);

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack-isomorphic-tools'))
  .development(process.env.NODE_ENV !== 'production')
  .server(projectRoot, function () {
    var server = require('./server').default;
    var PORT = process.env.PORT || 3000;
    server.listen(PORT, function () {
      console.log('Server listening on: ' + PORT);
    });
  });