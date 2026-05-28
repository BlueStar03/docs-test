/* ===========================================================
   Table of Contents

   Auto-generates the TOC in #toc-panel from headings in
   .markdown-body. Tracks the active section as the user scrolls,
   and smooth-scrolls when a TOC entry is clicked.

   Config (window.TOC, injected by the layout):
   - enabled:  whether to build the TOC
   - minLevel: lowest heading level to include (e.g. 2)
   - maxLevel: highest heading level to include (e.g. 3)

   If no headings in range are found, the TOC panel and its
   topbar toggle button are hidden entirely.
   =========================================================== */

(function () {
  'use strict';

  function init() {
    var config = window.TOC || {};
    if (config.enabled === false) {
      hideTocChrome();
      return;
    }

    var article = document.querySelector('.markdown-body');
    if (!article) {
      hideTocChrome();
      return;
    }

    var minLevel = config.minLevel || 2;
    var maxLevel = config.maxLevel || 3;

    var selector = [];
    for (var i = minLevel; i <= maxLevel; i++) {
      selector.push('.markdown-body h' + i);
    }
    var headings = Array.prototype.slice.call(
      document.querySelectorAll(selector.join(','))
    ).filter(function (h) { return h.id; });

    if (headings.length === 0) {
      hideTocChrome();
      return;
    }

    buildTocList(headings, minLevel);
    setupActiveTracking(headings);
    setupClickHandler();
  }

  function hideTocChrome() {
    var panel = document.getElementById('toc-panel');
    var button = document.querySelector('[data-action="toggle-toc-panel"]');
    if (panel) panel.style.display = 'none';
    if (button) button.style.display = 'none';
  }

  function buildTocList(headings, minLevel) {
    var panel = document.getElementById('toc-panel');
    if (!panel) return;
    var nav = panel.querySelector('.panel-nav');
    if (!nav) return;

    var html = '<ul class="toc-list">';
    headings.forEach(function (h) {
      var level = parseInt(h.tagName.charAt(1), 10);
      var depth = level - minLevel;
      html += '<li class="toc-item toc-depth-' + depth + '">' +
                '<a href="#' + h.id + '" data-toc-target="' + h.id + '">' +
                  escapeHtml(h.textContent) +
                '</a>' +
              '</li>';
    });
    html += '</ul>';
    nav.innerHTML = html;
  }

  function setupActiveTracking(headings) {
    var scrollOffset = 80;     // topbar height + breathing room
    var tocLinks = {};
    headings.forEach(function (h) {
      tocLinks[h.id] = document.querySelector('[data-toc-target="' + cssEscape(h.id) + '"]');
    });

    var currentActiveId = null;

    function update() {
      var active = null;
      for (var i = 0; i < headings.length; i++) {
        var rect = headings[i].getBoundingClientRect();
        if (rect.top - scrollOffset <= 0) {
          active = headings[i].id;
        } else {
          break;
        }
      }
      if (!active) active = headings[0].id;

      if (active === currentActiveId) return;

      if (currentActiveId && tocLinks[currentActiveId]) {
        tocLinks[currentActiveId].parentElement.classList.remove('toc-active');
      }
      if (tocLinks[active]) {
        tocLinks[active].parentElement.classList.add('toc-active');
        // Keep the active item visible in the TOC scroll container
        tocLinks[active].scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
      currentActiveId = active;
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function setupClickHandler() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('.toc-list a');
      if (!a) return;
      e.preventDefault();
      var id = a.getAttribute('data-toc-target');
      var target = document.getElementById(id);
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);

      // Close the panel on mobile after navigation
      if (window.innerWidth < 1024) {
        document.body.classList.remove('toc-panel-open');
      }
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // CSS.escape polyfill for legacy browsers
  function cssEscape(s) {
    if (window.CSS && CSS.escape) return CSS.escape(s);
    return String(s).replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~]/g, '\\$&');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();