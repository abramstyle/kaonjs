const { matchRoutes } = require('react-router-config');

function match(routes, url, exact = true) {
  const branch = matchRoutes(routes, url);

  if (Array.isArray(branch) && exact) {
    return [branch[0]] || [];
  }

  return branch;
}

// get matched components recursively
function getComponents(routes, url) {
  const branch = match(routes, url);

  const matched = branch[0];

  if (matched) {
    const { route: { component, routes: subRoutes }, match: { params } } = matched;

    const components = [{
      component,
      params,
    }];

    if (Array.isArray(subRoutes)) {
      const subComponents = getComponents(subRoutes, url);
      if (subComponents) {
        components.push(...subComponents);
      }
    }
    return components;
  }

  return null;
}

exports.getComponents = getComponents;
