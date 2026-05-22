/* ===========================================================
   Minimal panel toggle.

   Behavior:
   - data-action="toggle-site-panel" → toggles body.site-panel-open
   - data-action="toggle-toc-panel"  → toggles body.toc-panel-open
   - data-action="close-panels"      → removes both (used by backdrop)

   No localStorage. No theme switching. No TOC generation.
   =========================================================== */

(function () {
  'use strict';

  function toggleSitePanel() {
    document.body.classList.toggle('site-panel-open');
  }

  function toggleTocPanel() {
    document.body.classList.toggle('toc-panel-open');
  }

  function closePanels() {
    document.body.classList.remove('site-panel-open');
    document.body.classList.remove('toc-panel-open');
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    var action = trigger.dataset.action;

    if (action === 'toggle-site-panel') toggleSitePanel();
    else if (action === 'toggle-toc-panel')  toggleTocPanel();
    else if (action === 'close-panels')      closePanels();
  });
})();
