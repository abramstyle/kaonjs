const bootstrap = require('./bootstrap');
const build = require('../scripts/build');

class Kaon {
  constructor(config) {
    this.config = config;
  }

  start() {
    return bootstrap(this.config);
  }

  build() {
    return build(this.config);
  }
}

module.exports = Kaon;
