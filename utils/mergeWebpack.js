const merge = require('webpack-merge');
const { arrayUtils } = require('@abramstyle/utils');

function mergeModules(module, otherModule) {
  const allRules = [...module.rules, ...otherModule.rules];
  const rules = allRules
    .reduce((items, item) => {
      const testString = item.test.toString();
      const existent = arrayUtils.findOne(items, current => current.test.toString() === testString);

      if (existent) {
        Object.assign(existent, item);
      } else {
        items.push(item);
      }

      return items;
    }, []);

  // console.log('rules: ', rules);
  return {
    rules,
  };
}

function mergeWebpack(...configurations) {
  return merge({
    customizeArray(a, b, key) {
      if (key === 'extensions') {
        return arrayUtils.uniq([...a, ...b]);
      }

      // Fall back to default merging
      return undefined;
    },
    customizeObject(a, b, key) {
      if (key === 'module') {
        // Custom mergingk
        return mergeModules(a, b);
      }

      // Fall back to default merging
      return undefined;
    },
  })(...configurations);
}

exports.mergeModules = mergeModules;
exports.mergeWebpack = mergeWebpack;
