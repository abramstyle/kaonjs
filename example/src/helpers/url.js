const apiHost = 'http://localhost:1090';
export function api(url) {
  return `${apiHost}${url}`;
}
