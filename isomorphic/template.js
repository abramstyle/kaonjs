const { arrayUtils } = require('@abramstyle/utils');

const renderHtml = (data = {}) => {
  const bundles = arrayUtils.uniq((data.bundles || []))
    .map(bundle => `<script src="${bundle}"></script>`)
    .join('');
  const styles = (data.styles || [])
    .map(style => `<link href="${style}" rel="stylesheet" />`)
    .join('');

  return `
    <!doctype html>
    <html ${data.helmet.htmlAttributes}>
        <head>
            ${data.helmet.title || ''}
            ${data.helmet.meta || ''}
            ${data.helmet.link || ''}
            ${data.helmet.style || ''}
            ${styles}
        </head>
        <body ${data.helmet.bodyAttributes || ''}>
            ${data.helmet.noscript || ''}
            <main id="root">${data.html || ''}</main>
            <script>
              window.__PRELOADED_STATE__ = ${data.state || '{}'};
            </script>
            ${bundles || ''}
            ${data.helmet.script || ''}
        </body>
    </html>
  `;
};

module.exports = renderHtml;
