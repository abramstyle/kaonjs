const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const net = require('net');
const addEntries = require('webpack-dev-server/lib/utils/addEntries');
const createLogger = require('webpack-dev-server/lib/utils/createLogger');

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
    this.log = createLogger(options);
    this.config = Object.assign(defaultOptions, this.options.devServer || {});
    addEntries(this.options, this.config);
    this.compiler = webpack(this.options);
    this.server = new WebpackDevServer(this.compiler, this.config, this.log);
  }

  start() {
    return new Promise((resolve) => {
      this.compiler.plugin('done', () => {
        resolve();
      });
      this.server.listen(this.config.port, this.config.host, () => {
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
