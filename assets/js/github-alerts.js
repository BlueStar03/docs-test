/* ===========================================================
   Admonition Post-Processor (config-driven)

   Reads admonition types from window.ADMONITIONS, injected
   by the layout from _data/admonitions.yml.

   Handles two syntaxes that share the same config:

   1. GitHub-style alerts:
        > [!NOTE]                    static, default title
        > [!NOTE] Custom title       static, custom title
        > [!NOTE] `Code` in title    inline formatting preserved
        > [!NOTE] ""                 NO title row, no icon
        > [!NOTE]+ Title             collapsible, expanded
        > [!NOTE]- Title             collapsible, collapsed

   2. Chirpy-style prompts:
        > content
        {: .prompt-note }
   =========================================================== */

(function () {
  'use strict';

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Split innerHTML at the first <br> or newline (whichever comes first)
  function splitTitleAndBody(html) {
    var brMatch = html.match(/<br\s*\/?>/i);
    var nlIdx = html.indexOf('\n');
    var splitIdx = -1, splitLen = 0;

    if (brMatch && (nlIdx === -1 || brMatch.index < nlIdx)) {
      splitIdx = brMatch.index;
      splitLen = brMatch[0].length;
    } else if (nlIdx >= 0) {
      splitIdx = nlIdx;
      splitLen = 1;
    }

    if (splitIdx < 0) return { titleHtml: html, bodyHtml: '' };
    return {
      titleHtml: html.substring(0, splitIdx),
      bodyHtml: html.substring(splitIdx + splitLen)
    };
  }

  // Detect "" or '' marker (accounting for kramdown smart quotes)
  function isEmptyTitleMarker(titleHtml) {
    if (!titleHtml) return false;
    var tmp = document.createElement('div');
    tmp.innerHTML = titleHtml;
    var text = tmp.textContent.trim()
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    return text === '""' || text === "''";
  }

  function processGitHubAlerts(article, config) {
    var blockquotes = article.querySelectorAll('blockquote');

    blockquotes.forEach(function (bq) {
      var firstP = bq.querySelector('p');
      if (!firstP) return;

      var parts = splitTitleAndBody(firstP.innerHTML);
      var markerMatch = parts.titleHtml.match(/^\s*\[!([A-Za-z][A-Za-z0-9_-]*)\]([+-]?)\s*(.*)$/);
      if (!markerMatch) return;

      var type = markerMatch[1].toLowerCase();
      var modifier = markerMatch[2];
      var customTitleHtml = markerMatch[3].trim();

      var typeConfig = config[type];
      if (!typeConfig) return;

      var hideTitle = isEmptyTitleMarker(customTitleHtml);
      var title = hideTitle ? '' : (customTitleHtml || typeConfig.title || capitalize(type));
      var icon = typeConfig.icon || '';
      var color = typeConfig.color || '';
      var isCollapsible = modifier === '+' || modifier === '-';
      var startOpen = modifier === '+';

      // Build alert container
      var alert;
      if (isCollapsible) {
        alert = document.createElement('details');
        if (startOpen) alert.setAttribute('open', '');
      } else {
        alert = document.createElement('div');
      }
      alert.className = 'markdown-alert markdown-alert-' + type;
      if (hideTitle) alert.classList.add('markdown-alert-no-title');
      if (color) alert.style.setProperty('--alert-color', color);

      // Build title element (always for collapsibles — chevron stays clickable)
      if (!hideTitle || isCollapsible) {
        var titleEl = document.createElement(isCollapsible ? 'summary' : 'p');
        titleEl.className = 'markdown-alert-title';

        if (!hideTitle) {
          if (icon) {
            var iconSpan = document.createElement('span');
            iconSpan.className = 'markdown-alert-icon';
            iconSpan.innerHTML = icon;
            titleEl.appendChild(iconSpan);
          }
          // Title text preserves HTML formatting (code, bold, italic, etc.)
          var titleTextSpan = document.createElement('span');
          titleTextSpan.className = 'markdown-alert-title-text';
          titleTextSpan.innerHTML = title;
          titleEl.appendChild(titleTextSpan);
        }
        alert.appendChild(titleEl);
      }

      // Replace first paragraph with the body part (or remove if empty)
      var bodyTrimmed = parts.bodyHtml.replace(/^[\s\n]+/, '');
      if (bodyTrimmed) {
        firstP.innerHTML = bodyTrimmed;
      } else {
        firstP.remove();
      }

      // Move remaining children of blockquote into alert
      while (bq.firstChild) {
        alert.appendChild(bq.firstChild);
      }

      bq.parentNode.replaceChild(alert, bq);
    });
  }

  function processChirpyPrompts(article, config) {
    var prompts = article.querySelectorAll('blockquote[class*="prompt-"]');

    prompts.forEach(function (bq) {
      var typeMatch = bq.className.match(/prompt-([a-z][a-z0-9_-]*)/i);
      if (!typeMatch) return;

      var type = typeMatch[1].toLowerCase();
      var typeConfig = config[type];
      if (!typeConfig) return;

      var icon = typeConfig.icon || '';
      var color = typeConfig.color || '';

      if (color) bq.style.setProperty('--alert-color', color);

      if (icon) {
        var firstP = bq.querySelector('p');
        if (firstP) {
          var iconSpan = document.createElement('span');
          iconSpan.className = 'markdown-alert-icon prompt-icon';
          iconSpan.innerHTML = icon;
          firstP.insertBefore(iconSpan, firstP.firstChild);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var config = window.ADMONITIONS || {};
    var article = document.querySelector('.markdown-body');
    if (!article) return;

    processGitHubAlerts(article, config);
    processChirpyPrompts(article, config);
  });
})();