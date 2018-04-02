const { inspect } = require('util');
const { generateCdnPath } = require('../utils');
const { debugRender: debug } = require('./debug');

const getRenderer = async (config) => {
  // invalidate cache and require fresh cache
  if (__DEV__) {
    delete require.cache[require.resolve(`${config.build.target}/main`)];
  }

  const { default: getServerRenderer } = require(`${config.build.target}/main`);
  const render = require('../isomorphic/template');
  const serverRenderer = await getServerRenderer(config);

  return async (ctx) => {
    const manifest = {
    };
    Object.assign(manifest, require(`${config.build.target}/manifest.json`));

    debug('manifest:');
    debug(inspect(manifest, { colors: true, depth: null }));

    const assets = {
      manifest: manifest['manifest.js'],
      commons: manifest['commons.js'],
      app: manifest['app.js'],
    };
    const styles = [];
    const jsBundles = [];

    if (__PROD__) {
      const allStyles = Object.keys(manifest)
        .map(key => manifest[key])
        .filter(asset => asset.endsWith('.css'));

      styles.push(...allStyles);
    }

    const {
      html, state, helmet, bundles,
    } = await serverRenderer(ctx);
    const allAttributes = Object.keys(helmet).reduce((attributes, key) => {
      attributes[key] = (helmet[key] || {}).toString();

      return attributes;
    }, {});

    const cdnPath = generateCdnPath(config);

    // add cdn path to bundles
    bundles
      .filter(bundle => bundle.file.endsWith('.js') || bundle.file.endsWith('.css'))
      .map(bundle => `${cdnPath}${bundle.file}`)
      .forEach((item) => {
        if (item.endsWith('.js')) {
          jsBundles.push(item);
        }
        if (item.endsWith('.css')) {
          styles.push(item);
        }
      });

    const lang = 'lang="zh-CN"';

    // FIXME: DO Some security thing to ensure only escaped string will be rendered

    debug('assets:');
    debug(inspect(assets, { colors: true, depth: null }));
    debug('styles:');
    debug(inspect(styles, { colors: true, depth: null }));
    debug('bundles:');
    debug(inspect(jsBundles, { colors: true, depth: null }));

    return render({
      assets,
      styles,
      html,
      lang,
      state: JSON.stringify(state),
      helmet: allAttributes,
      bundles: jsBundles,
    });
  };
};

module.exports = getRenderer;
