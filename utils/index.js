function generateCdnPath(config) {
  const serverHost = config.build.host || config.host || '0.0.0.0';
  const serverPort = config.build.port || config.host || 1592;
  const serverPath = config.build.path || '';

  return `//${serverHost}:${serverPort}/${serverPath}`;
}

exports.generateCdnPath = generateCdnPath;
