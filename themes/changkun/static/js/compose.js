(function() {
  var DRAFT_KEY = 'compose-draft';
  var fab = document.getElementById('compose-fab');
  var win = document.getElementById('compose-window');
  var closeBtn = document.getElementById('compose-close');
  var titleInput = document.getElementById('compose-title');
  var contentInput = document.getElementById('compose-content');
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
  contentInput.addEventListener('input', saveDraft);

  // Bilingual placeholders.
  function updatePlaceholders() {
    var zh = document.documentElement.getAttribute('data-lang') === 'zh';
    titleInput.placeholder = zh ? '标题（可选）' : 'Title (optional)';
    contentInput.placeholder = zh ? '写下你的想法...' : 'Write your idea...';
  }
  updatePlaceholders();
  new MutationObserver(updatePlaceholders).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });

  // Auth + open.
  fab.addEventListener('click', function() {
    if (typeof changkunLogin === 'undefined') {
      showToast('Login SDK not loaded');
      return;
    }
    changkunLogin.check().then(function(res) {
      if (!res.ok) {
        changkunLogin.login(window.location.href);
      } else {
        openCompose();
      }
    }).catch(function() {
      changkunLogin.login(window.location.href);
    });
  });

  function openCompose() {
    win.style.display = 'flex';
    fab.style.display = 'none';
    status.textContent = '';
    contentInput.focus();
  }

  function closeCompose() {
    win.style.display = 'none';
    fab.style.display = '';
  }

  closeBtn.addEventListener('click', closeCompose);

  // Send.
  function send() {
    var content = contentInput.value.trim();
    if (!content) {
      var zh = document.documentElement.getAttribute('data-lang') === 'zh';
      status.textContent = zh ? '内容不能为空' : 'Content cannot be empty';
      return;
    }

    sendBtn.disabled = true;
    var zh = document.documentElement.getAttribute('data-lang') === 'zh';
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
        changkunLogin.login(window.location.href);
        return;
      }
      return resp.json().then(function(data) {
        if (data.ok) {
          titleInput.value = '';
          contentInput.value = '';
          clearDraft();
          closeCompose();
          showToast(zh ? '想法已提交！稍后会出现。' : 'Idea submitted! It will appear shortly.');
        } else {
          status.textContent = data.message || (zh ? '发送失败' : 'Send failed');
          sendBtn.disabled = false;
        }
      });
    }).catch(function(err) {
      status.textContent = zh ? '网络错误' : 'Network error';
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
