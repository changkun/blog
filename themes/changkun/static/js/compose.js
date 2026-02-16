(function() {
  var DRAFT_KEY = 'compose-draft';
  var btn = document.getElementById('compose-btn');
  var overlay = document.getElementById('compose-overlay');
  var win = document.getElementById('compose-window');
  var closeBtn = document.getElementById('compose-close');
  var titleInput = document.getElementById('compose-title');
  var contentInput = document.getElementById('compose-content');
  var linesEl = document.getElementById('compose-lines');
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

  // Sync scroll between textarea and line numbers.
  contentInput.addEventListener('scroll', function() {
    linesEl.style.transform = 'translateY(-' + contentInput.scrollTop + 'px)';
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
    overlay.style.display = 'block';
    win.style.display = 'flex';
    status.textContent = '';
    sendBtn.disabled = false;
    updateLines();
    contentInput.focus();
  }

  function closeCompose() {
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
