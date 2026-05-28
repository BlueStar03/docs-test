/* ===========================================================
   Theme Toggle

   Two states: light / dark
   - First visit (no stored preference): follows system preference
   - Once user clicks: their explicit choice is remembered

   The initial theme is applied inline in <head> (see default.html)
   to prevent flash. This script handles:
   - Click toggling between light and dark
   - System theme changes (only if user has no explicit preference)
   =========================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'theme-preference';
  var html = document.documentElement;
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
  }

  function toggle() {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Click handler
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="toggle-theme"]');
    if (btn) toggle();
  });

  // React to system theme changes — only if no explicit preference set
  mql.addEventListener('change', function () {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(mql.matches ? 'dark' : 'light');
    }
  });
})();