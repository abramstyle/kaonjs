const { objectUtils } = require('@abramstyle/utils');
const Promise = require('bluebird');

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
      return this.reload();
    }

    this.start();

    return this;
  }

  async start() {
    let routes = null;
    try {
      routes = require(this.options.app.routes);
    } catch (e) {
      console.warn('routes config found, but load routes failed.');
    }
    this.server = await this.app({
      config: this.options,
      routes,
    });
    return this;
  }

  async reload() {
    console.log('reload server');
    if (this.server) {
      await this.close();
    }

    this.start();

    return this;
  }

  close() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
          this.server = null;
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Server;
