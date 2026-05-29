/* ===========================================================
   Panel toggles + persistence

   Behavior:
   - data-action="toggle-site-panel"  → toggle, save state
   - data-action="toggle-toc-panel"   → toggle, save state
   - data-action="close-site-panel"   → close site panel
   - data-action="close-toc-panel"    → close TOC panel
   - data-action="close-panels"       → close both (used by backdrop)

   Rules:
   - Desktop (>= 1024px): both panels can be open simultaneously
   - Mobile (< 1024px):   opening one auto-closes the other
   - State is always written to localStorage; the FOUC inline script
     in default.html only reads it on desktop
   =========================================================== */

(function () {
  'use strict';

  var DESKTOP_BREAKPOINT = 1024;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function saveState() {
    localStorage.setItem(
      'site-panel',
      document.body.classList.contains('site-panel-open') ? 'open' : 'closed'
    );
    localStorage.setItem(
      'toc-panel',
      document.body.classList.contains('toc-panel-open') ? 'open' : 'closed'
    );
  }

  function openSitePanel() {
    document.body.classList.add('site-panel-open');
    if (!isDesktop()) document.body.classList.remove('toc-panel-open');
    saveState();
  }

  function openTocPanel() {
    document.body.classList.add('toc-panel-open');
    if (!isDesktop()) document.body.classList.remove('site-panel-open');
    saveState();
  }

  function closeSitePanel() {
    document.body.classList.remove('site-panel-open');
    saveState();
  }

  function closeTocPanel() {
    document.body.classList.remove('toc-panel-open');
    saveState();
  }

  function toggleSitePanel() {
    if (document.body.classList.contains('site-panel-open')) closeSitePanel();
    else openSitePanel();
  }

  function toggleTocPanel() {
    if (document.body.classList.contains('toc-panel-open')) closeTocPanel();
    else openTocPanel();
  }

  function closePanels() {
    document.body.classList.remove('site-panel-open');
    document.body.classList.remove('toc-panel-open');
    saveState();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    var action = trigger.dataset.action;
    if (action === 'toggle-site-panel')      toggleSitePanel();
    else if (action === 'toggle-toc-panel')  toggleTocPanel();
    else if (action === 'close-site-panel')  closeSitePanel();
    else if (action === 'close-toc-panel')   closeTocPanel();
    else if (action === 'close-panels')      closePanels();
  });
})();

/* ===========================================================
   KaTeX math rendering (auto-render extension)
   =========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof renderMathInElement === 'undefined') return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false }
    ]
  });
});

/* ===========================================================
   Mermaid diagram rendering
   =========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof mermaid === 'undefined') return;

  // Convert kramdown output (<pre><code class="language-mermaid">)
  // to Mermaid's expected format (<div class="mermaid">)
  document.querySelectorAll('pre code.language-mermaid').forEach(function (codeBlock) {
    var diagram = codeBlock.textContent.trim();
    var div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = diagram;
    codeBlock.parentElement.replaceWith(div);
  });

  // Initialize Mermaid
  mermaid.initialize({ startOnLoad: true, theme: 'default' });
  mermaid.contentLoaded();
});