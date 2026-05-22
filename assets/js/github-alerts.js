/* ===========================================================
   Admonition Post-Processor (config-driven)

   Reads admonition types from window.ADMONITIONS, injected
   by the layout from _data/admonitions.yml.

   Handles two syntaxes that share the same config:

   1. GitHub-style alerts — title row + content:
        > [!NOTE]
        > content
        > [!NOTE]+ Title  (collapsible, expanded)
        > [!NOTE]- Title  (collapsible, collapsed)

   2. Chirpy-style prompts — icon inline at start:
        > content here
        {: .prompt-note }
   =========================================================== */

(function () {
  'use strict';

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function processGitHubAlerts(article, config) {
    var blockquotes = article.querySelectorAll('blockquote');

    blockquotes.forEach(function (bq) {
      var firstP = bq.querySelector('p');
      if (!firstP) return;

      var text = firstP.textContent;
      var match = text.match(/^\s*\[!([A-Za-z][A-Za-z0-9_-]*)\]([+-]?)(.*)/);
      if (!match) return;

      var type = match[1].toLowerCase();
      var modifier = match[2];
      var customTitle = match[3].trim();

      var typeConfig = config[type];
      if (!typeConfig) return;

      var title = customTitle || typeConfig.title || capitalize(type);
      var icon = typeConfig.icon || '';
      var color = typeConfig.color || '';
      var isCollapsible = modifier === '+' || modifier === '-';
      var startOpen = modifier === '+';

      var alert;
      if (isCollapsible) {
        alert = document.createElement('details');
        if (startOpen) alert.setAttribute('open', '');
      } else {
        alert = document.createElement('div');
      }
      alert.className = 'markdown-alert markdown-alert-' + type;
      if (color) alert.style.setProperty('--alert-color', color);

      var titleEl = document.createElement(isCollapsible ? 'summary' : 'p');
      titleEl.className = 'markdown-alert-title';

      if (icon) {
        var iconSpan = document.createElement('span');
        iconSpan.className = 'markdown-alert-icon';
        iconSpan.innerHTML = icon;
        titleEl.appendChild(iconSpan);
      }
      titleEl.appendChild(document.createTextNode(title));
      alert.appendChild(titleEl);

      firstP.innerHTML = firstP.innerHTML.replace(
        /^\s*\[![A-Za-z][A-Za-z0-9_-]*\][+-]?[^\n<]*(<br\s*\/?>|\n)?/,
        ''
      );

      if (firstP.innerHTML.trim() === '') {
        firstP.remove();
      }

      while (bq.firstChild) {
        alert.appendChild(bq.firstChild);
      }

      bq.parentNode.replaceChild(alert, bq);
    });
  }

  function processChirpyPrompts(article, config) {
    var prompts = article.querySelectorAll('blockquote[class*="prompt-"]');

    prompts.forEach(function (bq) {
      // Find the prompt-* class to extract the type
      var typeMatch = bq.className.match(/prompt-([a-z][a-z0-9_-]*)/i);
      if (!typeMatch) return;

      var type = typeMatch[1].toLowerCase();
      var typeConfig = config[type];
      if (!typeConfig) return;

      var icon = typeConfig.icon || '';
      var color = typeConfig.color || '';

      // Apply color via CSS variable
      if (color) bq.style.setProperty('--alert-color', color);

      // Inject icon at the start of the first paragraph
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