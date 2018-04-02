const { objectUtils } = require('@abramstyle/utils');
const Promise = require('bluebird');
const { debugServer: debug } = require('./debug');

class Server {
  constructor(options) {
    this.options = options;
    this.app = require('./app');
  }

  async run(options) {
    if (objectUtils.isObject(options)) {
      this.options = options;
    }

    if (this.server) {
      debug('server esisted, trying to reload...');
      return this.reload();
    }

    debug('server not esisted, trying to start...');
    this.start();

    return this;
  }

  async start() {
    let routes = null;
    try {
      routes = require(this.options.app.routes);
    } catch (e) {
      debug('routes config found, but load routes failed.');
    }

    debug('starting app...');
    this.server = await this.app({
      config: this.options,
      routes,
    });
    debug('app started...');

    return this;
  }

  async reload() {
    if (this.server) {
      await this.close();
    }

    this.start();

    return this;
  }

  close() {
    return new Promise((resolve) => {
      if (this.server) {
        debug('trying to close app...');
        this.server.close(() => {
          this.server = null;
          debug('app closed...');
          resolve();
        });
      } else {
        debug('app is not started, nothing to close.');
        resolve();
      }
    });
  }
}

module.exports = Server;
