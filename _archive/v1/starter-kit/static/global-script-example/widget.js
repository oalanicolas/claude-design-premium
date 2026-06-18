(function () {
  'use strict';

  function mount(root) {
    if (!root) return;

    var action = root.querySelector('[data-global-widget-action]');
    var output = root.querySelector('[data-global-widget-output]');
    var count = 0;

    if (!action || !output) return;

    action.addEventListener('click', function () {
      count += 1;
      output.textContent = 'Global widget ran ' + count + (count === 1 ? ' time.' : ' times.');
    });
  }

  window.CDPGlobalWidget = {
    mount: mount
  };
}());
