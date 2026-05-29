/* ===========================================================
   Site Navigation

   The nav tree is rendered server-side by nav-tree.html, so it
   works without JS (all sections expanded). This script adds
   progressive enhancement:
   - Collapse/expand groups on click
   - Collapse all by default, auto-expand the section containing
     the current page
   - Hide the panel + topbar button if the nav is empty
   =========================================================== */

(function () {
  'use strict';

  function init() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    if (!nav.querySelector('.site-nav-item')) {
      hideSiteNavChrome();
      return;
    }

    // Enable collapse behavior (CSS keys off this class)
    nav.classList.add('site-nav-interactive');
    setupToggles(nav);
    expandCurrentSection(nav);
  }

  function hideSiteNavChrome() {
    var panel = document.getElementById('site-panel');
    var button = document.querySelector('[data-action="toggle-site-panel"]');
    if (panel) panel.style.display = 'none';
    if (button) button.style.display = 'none';
  }

  function setupToggles(nav) {
    nav.addEventListener('click', function (e) {
      var toggle = e.target.closest('.site-nav-toggle, .site-nav-expander');
      if (!toggle) return;
      var group = toggle.closest('.site-nav-group');
      if (!group) return;
      var expanded = group.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  function expandCurrentSection(nav) {
    var current = nav.querySelector('.site-nav-link.current');
    if (!current) return;

    // Walk up, expanding every ancestor group
    var group = current.closest('.site-nav-group');
    while (group) {
      group.classList.add('expanded');
      var toggle = group.querySelector(
        ':scope > .site-nav-toggle, :scope > .site-nav-linkable-row > .site-nav-expander'
      );
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      var parent = group.parentElement;
      group = parent ? parent.closest('.site-nav-group') : null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();