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

An configuration specified these optons:

###  app
- app.name - The app name
- app.shortName - The short app name.
- app.port - App listening port.
- app.keys - Used for cookie encryption.
- app.routes - Customize koa routes.

### resources
- resources.root - If resources.root is exist, kaon will serve all files inside the path as static server.

### logs
- logs.path - the access log will be written to here.
- logname - logname

### cache
- cache.redisCacheAlive - The cache life stored in redis, should be an int.
- cache.memoryCacheAlive - The cache life stored in memory, should be an int.
- cache.validStatus - Cache the result only if response status matched the given status, should be an array.
- cache.validMethods - Cache the result only if the request method metch the given method.

### isomorphic
- isomorphic.routes - The client routes path, should be an string, the default value is `<project_root>/src/routes`.
- isomorphic.store - The client store path, should be an string, the default value is `<project_root>/src/store/configureStore`
- isomorphic.main - The client entry

### postcss
- postcss.path - If use postcss, shoud specify postcss path.

### build
- build.host - The dev server will server at this host.
- build.port - the dev server port.
- build.path - the dev server url path.
- webpack - if you will override default webpack configurations, then specify this path, and it should be an function witch return webpack configuration with given env. If no file found, an warn will be shown.
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
