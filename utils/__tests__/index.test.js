const { generateCdnPath } = require('..');

describe('utils/generateCdnPath', () => {
  test('normal config', () => {
    const normalConfig = {
      build: {
        host: 'localhost',
        port: 1234,
        path: 'build/',
      },
    };

    const cdnUrl = generateCdnPath(normalConfig);
    expect(cdnUrl).toBe('//localhost:1234/build/');
  });

  test('without port', () => {
    const noPortConfig = {
      build: {
        host: 'localhost',
        path: 'build/',
      },
    };

    const cdnUrl = generateCdnPath(noPortConfig);
    expect(cdnUrl).toBe('//localhost/build/');
  });

  test('without path', () => {
    const noPathConfig = {
      build: {
        host: 'localhost',
        port: 1234,
      },
    };

    const cdnUrl = generateCdnPath(noPathConfig);
    expect(cdnUrl).toBe('//localhost:1234/');
  });
  test('no port, no path', () => {
    const pureHostConfig = {
      build: {
        host: 'localhost',
      },
    };

    const cdnUrl = generateCdnPath(pureHostConfig);
    expect(cdnUrl).toBe('//localhost/');
  });
});
