# kaon.js
Kaon.js is an react isomorphic app solution. it contains webpack build, hot reloading, code splitting and server side rendering.

# From
Kaon is a Decepticon-controlled city-state in the southern hemisphere of Cybertron. Under Decepticon rule, its capitol is the fortress of Kolkular.

# The pronounce
['keɑn]

# The main stack
- koa
- react
- redux
- react-router
- react-helmet
- webpack
- postcss
- react-hot-loader
- react-loadable
- babel

# Usage
## install
```
npm install kaonjs
```
or with yarn
```
yarn add kaon
```
## add your config
Config is a js file that default exported a Javascript object, it specified a lot ot configurations. The default path is `<project_root>/config/cybertron.config.js`. But you can put it into anywhere of your project.

The config file is not required, Kaon will use the default config as below:

```js
const kaonConfig = {
  ssr: true,
  app: {
    name: 'Kaon Config Template (production)',
    shortName: 'rib',
    port: 1827,
    routes: `${baseDir}/app/routes`,
    middlewares: `${baseDir}/app/middlewares`,
  },
  resources: {
    root: `${baseDir}/public`,
  },
  isomorphic: {
    routes: `${baseDir}/src/routes`,
    store: `${baseDir}/src/store/configureStore.js`,
    main: `${baseDir}/src/client`,
  },
  postcss: {
    path: `${baseDir}/config/postcss.config.js`,
  },
  webpack: {
    client: `${baseDir}/config/webpack.client.config`,
    server: `${baseDir}/config/webpack.server.config`,
  },
  build: {
    host: 'localhost',
    port: 1592,
    path: 'build/',
    target: `${baseDir}/public/build`,
  },
};
```



An configuration specified these optons:
### ssr
Enable or disable server side side rendering. Disable ssr will improve start up speed.

###  app
- app.name - The app name
- app.shortName - The short app name.
- app.port - App listening port.
- app.routes - Customize koa routes.
- app.middlewares - the js file that will apply your middlewares.

### resources
- resources.root - If resources.root is exist, kaon will serve all files inside the path as static server.

### isomorphic
- isomorphic.routes - The client routes path, should be an string, the default value is `<project_root>/src/routes`.
- isomorphic.store - The client store path, should be an string, the default value is `<project_root>/src/store/configureStore`
- isomorphic.main - The client entry

### postcss
- postcss.path - If use postcss, shoud specify postcss path.

### webpack
- webpack.client - your client webpack configuration, object or function.
- webpack.server - your server webpack configuration, object or function.

### build
- build.host - The dev server will server at this host.
- build.port - the dev server port.
- build.path - the dev server url path.
- build.target - the build result path.

## command line
command: `kaon <cmd> [options]`

### commands
#### `kaon start [options]`

available options:

- config - specify config path

#### `kaon build [options]`

available options:

- config - specify config path

## nodejs APIs
You can use kaon as an npm modules instead of cli.

```javascript
const Kaon = require('kaon');
const kaon = new Kaon(config);

kaon.start();
```

## environment variables
### ENABLE_SSR
`yes` or `no`. If select `yes`, server side rendering will be enabled, `no` will disable server side rendering temporary.

## apply your middleware.
First, configure your middleware path, it should be a javascript file like below:

```javascript
const logger = require('koa-logger');
const favicon = require('koa-favicon');
const path = require('path');

function applyMiddlewares(app) {
  app.use(logger());
  app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
}

module.exports = applyMiddlewares;
```

The app instance will be passed to your function, then just call `app.use` to apply the middlewares.

## apply your routes.
Just like apply middlewares. just don't forget configure your routes path in your config file.

```javascript
const Router = require('koa-router');

function applyRoutes(app) {
  const router = new Router();

  router.get('/', async (ctx) => {
    ctx.body = 'hello world.';
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = applyRoutes;
```

## add your customize script, styles, head tags, ect.
You can use [react-helmet](https://github.com/nfl/react-helmet).

## apply your own webpack configuration.
*ATTENTION!* You cannot override default entry with yours.

# Special Thanks

- [React Helmet](https://github.com/nfl/react-helmet)
- [React Loadable](https://github.com/jamiebuilds/react-loadable)

# License
MIT
