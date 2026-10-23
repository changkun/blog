(function() {
  var DRAFT_KEY = 'compose-draft';
  var EXPAND_KEY = 'compose-expanded';
  var REOPEN_KEY = 'compose-reopen';
  var MARKED_URL = 'https://cdnjs.cloudflare.com/ajax/libs/marked/15.0.7/marked.min.js';
  var MARKED_SRI = 'sha384-H+hy9ULve6xfxRkWIh/YOtvDdpXgV2fmAGQkIDTxIgZwNoaoBal14Di2YTMR6MzR';

  var btn = document.getElementById('compose-btn');
  var overlay = document.getElementById('compose-overlay');
  var win = document.getElementById('compose-window');
  var dateEl = document.getElementById('compose-date');
  var expandBtn = document.getElementById('compose-expand');
  var closeBtn = document.getElementById('compose-close');
  var titleInput = document.getElementById('compose-title');
  var contentInput = document.getElementById('compose-content');
  var previewTitle = document.getElementById('compose-preview-title');
  var previewBody = document.getElementById('compose-preview-body');
  var writePane = contentInput.parentNode;
  var previewPane = previewBody.parentNode;
  var modeBtns = win.querySelectorAll('.compose-mode');
  var toolBtns = win.querySelectorAll('[data-tool]');
  var countEl = document.getElementById('compose-count');
  var sendBtn = document.getElementById('compose-send');
  var status = document.getElementById('compose-status');
  var toast = document.getElementById('compose-toast');

  var mac = /Mac|iPhone|iPad/.test(navigator.platform);
  var mod = mac ? '⌘' : 'Ctrl+';

  function isZh() {
    return document.documentElement.getAttribute('data-lang') === 'zh';
  }

  // Restore draft from localStorage.
  var draft = {};
  try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch(e) {}
  if (draft.title) titleInput.value = draft.title;
  if (draft.content) contentInput.value = draft.content;

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        title: titleInput.value,
        content: contentInput.value
      }));
    } catch(e) {}
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch(e) {}
  }

  // Title and text grow with what is in them inside one scrolling pane.
  // Sizing goes through 'auto' first, which would clamp the pane's scroll,
  // so the scroll is put back after.
  function fit(el) {
    var top = writePane.scrollTop;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    writePane.scrollTop = top;
  }

  function fitAll() {
    if (writePane.offsetParent === null) return;
    fit(titleInput);
    fit(contentInput);
  }

  // The title is one line that wraps as it grows; Enter moves on to the text.
  function fitTitle() {
    if (writePane.offsetParent !== null) fit(titleInput);
  }

  titleInput.addEventListener('input', function() {
    if (titleInput.value.indexOf('\n') !== -1) {
      titleInput.value = titleInput.value.replace(/\s*\n\s*/g, ' ');
    }
    fitTitle();
    saveDraft();
    schedulePreview();
  });

  titleInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && !e.isComposing) {
      e.preventDefault();
      contentInput.focus();
    }
  });

  contentInput.addEventListener('input', function() {
    fit(contentInput);
    // Typing at the end grows the text below the fold; follow it.
    if (contentInput.selectionEnd === contentInput.value.length) {
      writePane.scrollTop = writePane.scrollHeight;
    }
    saveDraft();
    updateCount();
    schedulePreview();
  });

  window.addEventListener('resize', function() {
    if (win.style.display === 'flex') fitAll();
  });

  // Words, with each Chinese or Japanese character counted as one.
  var CJK = /[぀-ヿ㐀-鿿豈-﫿가-힯]/g;
  function updateCount() {
    var text = contentInput.value;
    var n = (text.match(CJK) || []).length +
      (text.replace(CJK, ' ').match(/[A-Za-z0-9À-ɏ'’-]+/g) || []).length;
    countEl.textContent = isZh() ? n + ' 字' : n + (n === 1 ? ' word' : ' words');
  }

  // Formatting. Edits go through insertText so the browser's undo keeps them.
  function insert(text) {
    contentInput.focus();
    if (!document.execCommand('insertText', false, text)) {
      contentInput.setRangeText(text, contentInput.selectionStart, contentInput.selectionEnd, 'end');
      contentInput.dispatchEvent(new Event('input'));
    }
  }

  // Wraps the selection in marks, or unwraps it when the marks are there.
  function wrap(before, after, placeholder) {
    var v = contentInput.value;
    var s = contentInput.selectionStart;
    var e = contentInput.selectionEnd;
    var sel = v.slice(s, e);
    if (v.slice(s - before.length, s) === before && v.slice(e, e + after.length) === after) {
      contentInput.setSelectionRange(s - before.length, e + after.length);
      insert(sel);
      contentInput.setSelectionRange(s - before.length, e - before.length);
      return;
    }
    var text = sel || placeholder;
    insert(before + text + after);
    contentInput.setSelectionRange(s + before.length, s + before.length + text.length);
  }

  // Puts a mark at the start of every selected line, or takes it off when
  // every line has it already.
  var LINE_MARKS = {
    heading: { re: /^#{1,6}\s/, add: function() { return '## '; } },
    quote: { re: /^>\s?/, add: function() { return '> '; } },
    list: { re: /^([-*+]|\d+\.)\s/, own: /^[-*+]\s/, add: function() { return '- '; } },
    ordered: { re: /^([-*+]|\d+\.)\s/, own: /^\d+\.\s/, add: function(i) { return (i + 1) + '. '; } }
  };

  function markLines(kind) {
    var mark = LINE_MARKS[kind];
    var own = mark.own || mark.re;
    var v = contentInput.value;
    var s = contentInput.selectionStart;
    var e = contentInput.selectionEnd;
    if (e > s && v[e - 1] === '\n') e--;
    var start = v.lastIndexOf('\n', s - 1) + 1;
    var end = v.indexOf('\n', e);
    if (end === -1) end = v.length;
    var lines = v.slice(start, end).split('\n');
    var all = lines.every(function(l) { return own.test(l); });
    var out = lines.map(function(l, i) {
      return all ? l.replace(own, '') : mark.add(i) + l.replace(mark.re, '');
    }).join('\n');
    contentInput.setSelectionRange(start, end);
    insert(out);
    if (s === e) {
      contentInput.setSelectionRange(start + out.length, start + out.length);
    } else {
      contentInput.setSelectionRange(start, start + out.length);
    }
  }

  var TOOLS = {
    bold: function() { wrap('**', '**', isZh() ? '粗体' : 'bold'); },
    italic: function() { wrap('*', '*', isZh() ? '斜体' : 'italic'); },
    heading: function() { markLines('heading'); },
    quote: function() { markLines('quote'); },
    list: function() { markLines('list'); },
    ordered: function() { markLines('ordered'); },
    code: function() {
      var sel = contentInput.value.slice(contentInput.selectionStart, contentInput.selectionEnd);
      if (sel.indexOf('\n') !== -1) wrap('```\n', '\n```', '');
      else wrap('`', '`', 'code');
    },
    link: function() {
      var s = contentInput.selectionStart;
      var sel = contentInput.value.slice(s, contentInput.selectionEnd);
      if (/^https?:\/\/\S+$/.test(sel)) {
        var text = isZh() ? '链接' : 'text';
        insert('[' + text + '](' + sel + ')');
        contentInput.setSelectionRange(s + 1, s + 1 + text.length);
      } else {
        insert('[' + (sel || (isZh() ? '链接' : 'text')) + '](https://)');
        var url = s + 1 + (sel || (isZh() ? '链接' : 'text')).length + 2;
        contentInput.setSelectionRange(url, url + 8);
      }
    }
  };

  for (var t = 0; t < toolBtns.length; t++) {
    // Keep the text's focus and selection, and a phone's keyboard, open.
    toolBtns[t].addEventListener('mousedown', function(e) { e.preventDefault(); });
    toolBtns[t].addEventListener('click', function() {
      if (contentInput.offsetParent === null) setMode('write');
      TOOLS[this.getAttribute('data-tool')]();
    });
  }

  contentInput.addEventListener('keydown', function(e) {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
    var tool = { b: 'bold', i: 'italic', k: 'link' }[e.key.toLowerCase()];
    if (tool) {
      e.preventDefault();
      TOOLS[tool]();
    }
  });

  // Write and Preview. Expanded on a wide screen, both show at once.
  function setMode(mode) {
    win.setAttribute('data-mode', mode);
    for (var i = 0; i < modeBtns.length; i++) {
      modeBtns[i].setAttribute('aria-pressed', modeBtns[i].getAttribute('data-mode') === mode ? 'true' : 'false');
    }
    if (mode === 'write') {
      fitAll();
      contentInput.focus();
    }
    renderPreview();
  }

  for (var m = 0; m < modeBtns.length; m++) {
    modeBtns[m].addEventListener('click', function() {
      setMode(this.getAttribute('data-mode'));
    });
  }

  // The preview renders with marked, fetched the first time it is needed.
  var markedLoad = null;
  function loadMarked() {
    if (window.marked) return Promise.resolve(window.marked);
    if (!markedLoad) {
      markedLoad = new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = MARKED_URL;
        s.integrity = MARKED_SRI;
        s.crossOrigin = 'anonymous';
        s.onload = function() { resolve(window.marked); };
        s.onerror = function() { markedLoad = null; reject(); };
        document.head.appendChild(s);
      });
    }
    return markedLoad;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var previewTimer = null;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(renderPreview, 150);
  }

  function renderPreview() {
    if (previewPane.offsetParent === null) return;
    var title = titleInput.value.trim();
    previewTitle.textContent = title;
    previewTitle.style.display = title ? '' : 'none';
    // The site adds its language and deep-dive shortcodes itself; a draft
    // that carries them previews without.
    var src = contentInput.value.replace(/\{\{[%<]\s*\/?\s*(en|zh|augmented)\s*[%>]\}\}/g, '');
    if (!src.trim()) {
      previewBody.innerHTML = '<p class="compose-preview-empty">' +
        (isZh() ? '还没有内容可以预览。' : 'Nothing to preview yet.') + '</p>';
      return;
    }
    loadMarked().then(function(marked) {
      // Math stays out of the parser's way and goes to MathJax after.
      var math = [];
      var held = src.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, function(x) {
        math.push(x);
        return '@@MATH' + (math.length - 1) + '@@';
      });
      previewBody.innerHTML = marked.parse(held).replace(/@@MATH(\d+)@@/g, function(_, i) {
        return escapeHtml(math[+i]);
      });
      if (math.length && window.MathJax && MathJax.Hub) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, previewBody]);
      }
    }).catch(function() {
      previewBody.innerHTML = '<p class="compose-preview-empty">' +
        (isZh() ? '预览加载失败。' : 'The preview could not load.') + '</p>';
    });
  }

  // Expand: the window grows to nearly the whole screen, and stays so the
  // next time it opens.
  var expanded = false;
  try { expanded = localStorage.getItem(EXPAND_KEY) === '1'; } catch(e) {}
  win.classList.toggle('expanded', expanded);

  expandBtn.addEventListener('click', function() {
    expanded = !expanded;
    win.classList.toggle('expanded', expanded);
    try { localStorage.setItem(EXPAND_KEY, expanded ? '1' : ''); } catch(e) {}
    updateLabels();
    fitAll();
    renderPreview();
    if (contentInput.offsetParent !== null) contentInput.focus();
  });

  // On phones the window is a full sheet over the visual viewport, which
  // the on-screen keyboard shrinks; the stylesheet reads these two values.
  function fitViewport() {
    var vv = window.visualViewport;
    if (!vv) return;
    win.style.setProperty('--compose-top', vv.offsetTop + 'px');
    win.style.setProperty('--compose-height', vv.height + 'px');
    if (win.style.display === 'flex') fitAll();
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fitViewport);
    window.visualViewport.addEventListener('scroll', fitViewport);
  }

  // Bilingual placeholders and button labels.
  var TOOL_LABELS = {
    bold: ['Bold', '粗体', 'B'],
    italic: ['Italic', '斜体', 'I'],
    heading: ['Heading', '标题'],
    quote: ['Quote', '引用'],
    list: ['List', '列表'],
    ordered: ['Numbered list', '编号列表'],
    code: ['Code', '代码'],
    link: ['Link', '链接', 'K']
  };

  function label(el, text) {
    el.setAttribute('aria-label', text);
    el.title = text;
  }

  function updateLabels() {
    var zh = isZh();
    titleInput.placeholder = zh ? '标题（可选）' : 'Title (optional)';
    contentInput.placeholder = zh ? '写下你的想法，支持 Markdown。' : 'Write your idea. Markdown works.';
    label(expandBtn, expanded ? (zh ? '还原' : 'Restore') : (zh ? '展开，并排预览' : 'Expand, with preview alongside'));
    label(closeBtn, zh ? '关闭' : 'Close');
    sendBtn.title = mod + 'Enter';
    for (var i = 0; i < toolBtns.length; i++) {
      var l = TOOL_LABELS[toolBtns[i].getAttribute('data-tool')];
      label(toolBtns[i], l[zh ? 1 : 0] + (l[2] ? ' (' + mod + l[2] + ')' : ''));
    }
    updateCount();
  }
  updateLabels();
  new MutationObserver(function() {
    updateLabels();
    renderPreview();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });

  // Auth: a valid token is known synchronously from localStorage. On load we
  // also finish any pending login redirect (?code=...) and, if we came back
  // from logging in to compose, reopen the window automatically.
  var authed = false;
  if (typeof latereAuth !== 'undefined') {
    authed = latereAuth.hasValidToken();
    latereAuth.handleCallback().then(function(ok) {
      authed = ok;
      if (ok && sessionStorage.getItem(REOPEN_KEY)) {
        sessionStorage.removeItem(REOPEN_KEY);
        openCompose();
      }
    });
  }

  btn.addEventListener('click', function() {
    if (typeof latereAuth === 'undefined') {
      showToast(isZh() ? '登录服务不可用' : 'Login service unavailable');
      return;
    }
    if (authed) {
      openCompose();
      return;
    }
    sessionStorage.setItem(REOPEN_KEY, '1');
    latereAuth.login(window.location.href);
  });

  function today() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function openCompose() {
    document.body.style.overflow = 'hidden';
    overlay.style.display = 'block';
    win.style.display = 'flex';
    dateEl.textContent = today();
    status.textContent = '';
    sendBtn.disabled = false;
    fitViewport();
    updateCount();
    setMode('write');
    // Pick a draft up where it ends.
    var end = contentInput.value.length;
    contentInput.setSelectionRange(end, end);
    if (end) writePane.scrollTop = writePane.scrollHeight;
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

    latereAuth.getToken().then(function(token) {
      if (!token) {
        authed = false;
        sendBtn.disabled = false;
        status.textContent = '';
        sessionStorage.setItem(REOPEN_KEY, '1');
        latereAuth.login(window.location.href);
        return;
      }
      return fetch('https://api.changkun.de/ideas/post', {
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
        latereAuth.logout();
        sessionStorage.setItem(REOPEN_KEY, '1');
        latereAuth.login(window.location.href);
        return;
      }
      return resp.json().then(function(data) {
        if (data.ok) {
          titleInput.value = '';
          contentInput.value = '';
          clearDraft();
          updateCount();
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
    });
  }

  sendBtn.addEventListener('click', send);

  // Cmd/Ctrl+Enter to send, from the title or the text.
  win.addEventListener('keydown', function(e) {
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
