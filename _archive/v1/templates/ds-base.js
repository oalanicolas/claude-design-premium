(function () {
  var base = window.CDP_DESIGN_SYSTEM_BASE || '../..';

  function appendStylesheet(href) {
    var existing = Array.prototype.some.call(document.styleSheets, function (sheet) {
      return sheet.href && sheet.href.indexOf(href) !== -1;
    });
    if (existing) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function appendScript(src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) return existing;

    var script = document.createElement('script');
    script.src = src;
    script.onerror = function () {
      console.error('ds-base.js: bundle not found at ' + script.src + '. Point CDP_DESIGN_SYSTEM_BASE to the linked _ds folder.');
    };
    document.head.appendChild(script);
    return script;
  }

  appendStylesheet(base + '/styles.css');
  appendScript(base + '/_ds_bundle.js');
})();
