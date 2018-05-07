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

function mergeEntries(module, otherModule) {
  const rules = Object.keys(otherModule).reduce((items, item) => {
    const itemValue = otherModule[item];
    let defaultItemValue = module[item];

    if (typeof itemValue === 'function') {
      items[item] = itemValue(defaultItemValue);
    } else if (Array.isArray(itemValue)) {
      if (!Array.isArray(defaultItemValue)) {
        defaultItemValue = [defaultItemValue];
      }
      items[item] = [...defaultItemValue, ...itemValue]
    } else {
      items[item] = itemValue;
    }
    return items;
  }, {});

  return {
    ...module,
    ...rules,
  }
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

      if (key === 'entry') {
        return mergeEntries(a, b)
      }

      // Fall back to default merging
      return undefined;
    },
  })(...configurations);
}

exports.mergeModules = mergeModules;
exports.mergeWebpack = mergeWebpack;
exports.mergeEntries = mergeEntries;
