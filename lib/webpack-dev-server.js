const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const net = require('net');
const devServerLog = require('../utils/dev-log');
// const addDevServerEntrypoints = require('webpack-dev-server/lib/util/addDevServerEntrypoints');
const createDomain = require('webpack-dev-server/lib/util/createDomain');


const defaultOptions = {
  host: 'localhost',
  progress: false,
  historyApiFallback: true,
  watchOptions: undefined,
  headers: { 'Access-Control-Allow-Origin': '*' },
  hotOnly: false,
  clientLogLevel: 'info',
  port: 1592,
  stats: {
    cached: true,
    cachedAssets: true,
  },
  // noInfo: true,
  inline: true,
};

class DevServer {
  constructor(options) {
    this.options = options;
    this.log = devServerLog(options);
    this.config = Object.assign(defaultOptions, this.options.devServer || {});
    this.addDevServerEntrypoints(this.options, this.config);
    this.compiler = webpack(this.options);
    // console.log('options: ');
    // console.log(require('util').inspect(this.options.entry, { depth: null, colors: true }));
    this.server = new WebpackDevServer(this.compiler, this.config, this.log);
  }

  addDevServerEntrypoints(webpackOptions, devServerOptions, listeningApp) {
    const commonBundleKeys = new Set(['commons', 'vendor', 'manifest']);
    if (devServerOptions.inline !== false) {
    // we're stubbing the app in this method as it's static and doesn't require
    // a listeningApp to be supplied. createDomain requires an app with the
    // address() signature.
      const app = listeningApp || {
        address() {
          return { port: devServerOptions.port };
        },
      };
      const domain = createDomain(devServerOptions, app);
      const devClient = [`${require.resolve('webpack-dev-server/client')}?${domain}`];

      if (devServerOptions.hotOnly) { devClient.push('webpack/hot/only-dev-server'); } else if (devServerOptions.hot) { devClient.push('webpack/hot/dev-server'); }

      const prependDevClient = (entry) => {
        if (typeof entry === 'function') {
          return () => Promise.resolve(entry()).then(prependDevClient);
        }
        if (typeof entry === 'object' && !Array.isArray(entry)) {
          const entryClone = {};
          Object.keys(entry).forEach((key) => {
            if (!commonBundleKeys.has(key)) {
              entryClone[key] = devClient.concat(entry[key]);
              return;
            }
            entryClone[key] = entry[key];
          });
          return entryClone;
        }
        return devClient.concat(entry);
      };

      [].concat(webpackOptions).forEach((wpOpt) => {
        wpOpt.entry = prependDevClient(wpOpt.entry || './src');
      });
    }
  }

  start() {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, this.config.host, () => {
        resolve(this.server.listeningApp);
        this.checkError();
      });
    });
  }

  checkError() {
    this.server.listeningApp.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        const clientSocket = new net.Socket();
        clientSocket.on('error', (clientError) => {
          if (clientError.code === 'ECONNREFUSED') {
          // No other server listening on this socket so it can be safely removed
            fs.unlinkSync(this.config.socket);
            this.server.listen(this.config.socket, this.config.host, (err) => {
              if (err) throw err;
            });
          }
        });
        clientSocket.connect({ path: this.options.socket }, () => {
          throw new Error('This socket is already used');
        });
      }
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      }
    });
  }
}

module.exports = DevServer;
