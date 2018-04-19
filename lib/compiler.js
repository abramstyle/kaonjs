const { objectUtils } = require('@abramstyle/utils');
const webpack = require('webpack');
const Promise = require('bluebird');
const EventsEmitter = require('events');

class Compiler extends EventsEmitter {
  constructor(config) {
    super();

    if (!objectUtils.isObject(config)) {
      throw new TypeError('expect webpack config as an object.');
    }
    this.compiler = webpack(config);
  }

  watch(options = {}) {
    const watchOptions = Object.assign({
      aggregateTimeout: 500,
    }, options);

    this.watching = this.compiler.watch(watchOptions, (err, stats) => {
      const error = stats.compilation.errors.length > 0 ? stats.compilation.errors : err;
      if (error) {
        this.emit('error', error);
      }
      this.emit('compiled', stats);
    });
  }

  run() {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        const error = stats.compilation.errors.length > 0 ? stats.compilation.errors : err;
        if (error) {
          return reject(error);
        }

        return resolve(stats);
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      if (this.watching) {
        this.watching.close(() => resolve());
      }
      return resolve();
    });
  }
}

module.exports = Compiler;
