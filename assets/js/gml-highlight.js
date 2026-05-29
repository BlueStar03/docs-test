/* ===========================================================
   GML Syntax Highlighter

   Tokenizes GameMaker Language (GML) code blocks client-side
   since Rouge has no GML lexer and Jekyll plugins are not
   allowed on GitHub Pages.

   Emits spans with Rouge-compatible token classes so the
   existing --syntax-* CSS variables apply automatically (works
   in both light and dark modes).

   Wraps bare <pre><code class="language-gml"> in the standard
   .highlighter-rouge structure so code-blocks.js can then apply
   window styling, line numbers, etc. normally.

   Enable via _config.yml:
     code_blocks:
       gml: true
   =========================================================== */

(function () {
  'use strict';

  // --- Word lists -------------------------------------------------

  var KEYWORDS = ['if','else','then','for','while','do','until','repeat',
    'switch','case','default','break','continue','return','exit','with',
    'var','globalvar','function','constructor','static','enum','new',
    'try','catch','finally','throw','delete','begin','end',
    'not','and','or','xor','mod','div'];

  var KEYWORD_CONSTANTS = ['true','false','undefined','noone',
    'pi','infinity','NaN','EPSILON'];

  var BUILTIN_VARS = ['self','other','global','local','all',
    'argument','argument_count','pointer_null','pointer_invalid'];

  // GMS namespace-prefixed builtin constants (vk_right, c_white, etc.)
  var BUILTIN_PATTERN = /^(vk|mb|c|cr|gp|ev|bm|fa|os|asset|buffer|audio|gpu|ds|tile|layer|particle|sprite|sound|font|path|room|timeline|script|shader|tileset|cmpfunc|cull|texfilter|browser|leaderboard|achievement|cloud|effect|matrix|cursor|btn|alignment|phy|pr|tf|spritespeed|orientation|mip|texture|aa|blend)_/;

  var KW  = arrayToSet(KEYWORDS);
  var KC  = arrayToSet(KEYWORD_CONSTANTS);
  var BV  = arrayToSet(BUILTIN_VARS);

  function arrayToSet(arr) {
    var s = {};
    for (var i = 0; i < arr.length; i++) s[arr[i]] = true;
    return s;
  }

  // --- Token type → Rouge CSS class ------------------------------

  var CLASS_MAP = {
    'comment-doc':   'cs',  // /// doc comment (special comment)
    'comment-line':  'c1',
    'comment-block': 'cm',
    'string':        's2',
    'template':      's2',
    'hex':           'mh',
    'number':        'mi',
    'macro':         'cp',  // preprocessor directives
    'keyword':       'k',
    'kconstant':     'kc',  // true/false/undefined/etc
    'bvariable':     'nv',  // self/other/global
    'builtin':       'nb',  // vk_*, c_*, etc.
    'function':      'nf',
    'operator':      'o',
    'punctuation':   'p',
    'identifier':    null,  // plain identifiers - no wrapping
    'whitespace':    null,
    'error':         'err'
  };

  // --- Token patterns (tried in order at each position) ----------

  var PATTERNS = [
    ['comment-doc',    /^\/\/\/[^\n]*/],
    ['comment-line',   /^\/\/[^\n]*/],
    ['comment-block',  /^\/\*[\s\S]*?\*\//],
    ['macro',          /^#(?:macro|region|endregion|define)\b[^\n]*/],
    ['string',         /^"(?:[^"\\]|\\.)*"/],
    ['template',       /^`(?:[^`\\]|\\.)*`/],
    ['hex',            /^(?:0x|\$)[0-9a-fA-F]+/],
    ['number',         /^\d+(?:\.\d+)?/],
    ['identifier',     /^[a-zA-Z_][a-zA-Z0-9_]*/],
    ['operator',       /^(?:\?\?|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|%=|<<|>>|[+\-*\/%=<>!&|^~?:])/],
    ['punctuation',    /^[\[\](){},;.]/],
    ['whitespace',     /^\s+/]
  ];

  // --- Tokenizer -------------------------------------------------

  function tokenize(code) {
    var tokens = [];
    var pos = 0;
    while (pos < code.length) {
      var rest = code.substr(pos);
      var matched = false;
      for (var i = 0; i < PATTERNS.length; i++) {
        var m = rest.match(PATTERNS[i][1]);
        if (m) {
          tokens.push([PATTERNS[i][0], m[0]]);
          pos += m[0].length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push(['error', code.charAt(pos)]);
        pos++;
      }
    }
    return tokens;
  }

  // --- Second-pass classification --------------------------------
  // Distinguish identifiers: keyword vs constant vs builtin vs function vs plain

  function classify(tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i][0] !== 'identifier') continue;
      var name = tokens[i][1];
      if (KW[name])        tokens[i][0] = 'keyword';
      else if (KC[name])   tokens[i][0] = 'kconstant';
      else if (BV[name])   tokens[i][0] = 'bvariable';
      else if (BUILTIN_PATTERN.test(name)) tokens[i][0] = 'builtin';
      else {
        // Look ahead past whitespace for '(' to detect a function call
        var j = i + 1;
        while (j < tokens.length && tokens[j][0] === 'whitespace') j++;
        if (j < tokens.length && tokens[j][1] === '(') {
          tokens[i][0] = 'function';
        }
      }
    }
    return tokens;
  }

  // --- HTML emission ---------------------------------------------

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function tokensToHtml(tokens) {
    var out = '';
    for (var i = 0; i < tokens.length; i++) {
      var cls = CLASS_MAP[tokens[i][0]];
      var text = escapeHtml(tokens[i][1]);
      out += cls ? '<span class="' + cls + '">' + text + '</span>' : text;
    }
    return out;
  }

  // --- Rouge structure wrapping ----------------------------------
  // For Rouge-recognized languages, kramdown puts IAL attributes on
  // the outer wrapping div. For unrecognized languages like GML, the
  // attributes land on the <pre> instead. We need to transfer them
  // onto the new wrapping div so code-blocks.js reads them correctly.

  var IAL_ATTRS = ['file', 'data-file', 'window', 'data-window',
                   'numbers', 'data-numbers', 'zebra', 'data-zebra',
                   'highlight', 'data-highlight'];

  function wrapInRougeStructure(code) {
    var pre = code.parentNode;
    if (!pre || pre.tagName !== 'PRE') return;
    if (pre.parentNode && pre.parentNode.classList &&
        pre.parentNode.classList.contains('highlight')) {
      return; // already wrapped
    }
    var outer = document.createElement('div');
    outer.className = 'language-gml highlighter-rouge';

    // Transfer IAL attributes from <pre> to outer <div>
    for (var i = 0; i < IAL_ATTRS.length; i++) {
      var name = IAL_ATTRS[i];
      if (pre.hasAttribute(name)) {
        outer.setAttribute(name, pre.getAttribute(name));
        pre.removeAttribute(name);
      }
    }

    var inner = document.createElement('div');
    inner.className = 'highlight';
    pre.parentNode.insertBefore(outer, pre);
    outer.appendChild(inner);
    inner.appendChild(pre);
    pre.classList.add('highlight');
  }

  // --- Entry point -----------------------------------------------

  function init() {
    var defaults = window.CODE_BLOCKS || {};
    if (!defaults.gml) return;

    var codes = document.querySelectorAll('code.language-gml');
    Array.prototype.forEach.call(codes, function (code) {
      var text = code.textContent;
      var tokens = classify(tokenize(text));
      code.innerHTML = tokensToHtml(tokens);
      wrapInRougeStructure(code);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();