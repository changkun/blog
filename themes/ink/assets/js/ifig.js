// ifig: interactive figures for a post.
//
// A post lists its figure script in its front matter (scripts: [figures.js]);
// the script registers a figure for the image file it replaces. Each image in
// the post body with that file name is swapped, in the reader's browser, for
// a live figure drawn in the page's language and colors. Feeds, and readers
// without script, keep the image.
//
// A figure is drawn at the width it is shown at, so its text stays at real
// sizes on a phone, and drawn again when that width changes. Animation runs
// only while the figure is on screen, and not at all for readers who ask for
// reduced motion.
(function () {
  'use strict';
  var registry = {};
  var SVG = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs, parent) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  function svg(tag, attrs, parent) {
    var n = document.createElementNS(SVG, tag);
    for (var k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  // A label that may carry a subscript: sub('g', 'inst') draws g with inst
  // set below the line, the way the essay's math sets it.
  function sub(parent, base, subscript, attrs) {
    var t = svg('text', attrs, parent);
    svg('tspan', { style: 'font-family: var(--serif); font-style: italic; font-size: 17px', text: base }, t);
    if (subscript) svg('tspan', { dy: '0.3em', style: 'font-size: 11px', text: subscript }, t);
    return t;
  }

  function langOf(node) {
    var block = node.closest('.lang-en, .lang-zh');
    return block && block.classList.contains('lang-zh') ? 'zh' : 'en';
  }

  function button(parent, label, onClick) {
    var b = el('button', { type: 'button', class: 'ifig-button', text: label }, parent);
    b.addEventListener('click', onClick);
    return b;
  }

  // A labelled range input; format shows its value beside it.
  function slider(parent, opts) {
    var wrap = el('label', { class: 'ifig-slider' }, parent);
    el('span', { class: 'ifig-slider-label', text: opts.label }, wrap);
    var input = el('input', { type: 'range', min: opts.min, max: opts.max, step: opts.step, value: opts.value }, wrap);
    var out = el('span', { class: 'ifig-slider-value' }, wrap);
    function show() { out.textContent = opts.format ? opts.format(+input.value) : input.value; }
    input.addEventListener('input', function () { show(); opts.onInput(+input.value); });
    show();
    return input;
  }

  // Runs step(dt) every frame while the figure is on screen. step returns
  // false to stop; start() resumes. With reduced motion it never runs.
  function loop(root, step) {
    var visible = false, running = false, last = 0, wanted = true;
    function frame(t) {
      if (!visible || !wanted) { running = false; return; }
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (step(dt) === false) { wanted = false; running = false; return; }
      requestAnimationFrame(frame);
    }
    function kick() {
      if (reduced || running || !visible || !wanted) return;
      running = true; last = 0; requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      kick();
    }, { threshold: 0.15 }).observe(root);
    return { start: function () { wanted = true; kick(); }, stop: function () { wanted = false; } };
  }

  function mount() {
    var imgs = document.querySelectorAll('.post-body img');
    Array.prototype.forEach.call(imgs, function (img) {
      var file = (img.getAttribute('src') || '').split('/').pop();
      var build = registry[file];
      if (!build) return;
      var host = el('figure', { class: 'ifig', role: 'group', 'aria-label': img.getAttribute('alt') || '' });
      var stage = el('div', { class: 'ifig-stage' }, host);
      var controls = el('div', { class: 'ifig-controls' }, host);
      var lang = langOf(img);
      var anchor = img.closest('p') || img;
      anchor.parentNode.insertBefore(host, anchor);
      try {
        var fig = build({
          stage: stage, controls: controls, root: host, lang: lang, reduced: reduced,
          T: function (en, zh) { return lang === 'zh' ? zh : en; }
        });
        var width = 0;
        var redraw = function () {
          var w = Math.round(stage.clientWidth);
          if (!w || w === width) return;
          width = w;
          fig.resize(w);
        };
        new ResizeObserver(redraw).observe(stage);
        redraw();
        anchor.style.display = 'none';
        if (!controls.children.length) controls.remove();
      } catch (e) {
        host.remove();
        if (window.console) console.error('ifig: ' + file + ': ' + e.message);
      }
    });
  }

  window.ifig = {
    register: function (file, build) { registry[file] = build; },
    el: el, svg: svg, sub: sub, button: button, slider: slider, loop: loop, reduced: reduced
  };

  // The kit and the post's figure script both load deferred, and deferred
  // scripts run before DOMContentLoaded, so waiting for it lets the post's
  // script register its figures first.
  if (document.readyState === 'complete') mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
