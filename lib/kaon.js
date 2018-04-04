const bootstrap = require('./bootstrap');
const builder = require('./builder');
const { processConfig } = require('../utils');

class Kaon {
  constructor(config) {
    this.config = processConfig(config);
  }

  start() {
    return bootstrap(this.config);
  }

  build() {
    return builder(this.config);
  }
}

module.exports = Kaon;
