/* ===========================================================
   Code Block Post-Processor

   Adds a window-style title bar to fenced code blocks with:
   - Window style (windows | macos | linux)
   - Language label/icon (from _data/languages.yml)
   - Filename (from `{: file='name.ext' }` IAL)
   - Line numbers (per-block or global)
   - Line highlighting (per-block via `highlight='3,5-7'`)
   - Copy button (with line-number-aware copy)

   Global defaults from _config.yml:
     code_blocks:
       window_style: windows | macos | linux   (default: windows)
       line_numbers: true | false              (default: false)

   Per-block IAL (after closing fence):
     {: file='name.js' window='macos' numbers='true' highlight='3,5-7' }
   =========================================================== */

(function () {
  'use strict';

  var ICON_COPY  = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';
  var VALID_STYLES = ['windows', 'macos', 'linux'];

  function attr(div, name) {
    return div.getAttribute(name) || div.getAttribute('data-' + name);
  }

  function getLanguage(div) {
    var m = div.className.match(/language-([\w-]+)/);
    if (!m || m[1] === 'plaintext') return null;
    return m[1];
  }

  function getWindowStyle(div, defaults) {
    var s = attr(div, 'window');
    if (s && VALID_STYLES.indexOf(s) >= 0) return s;
    if (defaults.window_style && VALID_STYLES.indexOf(defaults.window_style) >= 0) {
      return defaults.window_style;
    }
    return 'windows';
  }

  function getLineNumbers(div, defaults) {
    var s = attr(div, 'numbers');
    if (s === 'true')  return true;
    if (s === 'false') return false;
    return !!defaults.line_numbers;
  }

  function getZebra(div, defaults) {
    var s = attr(div, 'zebra');
    if (s === 'true')  return true;
    if (s === 'false') return false;
    return !!defaults.zebra;
  }

  function getZebra(div, defaults) {
    var s = attr(div, 'zebra');
    if (s === 'true')  return true;
    if (s === 'false') return false;
    return !!defaults.zebra;
  }

  // Parse "3,5-7,10" → [3, 5, 6, 7, 10]
  function parseHighlightRanges(str) {
    if (!str) return [];
    var out = [];
    str.split(',').forEach(function (part) {
      part = part.trim();
      var range = part.match(/^(\d+)-(\d+)$/);
      if (range) {
        var start = parseInt(range[1], 10), end = parseInt(range[2], 10);
        for (var i = start; i <= end; i++) out.push(i);
      } else {
        var n = parseInt(part, 10);
        if (!isNaN(n)) out.push(n);
      }
    });
    return out;
  }

  function buildTrafficLights() {
    var tl = document.createElement('div');
    tl.className = 'traffic-lights';
    tl.innerHTML =
      '<span class="traffic-light traffic-close" aria-hidden="true"></span>' +
      '<span class="traffic-light traffic-minimize" aria-hidden="true"></span>' +
      '<span class="traffic-light traffic-maximize" aria-hidden="true"></span>';
    return tl;
  }

  function buildLanguageBadge(language, langConfig) {
    if (!language) return null;
    var badge = document.createElement('span');
    badge.className = 'code-block-language';

    if (langConfig && langConfig.icon) {
      badge.classList.add('icon-only');
      var icon = document.createElement('span');
      icon.className = 'code-block-language-icon';
      icon.innerHTML = langConfig.icon;
      badge.setAttribute('title', language);
      badge.appendChild(icon);
    } else {
      var text = document.createElement('span');
      text.className = 'code-block-language-text';
      text.textContent = language;
      badge.appendChild(text);
    }
    return badge;
  }

  function buildFilenameLabel(filename) {
    if (!filename) return null;
    var label = document.createElement('span');
    label.className = 'code-block-filename';
    label.textContent = filename;
    return label;
  }

  function buildCopyButton() {
    var btn = document.createElement('button');
    btn.className = 'code-block-copy';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = ICON_COPY;
    return btn;
  }

  function buildTitleBar(language, filename, langConfig, windowStyle) {
    var bar = document.createElement('div');
    bar.className = 'code-block-titlebar style-' + windowStyle;

    var left   = document.createElement('div'); left.className   = 'titlebar-left';
    var center = document.createElement('div'); center.className = 'titlebar-center';
    var right  = document.createElement('div'); right.className  = 'titlebar-right';

    var lang = buildLanguageBadge(language, langConfig);
    var file = buildFilenameLabel(filename);
    var copy = buildCopyButton();

    if (windowStyle === 'macos') {
      left.appendChild(buildTrafficLights());
      if (lang) center.appendChild(lang);
      if (file) center.appendChild(file);
    } else if (windowStyle === 'linux') {
      if (lang) left.appendChild(lang);
      if (file) center.appendChild(file);
    } else {
      // windows (default)
      if (lang) left.appendChild(lang);
      if (file) left.appendChild(file);
    }
    right.appendChild(copy);

    bar.appendChild(left);
    bar.appendChild(center);
    bar.appendChild(right);
    return bar;
  }

  // Split HTML on newlines while preserving tag nesting.
  // Rouge sometimes embeds newlines inside <span> tokens (e.g. whitespace
  // spans in JSON, multi-line keyword spans in Bash). A naive split on
  // '\n' produces malformed HTML and visually merges lines. This walker
  // tracks open tags and closes/reopens them across line boundaries so
  // every line is well-formed.
  function smartSplitLines(html) {
    var lines = [];
    var current = '';
    var stack = []; // array of opening tag strings
    var i = 0, len = html.length;

    function closeOpenTags() {
      var out = '';
      for (var j = stack.length - 1; j >= 0; j--) {
        var nameMatch = stack[j].match(/^<(\w+)/);
        out += '</' + (nameMatch ? nameMatch[1] : 'span') + '>';
      }
      return out;
    }

    function reopenTags() {
      return stack.join('');
    }

    while (i < len) {
      var ch = html.charAt(i);

      if (ch === '<') {
        var end = html.indexOf('>', i);
        if (end < 0) {
          current += html.substring(i);
          break;
        }
        var tag = html.substring(i, end + 1);
        current += tag;

        if (tag.charAt(1) === '/') {
          stack.pop();
        } else if (tag.charAt(tag.length - 2) !== '/') {
          // Opening tag (not self-closing)
          stack.push(tag);
        }
        i = end + 1;
      } else if (ch === '\n') {
        current += closeOpenTags();
        lines.push(current);
        current = reopenTags();
        i++;
      } else {
        current += ch;
        i++;
      }
    }

    // Final line — close any remaining open tags for safety
    if (current.length > 0 || lines.length === 0) {
      current += closeOpenTags();
      lines.push(current);
    }
    return lines;
  }

  // Wrap each line of code in a span; optionally add line numbers and highlights.
  function processLines(codeEl, lineNumbers, highlightLines, zebra) {
    if (!lineNumbers && !zebra && (!highlightLines || !highlightLines.length)) return;

    var html = codeEl.innerHTML;
    if (html.charAt(html.length - 1) === '\n') html = html.slice(0, -1);

    var lines = smartSplitLines(html);
    var hl = highlightLines || [];
    var out = lines.map(function (line, idx) {
      var lineNum = idx + 1;
      var classes = ['code-line'];
      if (hl.indexOf(lineNum) >= 0) classes.push('code-line-highlighted');

      var inner = '';
      if (lineNumbers) {
        inner += '<span class="code-line-num" aria-hidden="true">' + lineNum + '</span>';
      }
      inner += '<span class="code-line-content">' + (line || '') + '</span>';
      return '<span class="' + classes.join(' ') + '">' + inner + '</span>';
    });
    codeEl.innerHTML = out.join('');
  }

  function getCodeText(codeEl) {
    // If we wrapped lines, extract only the content (skip line numbers)
    var contents = codeEl.querySelectorAll('.code-line-content');
    if (contents.length) {
      return Array.prototype.map.call(contents, function (el) {
        return el.textContent;
      }).join('\n');
    }
    return codeEl.textContent;
  }

  function setupCopy(button, codeEl) {
    button.addEventListener('click', function () {
      var text = getCodeText(codeEl);
      var done = function () {
        button.classList.add('copied');
        button.innerHTML = ICON_CHECK;
        button.setAttribute('aria-label', 'Copied!');
        setTimeout(function () {
          button.classList.remove('copied');
          button.innerHTML = ICON_COPY;
          button.setAttribute('aria-label', 'Copy code');
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.markdown-body');
    if (!article) return;

    var languages = window.LANGUAGES   || {};
    var defaults  = window.CODE_BLOCKS || {};
    var blocks    = article.querySelectorAll('div.highlighter-rouge');

    blocks.forEach(function (div) {
      var codeEl = div.querySelector('code');
      if (!codeEl) return;

      var language     = getLanguage(div);
      var filename     = attr(div, 'file');
      var windowStyle  = getWindowStyle(div, defaults);
      var lineNumbers  = getLineNumbers(div, defaults);
      var zebra        = getZebra(div, defaults);
      var highlights   = parseHighlightRanges(attr(div, 'highlight'));
      var langConfig   = language ? languages[language.toLowerCase()] : null;

      // Color cascade on outer div
      if (langConfig && langConfig.color) {
        div.style.setProperty('--lang-color', langConfig.color);
        div.classList.add('has-lang-color');
      }

      // Title bar
      var titleBar = buildTitleBar(language, filename, langConfig, windowStyle);
      div.insertBefore(titleBar, div.firstChild);
      div.classList.add('code-block-windowed', 'style-' + windowStyle);

      // Line processing (wraps lines for numbering, highlighting, and zebra)
      processLines(codeEl, lineNumbers, highlights, zebra);
      if (lineNumbers)      div.classList.add('has-line-numbers');
      if (highlights.length) div.classList.add('has-highlights');
      if (zebra)            div.classList.add('has-zebra');

      // Copy
      var copyBtn = titleBar.querySelector('.code-block-copy');
      if (copyBtn) setupCopy(copyBtn, codeEl);
    });
  });
})();