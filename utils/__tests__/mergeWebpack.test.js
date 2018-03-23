const { mergeWebpack, mergeModules } = require('../mergeWebpack');

// describe('Test mergeModules', () => {
//   test('mergeModules', () => {
//     const module = {
//       rules: [{
//         test: /\.css$/,
//         a: 1,
//         b: 2,
//         c: 3,
//       }, {
//         test: /\.js$/,
//         a: 3,
//         b: 4,
//         c: 5,
//       }],
//     };
//     const otherModule = {
//       rules: [{
//         test: /\.css$/,
//         a: 2,
//         b: 2,
//         c: 3,
//         d: 5,
//       }, {
//         test: /\.jpg$/,
//         a: 1,
//         b: 2,
//         c: 3,
//       }],
//     };
//
//     const mergedModules = mergeModules(module, otherModule);
//
//     expect(mergedModules).toEqual({
//       rules: [{
//         test: /\.css$/,
//         a: 2,
//         b: 2,
//         c: 3,
//         d: 5,
//       }, {
//         test: /\.js$/,
//         a: 3,
//         b: 4,
//         c: 5,
//       }, {
//         test: /\.jpg$/,
//         a: 1,
//         b: 2,
//         c: 3,
//       }],
//     });
//   });
// });

describe('Test merge webpack configurations.', () => {
  test('merge module.rules', () => {
    const defaultConfig = {
      module: {
        rules: [{
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          }],
          exclude: /node_modules/,
        }, {
          test: /\.css$/,
          use: [{
            loader: 'style-loader',
            options: {
              useable: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
            options: {},
          }],
        }],
      },
    };

    const externalConfig = {
      module: {
        rules: [{
          test: /node_modules.*\.css$/,
          use: [{
            loader: 'style-loader',
            options: {
              useable: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: false,
              modules: false,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          }],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [{
            loader: 'style-loader',
            options: {
              useable: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
          },
          ],
        }],
      },
    };

    const mergedConfig = mergeWebpack(defaultConfig, externalConfig);

    expect(mergedConfig).toEqual({
      module: {
        rules: [{
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          }],
          exclude: /node_modules/,
        }, {
          test: /\.css$/,
          use: [{
            loader: 'style-loader',
            options: {
              useable: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
          }],
          exclude: /node_modules/,
        }, {
          test: /node_modules.*\.css$/,
          use: [{
            loader: 'style-loader',
            options: {
              useable: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: false,
              modules: false,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          }],
        }],
      },
    });
  });
});
