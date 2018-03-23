const merge = require('webpack-merge');
const _ = require('lodash');

function mergeWebpack(...configurations) {
  return merge({
    customizeArray(a, b, key) {
      if (key === 'extensions') {
        return _.uniq([...a, ...b]);
      }

      // Fall back to default merging
      return undefined;
    },
    customizeObject(a, b, key) {
      if (key === 'module') {
        // Custom merging
        return _.merge({}, a, b);
      }

      // Fall back to default merging
      return undefined;
    },
  })(...configurations);
}

module.exports = mergeWebpack;
