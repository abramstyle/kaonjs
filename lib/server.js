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
    if (this.appPrepareTid) {
      clearTimeout(this.appPrepareTid);
    }

    let routes = null;
    try {
      routes = require(this.options.app.routes);
    } catch (e) {
      debug('routes config found, but load routes failed.');
    }

    this.appPrepareTid = setTimeout(async () => {
      debug('starting app...');
      this.server = await this.app({
        config: this.options,
        routes,
      });
      clearTimeout(this.appPrepareTid);
      debug('app started...');
    }, 500);

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
