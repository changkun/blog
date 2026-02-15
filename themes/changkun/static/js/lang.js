(function() {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  function getPreference() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en-US');
    updateToggle(lang);
  }

  function updateToggle(lang) {
    var label = document.getElementById('lang-toggle-label');
    if (!label) return;
    label.textContent = lang === 'en' ? '\uD83C\uDDE8\uD83C\uDDF3' : '\uD83C\uDDFA\uD83C\uDDF8';
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.title = lang === 'en' ? 'Switch to Chinese' : 'Switch to English';
  }

  window.toggleLang = function() {
    var current = getPreference();
    var next = current === 'en' ? 'zh' : 'en';
    localStorage.setItem(STORAGE_KEY, next);
    applyLang(next);
  };

  applyLang(getPreference());
})();
