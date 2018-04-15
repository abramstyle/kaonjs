// const { generateCdnPath } = require('.');

function getAssets(manifest = {}) {
  // const cdnPath = generateCdnPath(config);
  const styles = Object.keys(manifest)
    .map(key => manifest[key])
    .filter(asset => asset.endsWith('.css'));

  const bundles = [
    manifest['manifest.js'],
    manifest['commons.js'],
    manifest['app.js'],
  ];


  if (bundles.indexOf('app.js') === 1) {
    bundles.push(manifest['app.js']);
  }


  return {
    styles,
    bundles,
  };
}

exports.getAssets = getAssets;
