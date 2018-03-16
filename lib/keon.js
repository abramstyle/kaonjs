const bootstrap = require('./bootstrap');
const build = require('../scripts/build');

class Keon {
  constructor(config) {
    this.config = config;
  }

  start() {
    bootstrap(this.config);
  }

  build() {
    build(this.config);
  }
}

module.exports = Keon;
