require('dotenv').config();
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const getConfig = (config) => {
  const serverHost = config.build.host || '0.0.0.0';
  const serverPort = config.build.port || 1592;

  return {
  // mode: 'development',
    entry: {
      app: [
        'react-hot-loader/patch',
        // support async & await
        'babel-polyfill',
        config.isomorphic.main,
      ],
      commons: [
        'react',
        'redux',
        'react-redux',
        'react-dom',
        'isomorphic-fetch',
        'classnames',
        'react-router',
        'react-router-config',
        'react-router-dom',
        'react-helmet',
        'react-loadable',
        'immutable',
        '@abramstyle/redux-api',
      ],
    },
    output: {
      filename: '[name].js',
      // the output bundle

      path: config.build.path,

      publicPath: `http://${serverHost}:${serverPort}/`,
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

      publicPath: `http://${serverHost}:${serverPort}/`,
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
        test: /\.pug/,
        use: [{
          loader: 'pug-loader',
        }],
      }, {
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
        // Write only files that have ".css" extension.
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

      new ReactLoadablePlugin({
        filename: `${config.build.path}/react-loadable.json`,
      }),
      new webpack.DefinePlugin({
        'process.env.APP_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.API_HOST': JSON.stringify(process.env.API_HOST),
      }),
    // new HtmlWebpackPlugin({ // Also generate a test.html
    //   template: './src/index.pug',
    //   filename: 'index.html',
    // }),
    ],
  };
};

module.exports = getConfig;
