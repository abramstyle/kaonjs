#!/usr/bin/env node
const start = require('../scripts/start');

const r = require('yargs').usage('cybertron <cmd> [args]')
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
  }, (argv) => {
    console.log('build: ', argv);
  })
  .help()
  .argv;

module.exports = r;
