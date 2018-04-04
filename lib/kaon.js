const dotenv = require('dotenv');
const Promise = require('bluebird');

const envHelper = require('../utils/env');
const bootstrap = require('./bootstrap');
const builder = require('./builder');
const { processConfig } = require('../utils');


global.Promise = Promise;

envHelper.config();
dotenv.config();

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
