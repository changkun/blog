(function() {
  var DRAFT_KEY = 'compose-draft';
  var btn = document.getElementById('compose-btn');
  var overlay = document.getElementById('compose-overlay');
  var win = document.getElementById('compose-window');
  var closeBtn = document.getElementById('compose-close');
  var titleInput = document.getElementById('compose-title');
  var contentInput = document.getElementById('compose-content');
  var linesEl = document.getElementById('compose-lines');
  var highlightEl = document.getElementById('compose-highlight');
  var sendBtn = document.getElementById('compose-send');
  var status = document.getElementById('compose-status');
  var toast = document.getElementById('compose-toast');

  // Restore draft from localStorage.
  var draft = {};
  try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch(e) {}
  if (draft.title) titleInput.value = draft.title;
  if (draft.content) contentInput.value = draft.content;

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      title: titleInput.value,
      content: contentInput.value
    }));
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  titleInput.addEventListener('input', saveDraft);
  contentInput.addEventListener('input', function() {
    saveDraft();
    updateLines();
    updateHighlight();
  });

  // Line numbers.
  function updateLines() {
    var lines = contentInput.value.split('\n');
    var count = Math.max(lines.length, 1);
    var html = '';
    for (var i = 1; i <= count; i++) {
      html += '<span>' + i + '</span>';
    }
    linesEl.innerHTML = html;
  }
  updateLines();

  // Markdown syntax highlighting.
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightMarkdown(text) {
    var lines = text.split('\n');
    var result = [];
    var inCodeBlock = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // Toggle fenced code blocks.
      if (/^```/.test(line)) {
        inCodeBlock = !inCodeBlock;
        result.push('<span class="md-codeblock">' + escapeHtml(line) + '</span>');
        continue;
      }

      if (inCodeBlock) {
        result.push('<span class="md-code">' + escapeHtml(line) + '</span>');
        continue;
      }

      // Headers.
      var hMatch = line.match(/^(#{1,6}\s)/);
      if (hMatch) {
        result.push('<span class="md-h">' + escapeHtml(hMatch[1]) + '</span>' + highlightInline(line.slice(hMatch[1].length)));
        continue;
      }

      // Blockquotes.
      var bqMatch = line.match(/^(\s*>\s*)/);
      if (bqMatch) {
        result.push('<span class="md-blockquote">' + escapeHtml(bqMatch[1]) + '</span>' + highlightInline(line.slice(bqMatch[1].length)));
        continue;
      }

      // Horizontal rules.
      if (/^\s*([-*_])\s*\1\s*\1[\s\1]*$/.test(line)) {
        result.push('<span class="md-hr">' + escapeHtml(line) + '</span>');
        continue;
      }

      // Unordered list items.
      var ulMatch = line.match(/^(\s*[-*+]\s)/);
      if (ulMatch) {
        result.push('<span class="md-list">' + escapeHtml(ulMatch[1]) + '</span>' + highlightInline(line.slice(ulMatch[1].length)));
        continue;
      }

      // Ordered list items.
      var olMatch = line.match(/^(\s*\d+\.\s)/);
      if (olMatch) {
        result.push('<span class="md-list">' + escapeHtml(olMatch[1]) + '</span>' + highlightInline(line.slice(olMatch[1].length)));
        continue;
      }

      result.push(highlightInline(line));
    }

    return result.join('\n');
  }

  function highlightInline(text) {
    // Process inline markdown by scanning character by character to handle
    // nesting correctly and avoid conflicts between patterns.
    var tokens = [];
    var i = 0;
    var len = text.length;

    while (i < len) {
      // Images: ![alt](url)
      if (text[i] === '!' && text[i + 1] === '[') {
        var altEnd = text.indexOf(']', i + 2);
        if (altEnd !== -1 && text[altEnd + 1] === '(') {
          var urlEnd = text.indexOf(')', altEnd + 2);
          if (urlEnd !== -1) {
            tokens.push('<span class="md-img">' + escapeHtml(text.slice(i, urlEnd + 1)) + '</span>');
            i = urlEnd + 1;
            continue;
          }
        }
      }

      // Links: [text](url)
      if (text[i] === '[') {
        var tEnd = text.indexOf(']', i + 1);
        if (tEnd !== -1 && text[tEnd + 1] === '(') {
          var uEnd = text.indexOf(')', tEnd + 2);
          if (uEnd !== -1) {
            tokens.push(
              '<span class="md-link-punc">[</span>' +
              '<span class="md-link-text">' + escapeHtml(text.slice(i + 1, tEnd)) + '</span>' +
              '<span class="md-link-punc">](</span>' +
              '<span class="md-link-url">' + escapeHtml(text.slice(tEnd + 2, uEnd)) + '</span>' +
              '<span class="md-link-punc">)</span>'
            );
            i = uEnd + 1;
            continue;
          }
        }
      }

      // Inline code: `code`
      if (text[i] === '`') {
        var cEnd = text.indexOf('`', i + 1);
        if (cEnd !== -1) {
          tokens.push('<span class="md-code">' + escapeHtml(text.slice(i, cEnd + 1)) + '</span>');
          i = cEnd + 1;
          continue;
        }
      }

      // Strikethrough: ~~text~~
      if (text[i] === '~' && text[i + 1] === '~') {
        var sEnd = text.indexOf('~~', i + 2);
        if (sEnd !== -1) {
          tokens.push('<span class="md-strike">' + escapeHtml(text.slice(i, sEnd + 2)) + '</span>');
          i = sEnd + 2;
          continue;
        }
      }

      // Bold: **text** or __text__
      if ((text[i] === '*' && text[i + 1] === '*') || (text[i] === '_' && text[i + 1] === '_')) {
        var marker = text.slice(i, i + 2);
        var bEnd = text.indexOf(marker, i + 2);
        if (bEnd !== -1) {
          tokens.push('<span class="md-bold">' + escapeHtml(text.slice(i, bEnd + 2)) + '</span>');
          i = bEnd + 2;
          continue;
        }
      }

      // Italic: *text* or _text_ (single marker, not followed by same)
      if ((text[i] === '*' && text[i + 1] !== '*') || (text[i] === '_' && text[i + 1] !== '_')) {
        var m = text[i];
        var iEnd = text.indexOf(m, i + 1);
        if (iEnd !== -1 && iEnd > i + 1) {
          tokens.push('<span class="md-italic">' + escapeHtml(text.slice(i, iEnd + 1)) + '</span>');
          i = iEnd + 1;
          continue;
        }
      }

      // Plain character.
      tokens.push(escapeHtml(text[i]));
      i++;
    }

    return tokens.join('');
  }

  function updateHighlight() {
    highlightEl.innerHTML = highlightMarkdown(contentInput.value) + '\n';
  }
  updateHighlight();

  // Sync scroll between textarea, line numbers, and highlight overlay.
  contentInput.addEventListener('scroll', function() {
    linesEl.scrollTop = contentInput.scrollTop;
    highlightEl.style.transform = 'translateY(-' + contentInput.scrollTop + 'px)';
  });

  // Bilingual placeholders.
  function updatePlaceholders() {
    var zh = document.documentElement.getAttribute('data-lang') === 'zh';
    titleInput.placeholder = zh ? '标题（可选）' : 'Title (optional)';
    contentInput.placeholder = zh ? '写下你的想法...' : 'Write your idea...';
  }
  updatePlaceholders();
  new MutationObserver(updatePlaceholders).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });

  // Auth: check eagerly on load, cache result for instant click.
  var authed = false;
  if (typeof changkunLogin !== 'undefined') {
    changkunLogin.check().then(function(res) { authed = res.ok; }).catch(function() {});
  }

  function isZh() {
    return document.documentElement.getAttribute('data-lang') === 'zh';
  }

  btn.addEventListener('click', function() {
    if (typeof changkunLogin === 'undefined') {
      showToast(isZh() ? '登录服务不可用' : 'Login service unavailable');
      return;
    }
    if (authed) {
      openCompose();
      return;
    }
    btn.disabled = true;
    btn.style.opacity = '0.4';
    changkunLogin.check().then(function(res) {
      btn.disabled = false;
      btn.style.opacity = '';
      if (!res.ok) {
        changkunLogin.login(window.location.href);
      } else {
        authed = true;
        openCompose();
      }
    }).catch(function() {
      btn.disabled = false;
      btn.style.opacity = '';
      showToast(isZh() ? '登录服务不可用' : 'Login service unavailable');
    });
  });

  function openCompose() {
    document.body.style.overflow = 'hidden';
    overlay.style.display = 'block';
    win.style.display = 'flex';
    status.textContent = '';
    sendBtn.disabled = false;
    updateLines();
    updateHighlight();
    contentInput.focus();
  }

  function closeCompose() {
    document.body.style.overflow = '';
    overlay.style.display = 'none';
    win.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeCompose);
  overlay.addEventListener('click', closeCompose);

  // Escape to close.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && win.style.display === 'flex') {
      closeCompose();
    }
  });

  // Send.
  function send() {
    var content = contentInput.value.trim();
    if (!content) {
      status.textContent = isZh() ? '内容不能为空' : 'Content cannot be empty';
      return;
    }

    sendBtn.disabled = true;
    var zh = isZh();
    status.textContent = zh ? '发送中...' : 'Sending...';

    var token = '';
    try { token = changkunLogin.getToken(); } catch(e) {}

    fetch('https://api.changkun.de/ideas/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        title: titleInput.value.trim(),
        content: content
      })
    }).then(function(resp) {
      if (resp.status === 401) {
        authed = false;
        sendBtn.disabled = false;
        status.textContent = '';
        changkunLogin.login(window.location.href);
        return;
      }
      return resp.json().then(function(data) {
        if (data.ok) {
          titleInput.value = '';
          contentInput.value = '';
          clearDraft();
          updateLines();
          updateHighlight();
          closeCompose();
          showToast(zh ? '想法已提交！稍后会出现。' : 'Idea submitted! It will appear shortly.');
        } else {
          status.textContent = data.message || (zh ? '发送失败' : 'Send failed');
          sendBtn.disabled = false;
        }
      });
    }).catch(function() {
      status.textContent = zh ? '网络错误，请重试' : 'Network error, please retry';
      sendBtn.disabled = false;
    });
  }

  sendBtn.addEventListener('click', send);

  // Cmd/Ctrl+Enter to send.
  contentInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  });

  // Toast.
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 4000);
  }
})();
