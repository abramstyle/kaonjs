module.exports = {
  "presets": [
    "@babel/preset-react",
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      },
    }],
  ],
  "plugins": [
    // "@babel/plugin-transform-regenerator",
    "loadable-components/babel",
    ["react-css-modules", {
      "generateScopedName": "[name]__[local]___[hash:base64:5]"
    }],
  ],
  "env": {
    "development": {
      "plugins": [
        "@babel/plugin-transform-runtime",
      ]
    },
    production: {
      plugins: [
        '@babel/runtime'
      ]
    }
  }
}
