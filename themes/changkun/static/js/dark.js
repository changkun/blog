(function() {
  var STORAGE_KEY = 'theme';

  function getPreference() {
    var pref = localStorage.getItem(STORAGE_KEY);
    // Migrate old 'dark-mode' key
    if (!pref) {
      var old = localStorage.getItem('dark-mode');
      if (old === 'true') { pref = 'dark'; }
      else if (old === 'false') { pref = 'light'; }
      else { pref = 'auto'; }
      localStorage.removeItem('dark-mode');
      localStorage.setItem(STORAGE_KEY, pref);
    }
    return pref;
  }

  function isDarkEffective(pref) {
    if (pref === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return pref === 'dark';
  }

  function applyTheme(pref) {
    var dark = isDarkEffective(pref);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    updateToggle(pref);
  }

  function updateToggle(pref) {
    var icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    icon.className = 'fa ' + (pref === 'light' ? 'fa-sun-o' : pref === 'dark' ? 'fa-moon-o' : 'fa-adjust');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.title = pref === 'light' ? 'Light mode (click to switch)' : pref === 'dark' ? 'Dark mode (click to switch)' : 'Auto / System (click to switch)';
    }
  }

  // Cycle: auto -> light -> dark -> auto
  window.cycleTheme = function() {
    var current = getPreference();
    var next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  // Listen for system theme changes when in auto mode
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if (getPreference() === 'auto') {
          applyTheme('auto');
        }
      });
    } catch (e) {
      // Fallback for older browsers
      window.matchMedia('(prefers-color-scheme: dark)').addListener(function() {
        if (getPreference() === 'auto') {
          applyTheme('auto');
        }
      });
    }
  }

  // Apply on load
  applyTheme(getPreference());

  // Reveal page (hidden in head.html to prevent flash)
  document.documentElement.style.visibility = '';
  document.documentElement.style.background = '';
})();
