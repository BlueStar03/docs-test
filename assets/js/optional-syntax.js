/* ===========================================================
   Optional Markdown Extensions Post-Processor
   
   Enables shorthand syntax that kramdown doesn't support:
   - ==highlight== → <mark>highlight</mark>
   - ~subscript~   → <sub>subscript</sub>
   - ^superscript^ → <sup>superscript</sup>
   
   Safe: skips processing inside code blocks, pre, kbd.
   Include this script in your layout if you want the syntax to work.
   =========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.markdown-body');
    if (!article) return;

    // Helper: check if text node is inside a code/pre/kbd element
    function isInCodeBlock(node) {
      var parent = node.parentElement;
      while (parent && parent !== article) {
        var tag = parent.tagName.toUpperCase();
        if (tag === 'CODE' || tag === 'PRE' || tag === 'KBD') {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    }

    // Find all text nodes that might contain our patterns
    var walker = document.createTreeWalker(
      article,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (!isInCodeBlock(node) && /[=~^]/.test(node.textContent)) {
        textNodes.push(node);
      }
    }

    // Process each text node
    textNodes.forEach(function (node) {
      var text = node.textContent;

      // Escape HTML entities to prevent XSS
      var safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      // Apply replacements
      var html = safe
        .replace(/==([^=]+)==/g, '<mark>$1</mark>')
        .replace(/~([^~]+)~/g, '<sub>$1</sub>')
        .replace(/\^([^^]+)\^/g, '<sup>$1</sup>');

      // Replace the text node with HTML fragment
      var span = document.createElement('span');
      span.innerHTML = html;

      node.parentNode.replaceChild(span, node);
    });
  });
})();