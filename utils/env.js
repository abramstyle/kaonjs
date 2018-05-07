function config() {
  const env = process.env.NODE_ENV;
  process.env.APP_ENV = process.env.APP_ENV || process.env.NODE_ENV;

  global.__DEV__ = false;
  global.__PROD__ = false;
  global.__RELEASE__ = false;
  global.__STAGING__ = false;

  if (env === 'development') {
    global.__DEV__ = true;
  } else if (env === 'production') {
    global.__PROD__ = true;
  } else if (env === 'release') {
    global.__RELEASE__ = true;
  } else if (env === 'staging') {
    global.__STAGING__ = true;
  }
}

exports.config = config;
