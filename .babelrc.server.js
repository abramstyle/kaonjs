module.exports = {
  "presets": [
    "@babel/preset-react",
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      },
      modules: "commonjs"
    }],
  ],
  "plugins": [
    "@loadable/babel-plugin",
    ["react-css-modules", {
      "generateScopedName": "[name]__[local]___[hash:base64:5]"
    }],
    ["@babel/plugin-proposal-class-properties", {
      "loose": true
    }]
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
