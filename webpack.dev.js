import webpack                      from 'webpack';
import assign                       from 'object-assign';
import webpackDevMiddleware         from 'webpack-dev-middleware';
import webpackHotMiddleware         from 'webpack-hot-middleware';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import prodCfg                      from './webpack.prod.config.js';
import WebpackIsomorphicToolsConfig from './webpack-isomorphic-tools';

Object.assign = assign;

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(WebpackIsomorphicToolsConfig);

export default function(app) {
  const config = Object.assign(prodCfg, {
    devtool: 'cheap-module-source-map',
    entry:   [
      'webpack-hot-middleware/client',
      './client'
    ],
    module: {
      loaders: [
        { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' },
         {
          test:    /.*\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack'
          ]
        },
        {
          test:    /\.jsx?$/,
          exclude: /node_modules/,
          loader:  'babel',
          query:   {
            presets: ['react-hmre']
          }
        }
      ]
    },
    imageWebpackLoader: {
      pngquant: {
        quality: '65-90',
        speed:   4
      },
      svgo: {
        plugins: [
          {
            removeViewBox: false
          },
          {
            removeEmptyAttrs: false
          }
        ]
      }
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      webpackIsomorphicToolsPlugin.development()
    ],
  });

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true }));
  app.use(webpackHotMiddleware(compiler));
}