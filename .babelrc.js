module.exports = {
  "presets": [
    "@babel/preset-react",
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions"],
      }
    }],
  ],
  "plugins": [
    "loadable-components/babel",
    ["react-css-modules", {
      "generateScopedName": "[name]__[local]___[hash:base64:5]"
    }],
  ],
  "env": {
    "development": {
      "plugins": [
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
