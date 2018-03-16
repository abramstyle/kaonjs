#!/usr/bin/env node
const start = require('../scripts/start');
const build = require('../scripts/build');

const r = require('yargs').usage('keon <cmd> [options]')
  .command('start [options]', 'Start keon server!', (yargs) => {
    return yargs.options('config', {
      type: 'string',
      default: 'config',
      describe: 'the config file',
    }).options('port', {
      type: 'string',
      default: 1592,
      describe: 'server port',
    });
  }, (argv) => {
    start(argv);
  })
  .command('build [options]', 'Build static resources.', (yargs) => {
    return yargs.options('config', {
      type: 'string',
      default: 'config',
      describe: 'the config file',
      required: true,
    });
  }, (argv) => {
    build(argv);
  })
  .help()
  .argv;

module.exports = r;
