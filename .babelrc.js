module.exports = {
  presets: [
    "@babel/preset-react",
    ["@babel/preset-env", {
      targets: {
        "browsers": ["last 2 versions"],
      }
    }],
  ],
  plugins: [
    "@loadable/babel-plugin",
    ["react-css-modules", {
      "generateScopedName": "[name]__[local]___[hash:base64:5]"
    }],
    ["@babel/plugin-proposal-class-properties", {
      "loose": true
    }]
  ],
  env: {
    "development": {
      plugins: [
        "@babel/plugin-transform-runtime",
        "react-hot-loader/babel",
      ]
    },
    production: {
      plugins: [
        '@babel/runtime'
      ]
    }
  }
}
