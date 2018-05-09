const fs = require('fs');
const path = require('path');
const { generateCdnPath } = require('../../utils');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const webpack = require('webpack');

const getConfig = (config) => {
  const nodeModules = path.resolve(process.cwd(), 'node_modules');
  const entry = path.resolve(__dirname, '../../isomorphic/server.js');
  const externals = fs
    .readdirSync(nodeModules)
    .reduce((items, mod) => {
      if (mod.startsWith('.')) {
        return items;
      } else if (mod.startsWith('@')) {
        const subItems = fs.readdirSync(path.join(nodeModules, mod));
        subItems.forEach((item) => {
          const modName = `${mod}/${item}`;
          items[modName] = `commonjs ${modName}`;
        });
      } else {
        items[mod] = `commonjs ${mod}`;
      }
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
        __IS_SERVER__: JSON.stringify(true),
        __DEV__: JSON.stringify(__DEV__),
        __STAGING__: JSON.stringify(__STAGING__),
        __RELEASE__: JSON.stringify(__RELEASE__),
        __PROD__: JSON.stringify(__PROD__),
      }),
    ],
  };
};
module.exports = getConfig;
