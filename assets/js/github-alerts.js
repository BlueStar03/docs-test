/* ===========================================================
   GitHub Alert Syntax Post-Processor
   
   Converts GitHub's alert syntax to styled blockquotes:
   > [!NOTE]     → blockquote.prompt-note
   > [!TIP]      → blockquote.prompt-tip
   > [!WARNING]  → blockquote.prompt-warning
   > [!DANGER]   → blockquote.prompt-danger
   
   Works alongside kramdown's IAL syntax: {: .prompt-info }
   =========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.markdown-body');
    if (!article) return;

    var blockquotes = article.querySelectorAll('blockquote');

    blockquotes.forEach(function (bq) {
      var text = bq.textContent;
      var match = text.match(/^\s*\[!(NOTE|TIP|WARNING|DANGER|CAUTION|IMPORTANT)\]/i);

      if (!match) return;

      var alertType = match[1].toLowerCase();
      var classMap = {
        'note': 'prompt-note',
        'tip': 'prompt-tip',
        'warning': 'prompt-warning',
        'danger': 'prompt-danger',
        'caution': 'prompt-warning', // treat caution as warning
        'important': 'prompt-danger' // treat important as danger
      };

      var className = classMap[alertType];
      if (!className) return;

      // Add class to blockquote
      bq.classList.add(className);

      // Remove the [!TYPE] marker from the content
      var firstP = bq.querySelector('p');
      if (firstP) {
        firstP.textContent = firstP.textContent.replace(/^\s*\[![A-Z]+\]\s*/, '');
      }
    });
  });
})();