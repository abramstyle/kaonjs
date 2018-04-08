require('dotenv').config();
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const { generateCdnPath } = require('../../utils');

const getConfig = (config) => {
  const serverHost = config.build.host || '0.0.0.0';
  const serverPort = config.build.port || 1592;
  return {
  // mode: 'development',
    entry: {
      app: [
        'react-hot-loader/patch',
        // support async & await
        // 'babel-polyfill',
        config.isomorphic.main,
      ],
      commons: [
        'react',
        'redux',
        'react-redux',
        'react-dom',
        'react-router',
        'react-router-dom',
        'react-helmet',
        'react-loadable',
      ],
    },
    output: {
      filename: '[name].js',

      chunkFilename: '[name].chunk.js',

      path: config.build.target,

      publicPath: generateCdnPath(config),
      // necessary for HMR to know where to load the hot update chunks
      sourceMapFilename: '[name].js.map',
    },

    // context: resolve('sources'),

    // devtool: 'eval-source-map',
    devtool: 'cheap-module-source-map',

    devServer: {
      hot: true,
      // enable HMR on the server

      // contentBase: resolve('public/build'),
      // match the output path
      historyApiFallback: true,

      publicPath: generateCdnPath(config),
      // match the output `publicPath`
      headers: {
        'Access-Control-Allow-Origin': '*',
      },

      host: serverHost,
      port: serverPort,
      stats: 'errors-only',
    },

    module: {
      rules: [{
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }],
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
          options: {
            useable: true,
          },
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            config: {
              path: config.postcss.path,
            },
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
        },
      }],
    },

    plugins: [
      new ManifestPlugin(),
      new WriteFilePlugin({
      // Write only files that have ".json" extension.
        test: /\.json/,
        useHashIndex: true,
      }),
      new webpack.HotModuleReplacementPlugin(),
      // enable HMR globally

      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates
      new webpack.optimize.CommonsChunkPlugin({
        names: ['commons', 'manifest'],
        minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          APP_ENV: JSON.stringify(process.env.NODE_ENV),
        },
        __IS_SERVER__: JSON.stringify(false),
        __DEV__: JSON.stringify(__DEV__),
        __STAGING__: JSON.stringify(__STAGING__),
        __RELEASE__: JSON.stringify(__RELEASE__),
        __PROD__: JSON.stringify(__PROD__),
      }),
      new ReactLoadablePlugin({
        filename: `${config.build.target}/react-loadable.json`,
      }),
    // new HtmlWebpackPlugin({ // Also generate a test.html
    //   template: './src/index.pug',
    //   filename: 'index.html',
    // }),
    ],
  };
};

module.exports = getConfig;
