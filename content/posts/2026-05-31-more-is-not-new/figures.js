// The four figures of "Why High-Output Systems Are Often the First to Stop
// Growing", drawn with the blog's figure kit (themes/ink/assets/js/ifig.js).
// Each replaces the image of the same name, in the language of the block it
// sits in. Every number a figure shows is computed from the model stated
// above it; none is data.
(function () {
  'use strict';
  var F = window.ifig;
  if (!F) return;
  var svg = F.svg, sub = F.sub, el = F.el;

  // Text width for wrapping labels, measured the way the page sets them.
  var measure = document.createElement('canvas').getContext('2d');
  function wrap(text, font, max) {
    measure.font = font;
    var cjk = /[　-鿿]/.test(text);
    var parts = cjk ? Array.from(text) : text.split(' ');
    var lines = [], line = '';
    parts.forEach(function (p) {
      var next = line ? line + (cjk ? '' : ' ') + p : p;
      if (measure.measureText(next).width > max && line) { lines.push(line); line = p; }
      else line = next;
    });
    if (line) lines.push(line);
    return lines;
  }
  var SANS = getComputedStyle(document.body).fontFamily;

  function arrow(parent, x1, y1, x2, y2, cls) {
    var g = svg('g', { class: cls || '' }, parent);
    svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'currentColor', 'stroke-width': 1.4 }, g);
    var a = Math.atan2(y2 - y1, x2 - x1), s = 6;
    svg('path', {
      d: 'M' + (x2 - s * Math.cos(a - 0.45)) + ',' + (y2 - s * Math.sin(a - 0.45)) + ' L' + x2 + ',' + y2 +
         ' L' + (x2 - s * Math.cos(a + 0.45)) + ',' + (y2 - s * Math.sin(a + 0.45)),
      fill: 'none', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linejoin': 'round'
    }, g);
    return g;
  }

  // ------------------------------------------------------------------
  // Figure 1: instances fill a level, primitives open a new one.
  //
  // The vocabulary is the Game of Life's own ladder: gliders, then guns that
  // emit gliders, then logic gates built from gun streams, then computers
  // built from gates. A new instance adds a dot to the top level; a new
  // primitive opens the next level. Played on its own, the figure adds
  // instances and promotes a primitive every seventh.
  F.register('fig2-hierarchy.png', function (f) {
    var T = f.T;
    var NAMES = T(['gliders', 'glider guns', 'logic gates', 'computers'], ['滑翔机', '滑翔机枪', '逻辑门', '计算机']);
    var LEVELS = NAMES.length, SHOWN = 9, PER = 7;
    var state = f.reduced ? [PER, PER, PER] : [2];
    var born = null, auto = !f.reduced, clock = 0, pause = 0, width = 0;
    var root = svg('svg', { role: 'img', 'aria-label': T('Instances fill a level; primitives open a new one', '实例填满一层，原语打开新的一层') }, f.stage);

    var bInst = F.button(f.controls, T('+ instance', '+ 实例'), function () { take(); addInstance(); });
    var bPrim = F.button(f.controls, T('+ primitive', '+ 原语'), function () { take(); addPrimitive(); });
    F.button(f.controls, T('reset', '重置'), function () { take(); state = [2]; born = null; draw(); });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    function take() { auto = false; }
    function addInstance() { state[state.length - 1]++; born = { level: state.length - 1, age: 0 }; draw(); if (anim) anim.start(); }
    function addPrimitive() { if (state.length < LEVELS) { state.push(1); born = { level: state.length - 1, age: 0 }; draw(); if (anim) anim.start(); } }

    var anim = F.loop(f.root, function (dt) {
      if (born) { born.age += dt; if (born.age > 0.3) born.age = 0.3; }
      if (auto) {
        clock += dt;
        if (pause > 0) { pause -= dt; if (pause <= 0) { state = [2]; born = null; } }
        else if (clock > 0.55) {
          clock = 0;
          var top = state[state.length - 1];
          if (top < PER) addInstance();
          else if (state.length < LEVELS) addPrimitive();
          else pause = 2.5;
        }
      }
      draw();
      return auto || (born && born.age < 0.3);
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, side = 46, boxW = W - side - 8, lh = 56, gap = 12;
      var H = LEVELS * lh + (LEVELS - 1) * gap + 44;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      for (var i = 0; i < LEVELS; i++) {
        var y = (LEVELS - 1 - i) * (lh + gap);
        var open = i < state.length, current = i === state.length - 1;
        svg('rect', {
          x: 0.5, y: y + 0.5, width: boxW, height: lh, rx: 10,
          fill: open ? 'var(--bg-raised)' : 'none',
          stroke: current ? 'var(--navy)' : 'var(--border-strong)',
          'stroke-width': current ? 1.5 : 1, 'stroke-dasharray': open ? 'none' : '4 4'
        }, root);
        svg('text', { x: 14, y: y + 20, text: T('primitives: ', '原语：') + NAMES[i], opacity: open ? 1 : 0.5 }, root);
        if (!open) continue;
        var n = state[i], shown = Math.min(n, SHOWN), step = Math.min(26, (boxW - 90) / SHOWN);
        for (var d = 0; d < shown; d++) {
          var r = 5;
          if (born && born.level === i && d === shown - 1 && n <= SHOWN) r = 5 * Math.min(1, born.age / 0.3);
          svg('circle', { cx: 28 + d * step, cy: y + 39, r: r, fill: current ? 'var(--navy)' : 'var(--text)' }, root);
        }
        if (n > SHOWN) svg('text', { x: 28 + SHOWN * step, y: y + 43, text: '+' + (n - SHOWN) }, root);
      }
      var base = LEVELS * lh + (LEVELS - 1) * gap;
      var h = arrow(root, 28, base + 18, Math.min(boxW - 20, 28 + 8 * 26), base + 18);
      h.setAttribute('style', 'color: var(--text-secondary)');
      svg('text', { x: 28, y: base + 36, text: T('new instance (same vocabulary)', '新实例（词汇不变）') }, root);
      var v = arrow(root, boxW + side / 2, base - 8, boxW + side / 2, 8);
      v.setAttribute('style', 'color: var(--navy)');
      var vt = svg('text', { x: 0, y: 0, 'text-anchor': 'middle', transform: 'translate(' + (boxW + side / 2 + 16) + ',' + base / 2 + ') rotate(90)', text: T('new primitive (vocabulary grows)', '新原语（词汇增长）') }, root);
      vt.setAttribute('style', 'fill: var(--navy)');
      var inst = state.reduce(function (a, b) { return a + b; }, 0);
      readout.textContent = T('instances ' + inst + ' · primitives ' + state.length, '实例 ' + inst + ' · 原语 ' + state.length);
      bPrim.disabled = state.length >= LEVELS;
    }

    return { resize: function (w) { width = w; draw(); if (auto) anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 2: the two curves.
  //
  //   g_inst(n) = 0.56 + 0.07 sin(n / 8.5) + 0.035 sin(n / 3.1 + 1)
  //   g_prim(n) = 0.92 exp(-n / tau) + 0.015
  //
  // Instance yield wanders but stays bounded away from zero; primitive yield
  // decays with time constant tau. The shaded band is their divergence. The
  // curves draw themselves in when the figure comes into view.
  F.register('fig3-twocurves.png', function (f) {
    var T = f.T, N = 100, tau = 22, width = 0, cursor = null, one = false;
    var drawn = f.reduced ? 2 : 0;
    var gInst = function (n) { return 0.56 + 0.07 * Math.sin(n / 8.5) + 0.035 * Math.sin(n / 3.1 + 1); };
    var gPrim = function (n) { return 0.92 * Math.exp(-n / tau) + 0.015; };
    var root = svg('svg', { role: 'img', 'aria-label': T('Instance yield persists while primitive yield decays', '实例产率持续，原语产率衰减') }, f.stage);

    F.slider(f.controls, { label: T('primitive decay τ', '原语衰减 τ'), min: 6, max: 70, step: 1, value: tau, onInput: function (v) { tau = v; draw(); } });
    var bOne = F.button(f.controls, T('watch one curve', '只看一条'), function () {
      one = !one; bOne.setAttribute('aria-pressed', one); draw();
    });
    bOne.setAttribute('aria-pressed', 'false');
    F.button(f.controls, T('replay', '重放'), function () { drawn = 0; anim.start(); });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    var anim = F.loop(f.root, function (dt) {
      drawn = Math.min(2, drawn + dt / 1.1);
      draw();
      return drawn < 2;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, H = Math.round(Math.min(320, Math.max(230, W * 0.5)));
      var L = 40, R = 86, Tp = 26, B = 32;
      var px = function (n) { return L + (W - L - R) * n / N; };
      var py = function (g) { return Tp + (H - Tp - B) * (1 - g); };
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var axes = svg('g', { style: 'color: var(--text-muted)' }, root);
      arrow(axes, L, H - B, W - R + 30, H - B);
      arrow(axes, L, H - B, L, Tp - 12);
      svg('text', { x: L + 6, y: Tp - 12, text: T('marginal yield', '边际产率') }, root);
      sub(root, 'n', '', { x: W - R + 36, y: H - B + 16 });

      var upTo = function (k) { return N * Math.max(0, Math.min(1, drawn - k)); };
      function path(fn, end) {
        var d = '';
        for (var n = 0; n <= end; n += 0.5) d += (n ? 'L' : 'M') + px(n).toFixed(1) + ',' + py(fn(n)).toFixed(1);
        return d;
      }
      // The divergence: the band between the two curves, once both are drawn.
      if (!one && drawn >= 2) {
        var d = path(gInst, N);
        for (var n = N; n >= 0; n -= 0.5) d += 'L' + px(n).toFixed(1) + ',' + py(gPrim(n)).toFixed(1);
        svg('path', { d: d + 'Z', fill: 'var(--navy)', 'fill-opacity': 0.08, stroke: 'none' }, root);
      }
      var endI = upTo(0), endP = upTo(1);
      svg('path', { d: path(gInst, endI), fill: 'none', stroke: 'var(--text-secondary)', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, root);
      if (endI >= N) sub(root, 'g', 'inst', { x: px(N) + 8, y: py(gInst(N)) - 6 });
      if (!one && endP > 0) {
        svg('path', { d: path(gPrim, endP), fill: 'none', stroke: 'var(--navy)', 'stroke-width': 2.2 }, root);
        if (endP >= N) { var lp = sub(root, 'g', 'prim', { x: px(N) + 8, y: py(gPrim(N)) - 10 }); lp.setAttribute('style', 'fill: var(--navy)'); }
      }
      if (one) svg('text', { x: px(N * 0.45), y: py(0.2), text: T('every activity metric looks healthy', '所有活跃指标都很健康') }, root);
      else if (drawn >= 2) svg('text', { x: px(N * 0.55), y: Tp - 12, text: T('instances persist, primitives stop', '实例不断，原语停止') }, root);

      var at = cursor === null ? N : cursor;
      if (cursor !== null) {
        svg('line', { x1: px(at), y1: Tp, x2: px(at), y2: H - B, stroke: 'var(--border-strong)' }, root);
        svg('circle', { cx: px(at), cy: py(gInst(at)), r: 3.5, fill: 'var(--text-secondary)' }, root);
        if (!one) svg('circle', { cx: px(at), cy: py(gPrim(at)), r: 3.5, fill: 'var(--navy)' }, root);
      }
      var gi = gInst(at), gp = gPrim(at);
      readout.textContent = 'n = ' + Math.round(at) + ' · g_inst ' + gi.toFixed(2) + (one ? '' : ' · g_prim ' + gp.toFixed(2) + ' · ' + T('gap ', '差 ') + (gi - gp).toFixed(2));
      root.onpointermove = function (e) {
        var box = root.getBoundingClientRect();
        var n = ((e.clientX - box.left) * W / box.width - L) / (W - L - R) * N;
        cursor = Math.max(0, Math.min(N, n));
        draw();
      };
      root.onpointerleave = function () { cursor = null; draw(); };
    }

    return { resize: function (w) { width = w; draw(); if (drawn < 2) anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 3: lock-in as a landscape.
  //
  // The framework state u moves in a potential with two wells: V, the
  // current framework, at u = 0.26, and V', which yields more, at u = 0.78,
  // lower by the gain Δg. The barrier between them stands [c - Δg]+ above V,
  // for a switching cost c. The collective drifts downhill and is jostled by
  // perturbations of size σ (overdamped Langevin dynamics):
  //
  //   du = -k U'(u) dt + σ s √dt ξ,   k = 0.1, s = 0.35, ξ ~ N(0, 1)
  //
  // With these constants and the defaults (c = 1.05, Δg = 0.45, σ = 0.35) it
  // stays in V for minutes; at σ = 0.9 it escapes within seconds; once
  // c ≤ Δg the barrier is gone and it slides to V'. σ never drops below
  // 0.05: no real collective is perfectly still.
  F.register('fig4-landscape.png', function (f) {
    var T = f.T, xL = 0.26, xB = 0.52, xR = 0.78, K = 0.1, S = 0.35;
    var c = 1.05, dg = 0.45, sigma = 0.35, u = xL, width = 0;
    var barrier = function () { return Math.max(c - dg, 0); };
    function U(x) {
      var R = barrier(), Hw = Math.max(R, 0.3) + 0.7, t;
      if (x < xL) return Hw * Math.pow((xL - x) / xL, 2);
      if (x < xB) { t = (x - xL) / (xB - xL); return R * (1 - Math.cos(Math.PI * t)) / 2; }
      if (x < xR) { t = (x - xB) / (xR - xB); return R - (R + dg) * (1 - Math.cos(Math.PI * t)) / 2; }
      return -dg + Hw * Math.pow((x - xR) / (1 - xR), 2);
    }
    var dU = function (x) { return (U(x + 1e-4) - U(x - 1e-4)) / 2e-4; };
    var gauss = function () { var a = 0; for (var i = 0; i < 6; i++) a += Math.random(); return (a - 3) * Math.SQRT2; };
    var root = svg('svg', { role: 'img', 'aria-label': T('A collective held in its current framework by the cost of switching', '集体被切换成本困在当前框架里') }, f.stage);

    F.slider(f.controls, { label: T('switching cost c', '切换成本 c'), min: 0, max: 1.6, step: 0.05, value: c, format: function (v) { return v.toFixed(2); }, onInput: function (v) { c = v; kick(); } });
    F.slider(f.controls, { label: T('gain Δg', '增益 Δg'), min: 0, max: 1, step: 0.05, value: dg, format: function (v) { return v.toFixed(2); }, onInput: function (v) { dg = v; kick(); } });
    F.slider(f.controls, { label: T('perturbation σ', '扰动 σ'), min: 0, max: 1, step: 0.05, value: sigma, format: function (v) { return v.toFixed(2); }, onInput: function (v) { sigma = v; kick(); } });
    F.button(f.controls, T('back to V', '回到 V'), function () { u = xL; kick(); });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    var anim = F.loop(f.root, function (dt) {
      var n = Math.max(1, Math.round(dt * 60));
      for (var i = 0; i < n; i++) {
        u += -K * dU(u) / 60 + Math.max(sigma, 0.05) * S * Math.sqrt(1 / 60) * gauss();
        u = Math.min(Math.max(u, 0.02), 0.98);
      }
      draw();
      return true;
    });
    function kick() { if (f.reduced) u = barrier() > 0 ? xL : xR; draw(); anim.start(); }

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, H = Math.round(Math.min(330, Math.max(240, W * 0.5)));
      var L = 40, Rm = 70, Tp = 34, B = 34, R = barrier();
      var top = Math.max(R, 0.3) + 0.45, low = -dg - 0.12;
      var px = function (x) { return L + (W - L - Rm) * x; };
      var py = function (v) { return Tp + (H - Tp - B) * (top - v) / (top - low); };
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var axes = svg('g', { style: 'color: var(--text-muted)' }, root);
      arrow(axes, L - 10, H - B, W - 18, H - B);
      arrow(axes, L - 10, H - B, L - 10, Tp - 16);
      svg('text', { 'text-anchor': 'middle', transform: 'translate(10,' + (Tp + (H - Tp - B) / 2) + ') rotate(-90)', text: T('stochastic potential', '随机势') }, root);
      svg('text', { x: (W - Rm + L) / 2, y: H - B + 22, 'text-anchor': 'middle', text: T('framework state', '框架状态') }, root);

      var d = '';
      for (var i = 0; i <= 200; i++) {
        var x = 0.08 + 0.87 * i / 200, v = Math.min(U(x), top);
        d += (i ? 'L' : 'M') + px(x).toFixed(1) + ',' + py(v).toFixed(1);
      }
      svg('path', { d: d, fill: 'none', stroke: 'var(--text)', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, root);

      // The two measures the argument turns on: the barrier above V and the
      // gain of V' below it.
      var dash = { stroke: 'var(--text-muted)', 'stroke-dasharray': '4 4' };
      svg('line', Object.assign({ x1: px(xL), y1: py(0), x2: W - Rm + 34, y2: py(0) }, dash), root);
      svg('line', Object.assign({ x1: px(xR), y1: py(-dg), x2: W - Rm + 34, y2: py(-dg) }, dash), root);
      if (R > 0.02) {
        var ra = svg('g', { style: 'color: var(--navy)' }, root);
        arrow(ra, px(xB), py(0), px(xB), py(R) + 2); arrow(ra, px(xB), py(R), px(xB), py(0) - 2);
        var rl = svg('text', { x: px(xB), y: py(R) - 10, 'text-anchor': 'middle', text: '[c − Δg]₊' }, root);
        rl.setAttribute('style', 'fill: var(--navy)');
      }
      if (dg > 0.02) {
        var ga = svg('g', { style: 'color: var(--text-secondary)' }, root);
        arrow(ga, W - Rm + 24, py(0), W - Rm + 24, py(-dg) - 2); arrow(ga, W - Rm + 24, py(-dg), W - Rm + 24, py(0) + 2);
        svg('text', { x: W - Rm + 30, y: (py(0) + py(-dg)) / 2 + 4, text: 'Δg' }, root);
      }
      svg('text', { x: px(xL), y: Tp - 2, 'text-anchor': 'middle', text: T('V (current)', 'V（当前）') }, root);
      svg('text', { x: px(xR), y: Tp - 2, 'text-anchor': 'middle', text: T('V′ (higher yield)', 'V′（产率更高）') }, root);

      var ball = Math.min(Math.max(u, 0.08), 0.95);
      svg('circle', { cx: px(ball), cy: py(U(ball)) - 9, r: 8, fill: 'var(--navy)' }, root);
      var switched = u > xB;
      readout.textContent = (switched ? T('switched to V′', '已迁到 V′') : T('locked in V', '锁定在 V')) +
        ' · ' + T('resistance ', '阻力 ') + R.toFixed(2);
    }

    if (f.reduced) u = barrier() > 0 ? xL : xR;
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 4: two axes, four corners. Point at a corner to read it.
  F.register('fig1-quadrants.png', function (f) {
    var T = f.T, width = 0, active = null;
    var CELLS = [
      { gx: 0, gy: 1, title: T('Closed yet long-lived', '封闭却长寿'), eg: T('out-of-print rules; an old fighting-game scene', '绝版规则；老格斗游戏圈'),
        text: T('Low generativity, high lock-in: a long-lived culture on closed rules, like an out-of-print game whose competitive scene lasts decades.', '低生成性、高锁定：在封闭规则上长期延续的文化，比如一款绝版游戏，竞技圈却延续了几十年。') },
      { gx: 1, gy: 1, title: T('Open yet closed off', '开放却自我设限'), eg: T('speedrunning glitchless', '无 glitch 速通'),
        text: T('High generativity, high lock-in: an open community deliberately bounding itself, like speedrunning a still-rich game under glitchless rules.', '高生成性、高锁定：一个开放的社区主动给自己设界，比如在内容仍然丰富的游戏里按"无 glitch"规则速通。') },
      { gx: 0, gy: 0, title: T('Seen through and dead', '被看穿即消亡'), eg: T('flash-in-the-pan fad', '昙花一现的爆款'),
        text: T('Low generativity, low lock-in: the flash-in-the-pan fad. Once people see through it, they leave.', '低生成性、低锁定：昙花一现的爆款，一旦被看穿，人就走了。') },
      { gx: 1, gy: 0, title: T('Sustained deepening', '持续深入'), eg: T('Game of Life', 'Game of Life'),
        text: T('High generativity, low lock-in: sustained deepening, like the Game of Life fifty years on, carrying its primitives to new questions.', '高生成性、低锁定：持续深入，比如五十年后的 Game of Life，把自己的原语不断带到新的问题上。') }
    ];
    var root = svg('svg', { role: 'group', 'aria-label': T('Generativity against lock-in', '生成性与锁定') }, f.stage);
    var note = el('p', { class: 'ifig-note' }, f.stage);
    note.setAttribute('style', 'min-height: 3.2em; margin: 10px 0 0; font-size: 14px; color: var(--text-secondary)');

    var nodes = [];
    function setActive(i) {
      active = i;
      nodes.forEach(function (n, k) {
        var on = k === i;
        n.rect.setAttribute('fill', on ? 'var(--navy)' : 'transparent');
        n.rect.setAttribute('fill-opacity', on ? 0.08 : 1);
        n.titles.forEach(function (t) { t.style.fill = on ? 'var(--navy)' : 'var(--text)'; });
      });
      note.textContent = CELLS[i].text;
    }
    function draw() {
      if (!width) return;
      root.textContent = '';
      nodes = [];
      var W = width, narrow = W < 520, left = narrow ? 50 : 64;
      var axisLines = wrap(T('Generativity: does discovery keep producing new primitives?', '生成性：探索是否还在产出新原语？'), '12.5px ' + SANS, W - left - 12);
      var bottom = 34 + axisLines.length * 16;
      var cw = (W - left) / 2, ch = Math.round(Math.max(118, Math.min(160, cw * 0.62)));
      var H = ch * 2 + bottom;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      CELLS.forEach(function (cell, i) {
        var x = left + cell.gx * cw, y = (1 - cell.gy) * ch, on = active === i;
        var g = svg('g', { tabindex: 0, role: 'button', 'aria-label': cell.title + '. ' + cell.text, style: 'cursor: pointer; outline: none' }, root);
        svg('rect', { x: x, y: y, width: cw, height: ch, fill: on ? 'var(--navy)' : 'transparent', 'fill-opacity': on ? 0.08 : 1, stroke: 'none' }, g);
        var lines = wrap(cell.title, '600 13.5px ' + SANS, cw - 20);
        var ty = y + ch / 2 - (lines.length - 1) * 8 - 8;
        var titles = lines.map(function (ln, k) {
          var t = svg('text', { x: x + cw / 2, y: ty + k * 17, 'text-anchor': 'middle', text: ln }, g);
          t.setAttribute('style', 'fill: ' + (on ? 'var(--navy)' : 'var(--text)') + '; font-weight: 600; font-size: 13.5px');
          return t;
        });
        nodes.push({ rect: g.firstChild, titles: titles });
        wrap(cell.eg, 'italic 12.5px ' + SANS, cw - 20).forEach(function (ln, k) {
          var t = svg('text', { x: x + cw / 2, y: ty + lines.length * 17 + 4 + k * 16, 'text-anchor': 'middle', text: ln }, g);
          t.setAttribute('style', 'font-style: italic');
        });
        function pick() { if (active !== i) setActive(i); }
        g.addEventListener('pointerenter', pick);
        g.addEventListener('click', pick);
        g.addEventListener('focus', pick);
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
      var cross = { stroke: 'var(--border-strong)', 'stroke-dasharray': '5 4' };
      svg('line', Object.assign({ x1: left + cw, y1: 0, x2: left + cw, y2: ch * 2 }, cross), root);
      svg('line', Object.assign({ x1: left, y1: ch, x2: W, y2: ch }, cross), root);
      svg('rect', { x: left + 0.5, y: 0.5, width: W - left - 1, height: ch * 2 - 1, fill: 'none', stroke: 'var(--text)', 'stroke-width': 1.4 }, root);
      svg('text', { x: left + cw / 2, y: ch * 2 + 18, 'text-anchor': 'middle', text: T('low', '低') }, root);
      svg('text', { x: left + cw * 1.5, y: ch * 2 + 18, 'text-anchor': 'middle', text: T('high', '高') }, root);
      axisLines.forEach(function (ln, k) { svg('text', { x: left + cw, y: ch * 2 + 40 + k * 16, 'text-anchor': 'middle', text: ln }, root); });
      var yl = svg('text', { 'text-anchor': 'middle', transform: 'translate(14,' + ch + ') rotate(-90)', text: T('Epistemic lock-in', '认知锁定') }, root);
      yl.setAttribute('style', 'fill: var(--text)');
      svg('text', { 'text-anchor': 'middle', transform: 'translate(' + (left - 12) + ',' + ch / 2 + ') rotate(-90)', text: narrow ? T('stays', '留下') : T('stays (locked in)', '留下（被锁定）') }, root);
      svg('text', { 'text-anchor': 'middle', transform: 'translate(' + (left - 12) + ',' + ch * 1.5 + ') rotate(-90)', text: narrow ? T('migrates', '迁移') : T('migrates (not locked)', '迁移（未锁定）') }, root);
    }
    note.textContent = T('Point at a corner, or tab to it, to read it.', '指向或用 Tab 选中一个角，查看说明。');
    return { resize: function (w) { width = w; draw(); } };
  });
})();
