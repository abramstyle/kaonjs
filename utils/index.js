function generateCdnPath(config) {
  const serverHost = config.build.host || config.host || '0.0.0.0';
  const serverPort = config.build.port || config.port || '';
  const serverPath = config.build.path || '';
  const port = serverPort ? `:${serverPort}` : '';

  return `//${serverHost}${port}/${serverPath}`;
}

exports.generateCdnPath = generateCdnPath;
