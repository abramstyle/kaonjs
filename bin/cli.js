#!/usr/bin/env node

const r = require('yargs').usage('cybertron <cmd> [args]')
  .command('start [options]', 'Welcome to args!', (yargs) => {
    yargs.positional('options', {
      type: 'string',
      default: 'server',
      describe: 'the type to start',
    });
  }, (argv) => {
    console.log('hello, you just run ', argv.options);
  })
  .help()
  .argv;

module.exports = r;
