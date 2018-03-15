const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const webpack = require('webpack');
// const WriteFilePlugin = require('write-file-webpack-plugin');

const res = p => path.resolve(__dirname, p);

const nodeModules = res('../../../node_modules');
const entry = res('../isomorphic/server.js');

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
  .readdirSync(nodeModules)
  // .filter(x => !/\.bin|react-loadable/.test(x))
  .reduce((items, mod) => {
    items[mod] = `commonjs ${mod}`;
    return items;
  }, {});

externals['react-dom/server'] = 'commonjs react-dom/server';

const getConfig = config => ({
  name: 'server',
  target: 'node',
  // devtool: 'source-map',
  devtool: 'eval',
  entry: [entry],
  externals,
  output: {
    path: config.build.path,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
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
        NODE_ENV: JSON.stringify('development'),
        API_HOST: JSON.stringify(process.env.API_HOST),
      },
      loadablePath: '../../../build/react-loadable.json',
    }),
  ],
});
module.exports = getConfig;
