const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const net = require('net');
const devServerLog = require('../utils/dev-log');
const addDevServerEntrypoints = require('webpack-dev-server/lib/util/addDevServerEntrypoints');


const defaultOptions = {
  hot: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  port: 1592,
  host: 'localhost',
  progress: false,
  watchOptions: undefined,
  hotOnly: false,
  clientLogLevel: 'info',
};

class DevServer {
  constructor(options) {
    this.options = options;
    this.log = devServerLog(options);
    this.config = Object.assign(defaultOptions, this.options.devServer || {});
    addDevServerEntrypoints(this.options, this.config);
    this.compiler = webpack(this.options);
    this.server = new WebpackDevServer(this.compiler, this.config, this.log);
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
