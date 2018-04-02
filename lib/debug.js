const debug = require('debug');

const debugServer = debug('server');
const debugConfig = debug('config');
const debugRender = debug('render');

exports.debugServer = debugServer;
exports.debugConfig = debugConfig;
exports.debugRender = debugRender;
