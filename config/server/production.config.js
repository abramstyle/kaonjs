const fs = require('fs');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { generateCdnPath } = require('../../utils');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const webpack = require('webpack');
// const WriteFilePlugin = require('write-file-webpack-plugin');

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:

const getConfig = (config) => {
  const nodeModules = path.resolve(process.cwd(), 'node_modules');
  const entry = path.resolve(__dirname, '../../isomorphic/server.js');
  const externals = fs
    .readdirSync(nodeModules)
    // .filter(x => !/\.bin|react-loadable/.test(x))
    .reduce((items, mod) => {
      items[mod] = `commonjs ${mod}`;
      return items;
    }, {});

  externals['react-dom/server'] = 'commonjs react-dom/server';

  return {
    name: 'server',
    target: 'node',
    // devtool: 'source-map',
    devtool: 'eval',
    entry: [entry],
    externals,
    output: {
      path: config.build.target,
      publicPath: generateCdnPath(config),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: modulePath => /node_modules/.test(modulePath) && !/node_modules\/kaon/.test(modulePath),
        },
        {
          test: /\.css$/,
          use: [{
            loader: 'css-loader/locals',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }],
        }, {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              minetype: 'application/font-woff',
            },
          },
        }, {
          test: /\.jpe?g$|\.gif$|\.png$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              limit: 10000,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.css', '.styl'],
    },
    plugins: [
    // new WriteFilePlugin(),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          APP_ENV: JSON.stringify(process.env.NODE_ENV),
        },
        __IS_SERVER__: JSON.stringify(true),
        __DEV__: JSON.stringify(__DEV__),
        __STAGING__: JSON.stringify(__STAGING__),
        __RELEASE__: JSON.stringify(__RELEASE__),
        __PROD__: JSON.stringify(__PROD__),
      }),
      new UglifyJSPlugin(),
    ],
  };
};
module.exports = getConfig;
