const renderHtml = (data = {}) => {
  // const bundles = arrayUtils.uniq((data.bundles || []))
  //   .map(bundle => `<script src="${bundle}"></script>`)
  //   .join('');
  // const styles = (data.styles || [])
  //   .map(style => `<link href="${style}" rel="stylesheet" />`)
  //   .join('');
  const { statics } = data;


  return `
    <!doctype html>
    <html ${data.helmet.htmlAttributes}>
        <head>
            ${data.helmet.title || ''}
            ${data.helmet.meta || ''}
            ${data.helmet.link || ''}
            ${data.helmet.style || ''}
            ${statics.link}
            ${statics.style}
            ${data.helmet.noscript || ''}
            ${data.helmet.script || ''}
        </head>
        <body ${data.helmet.bodyAttributes || ''}>
            <main id="root">${data.html || ''}</main>
            <script>
              window.__PRELOADED_STATE__ = ${data.state || '{}'};
            </script>
            ${statics.scripts}
        </body>
    </html>
  `;
};

module.exports = renderHtml;
