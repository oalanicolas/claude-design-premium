(function () {
  var cfg = window.CDP_SITE || {};

  function text(selector, value) {
    var el = document.querySelector(selector);
    if (el && value) el.textContent = value;
  }

  function href(selector, value) {
    var el = document.querySelector(selector);
    if (el && value) el.setAttribute("href", value);
  }

  text("[data-brand]", cfg.brand);
  text("[data-cta-label]", cfg.cta && cfg.cta.label);
  href("[data-cta-label]", cfg.cta && cfg.cta.href);

  var nav = document.querySelector("[data-nav]");
  if (nav && Array.isArray(cfg.nav)) {
    nav.textContent = "";
    cfg.nav.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.href || "#";
      link.textContent = item.label || "Link";
      nav.appendChild(link);
    });
  }
})();
