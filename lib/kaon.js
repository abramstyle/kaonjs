const bootstrap = require('./bootstrap');
const builder = require('./builder');

class Kaon {
  constructor(config) {
    this.config = config;
  }

  start() {
    return bootstrap(this.config);
  }

  build() {
    return builder(this.config);
  }
}

module.exports = Kaon;
