/* ===========================================================
   Theme Toggle

   Three states: auto / light / dark
   - auto:  follow system preference
   - light: explicit light mode
   - dark:  explicit dark mode

   Initial theme is applied inline in <head> (see default.html)
   to prevent flash. This script handles:
   - Click cycling through states
   - System theme changes (when in auto mode)
   - Updating the toggle button's data-attribute for icon swap
   =========================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'theme-preference';
  var STATES = ['auto', 'light', 'dark'];
  var html = document.documentElement;
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function getPreference() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function setPreference(pref) {
    if (pref === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, pref);
    }
  }

  function effectiveTheme(pref) {
    if (pref === 'auto') return mql.matches ? 'dark' : 'light';
    return pref;
  }

  function applyTheme(pref) {
    html.setAttribute('data-theme', effectiveTheme(pref));
    html.setAttribute('data-theme-pref', pref);
  }

  function cycle() {
    var current = getPreference();
    var idx = STATES.indexOf(current);
    var next = STATES[(idx + 1) % STATES.length];
    setPreference(next);
    applyTheme(next);
  }

  // Click handler — toggle button uses data-action="toggle-theme"
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="toggle-theme"]');
    if (btn) cycle();
  });

  // React to system theme changes when in auto mode
  mql.addEventListener('change', function () {
    if (getPreference() === 'auto') applyTheme('auto');
  });
})();