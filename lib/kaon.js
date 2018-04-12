const dotenv = require('dotenv');
const Promise = require('bluebird');

const envHelper = require('../utils/env');
const bootstrap = require('./bootstrap');
const builder = require('./builder');
const { processConfig } = require('../utils');
const { version } = require('../package.json');
const { colors } = require('./ui');
const { debugConfig: debug } = require('./debug');
const { inspect } = require('util');


global.Promise = Promise;

envHelper.config();
dotenv.config();

class Kaon {
  constructor(config) {
    console.log('%s v%s', colors.doing('Kaonjs'), version);

    debug('kaon config:');
    debug(inspect(config, { colors: true, depth: null }));
    this.config = processConfig(config);
    let enableSSR = this.config.renderer.ssr;

    if (process.env.ENABLE_SSR === 'no') {
      enableSSR = false;
    }
    global.__SSR__ = enableSSR;

    this.addStopListener();
  }

  start() {
    this.closer = bootstrap(this.config);
  }

  build() {
    return builder(this.config);
  }

  addStopListener() {
    ['SIGUSR2', 'SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
      process.once(sig, this.stop.bind(this));
    });
  }

  stop() {
    if (typeof this.closer === 'function') {
      this.closer();
    } else {
      process.exit();
    }
  }
}

module.exports = Kaon;
