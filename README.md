# Keon
keon is an react isomorphic app solution. it contains webpack build, hot reloading, code splitting and server side rendering.

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
npm install keon
```
or with yarn
```
yarn add keon
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
- resources.root - If resources.root is exist, keon will serve all files inside the path as static server.

### logs
- logs.path - the access log will be written to here.
- logname - logname

### cache
- cache.redisCacheAlive - The cache life stored in redis, should be an int.
- cache.memoryCacheAlive - The cache life stored in memory, should be an int.
- validStatus - Cache the result only if response status matched the given status, should be an array.
- validMethods - Cache the result only if the request method metch the given method.

### isomorphic
- isomorphic.routes - The client routes path, should be an string, the default value is `<project_root>/src/routes`.
- isomorphic.store - The client store path, should be an string, the default value is `<project_root>/src/store/configureStore`

### postcss
- postcss.path - If use postcss, shoud specify postcss path.

### build
- build.host - The dev server will server at this host.
- build.port - the dev server port.
- webpack - if you will override default webpack configurations, then specify this path, and it should be an function witch return webpack configuration with given env. If no file found, an warn will be shown.
- path - the build result path.
