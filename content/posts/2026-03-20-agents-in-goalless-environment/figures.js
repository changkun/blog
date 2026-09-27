// The live figures of "Agents (or Humans) in Goal-Directed and Goalless
// Environments", drawn with the blog's figure kit
// (themes/ink/assets/js/ifig.js). Each replaces the image of the same name,
// in the language of the block it sits in; Figure 1, a screenshot of
// Wallfacer, stays an image. Sizes, heights and lists in these figures are
// sketches of what the essay describes, not measurements of the runs.
(function () {
  'use strict';
  var F = window.ifig;
  if (!F) return;
  var svg = F.svg, el = F.el, wrap = F.wrap, arrow = F.arrow;
  var SANS = F.sans();

  function styled(node, css) { node.setAttribute('style', css); return node; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function note(stage) {
    var p = el('p', { class: 'ifig-note' }, stage);
    p.setAttribute('style', 'min-height: 3.2em; margin: 10px 0 0; font-size: 14px; color: var(--text-secondary)');
    return p;
  }
  function box(parent, x, y, w, h, label, o) {
    o = o || {};
    var g = svg('g', {}, parent);
    var rect = svg('rect', { x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: 8, fill: o.fill || 'var(--bg)', stroke: o.stroke || 'var(--border-strong)', 'stroke-width': o.sw || 1, 'stroke-dasharray': o.dash || 'none' }, g);
    var size = o.size || 13, lines = wrap(label, (o.weight || 500) + ' ' + size + 'px ' + SANS, w - 16);
    var y0 = y + h / 2 - (lines.length - 1) * (size + 3) / 2 + size * 0.36;
    lines.forEach(function (ln, k) {
      styled(svg('text', { x: x + w / 2, y: y0 + k * (size + 3), 'text-anchor': 'middle', text: ln }, g),
        'fill: ' + (o.color || 'var(--text)') + '; font-size: ' + size + 'px; font-weight: ' + (o.weight || 500));
    });
    return { g: g, rect: rect };
  }
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ------------------------------------------------------------------
  // Figure 2: the pipeline. A cycle goes Strategist → Executor → Tester →
  // Documenter and ends in a commit. Commit sizes follow
  // 100 exp(−k / 7) plus noise: a sketch of changes that shrink, inside an
  // architecture that never changes. Playing, it runs a week of 28 cycles
  // and starts over.
  F.register('fig2.png', function (f) {
    var T = f.T, width = 0, cycle = 0, pos = 0, sizes = [], seed = 3, R = rng(seed), hold = 0;
    var ROLES = [T('Strategist', 'Strategist'), T('Executor', 'Executor'), T('Tester', 'Tester'), T('Documenter', 'Documenter')];
    var WEEK = 28;
    function what(k) {
      return k < 4 ? T('a substantive feature', '一个实质性的功能') :
        k < 10 ? T('an improvement to an existing feature', '改进一个已有功能') :
        k < 16 ? T('adjusting a log format', '调整日志格式') :
        k < 22 ? T('renaming a variable', '改一个变量名') :
        T('fixing a boundary condition that is never triggered', '修一个永远不会被触发的边界条件');
    }
    function commit() {
      var k = sizes.length;
      sizes.push(Math.max(3, 100 * Math.exp(-k / 7) * (0.75 + 0.5 * R())));
      text.textContent = T('Cycle ', '第 ') + sizes.length + T(': ', ' 轮：') + what(k) + T('.', '。');
    }
    if (f.reduced) for (var i = 0; i < WEEK; i++) sizes.push(Math.max(3, 100 * Math.exp(-i / 7) * (0.75 + 0.5 * R())));
    var root = svg('svg', { role: 'img', 'aria-label': T('A four-role pipeline whose changes shrink over a week', '一条四角色流水线，一周之内改动越来越小') }, f.stage);
    var text = note(f.stage);
    text.textContent = f.reduced ? T('A week of cycles: the changes shrink, and the architecture never changes.', '一周的循环：改动越来越小，架构始终不变。') : T('The Strategist proposes, the Executor implements, the Tester checks, the Documenter records.', 'Strategist 提出，Executor 实现，Tester 验证，Documenter 记录。');
    var play = F.player(f.controls, T, function (on) { if (on) anim.start(true); });
    F.button(f.controls, T('next cycle', '下一轮'), function () { play.set(false); if (sizes.length < WEEK) commit(); pos = 0; draw(); });
    F.button(f.controls, T('reset', '重置'), function () { play.set(false); reset(); draw(); });
    function reset() { sizes = []; pos = 0; hold = 0; seed++; R = rng(seed); text.textContent = T('The Strategist proposes, the Executor implements, the Tester checks, the Documenter records.', 'Strategist 提出，Executor 实现，Tester 验证，Documenter 记录。'); }

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing()) return false;
      if (hold > 0) { hold -= dt; if (hold <= 0) reset(); draw(); return true; }
      pos += dt / 0.28;
      if (pos >= 4) { pos = 0; commit(); if (sizes.length >= WEEK) { hold = 3; text.textContent = T('A week later: the Agents are still busy and the commits still flow, but the changes are micro-optimizations, and nothing ever left the initial architecture.', '一周之后：Agent 们依然忙碌，commit 依然源源不断，但改动都成了微优化，而且没有任何东西跳出过最初的架构。'); } }
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 560, gap = wide ? 26 : 18;
      var bw = wide ? (W - 3 * gap) / 4 : (W - gap) / 2, bh = 40;
      var cells = wide ? [[0, 0], [bw + gap, 0], [2 * (bw + gap), 0], [3 * (bw + gap), 0]] :
        [[0, 0], [bw + gap, 0], [bw + gap, bh + 30], [0, bh + 30]];
      var top = wide ? bh : 2 * bh + 30;
      var k = Math.floor(pos) % 4;
      cells.forEach(function (c, i) {
        var on = i === k && play.playing();
        var b = box(root, c[0], c[1], bw, bh, ROLES[i], { weight: 600, stroke: on ? 'var(--navy)' : 'var(--border-strong)', sw: on ? 1.6 : 1, fill: on ? 'var(--navy)' : 'var(--bg)' });
        b.rect.setAttribute('fill-opacity', on ? 0.08 : 1);
      });
      var a = svg('g', { style: 'color: var(--text-muted)' }, root);
      for (var i = 0; i < 3; i++) {
        var c0 = cells[i], c1 = cells[i + 1];
        if (c0[1] === c1[1]) arrow(a, Math.min(c0[0], c1[0]) + bw + 4 + (c1[0] < c0[0] ? 0 : 0), c0[1] + bh / 2, Math.max(c0[0], c1[0]) - 4, c1[1] + bh / 2);
        else arrow(a, c0[0] + bw / 2, c0[1] + bh + 4, c1[0] + bw / 2, c1[1] - 4);
      }
      if (!wide) { a.textContent = ''; arrow(a, bw + 4, bh / 2, bw + gap - 4, bh / 2); arrow(a, bw + gap + bw / 2, bh + 4, bw + gap + bw / 2, bh + 26); arrow(a, bw + gap - 4, bh + 30 + bh / 2, bw + 4, bh + 30 + bh / 2); }
      // The token.
      if (play.playing()) {
        var fr = pos - Math.floor(pos), ci = cells[k], cn = cells[Math.min(k + 1, 3)], m = fr > 0.55 && k < 3 ? ease((fr - 0.55) / 0.45) : 0;
        svg('circle', { cx: lerp(ci[0] + bw / 2, cn[0] + bw / 2, m), cy: lerp(ci[1] + bh / 2, cn[1] + bh / 2, m) + bh / 2 - 7, r: 4.5, fill: 'var(--navy)' }, root);
      }
      // The commits, inside the architecture they never leave.
      var ay = top + 40, aw = wide ? W * 0.72 : W, ah = 130;
      box(root, 0, ay, aw, ah, '', { dash: '5 4', fill: 'none' });
      svg('text', { x: 12, y: ay + 18, text: T('the initial architecture: runs locally', '最初的架构：本地运行') }, root);
      svg('text', { x: 12, y: ay + ah - 8, text: T('size of each change (a sketch)', '每次改动的大小（示意）') }, root);
      var n = WEEK, colW = (aw - 24) / n;
      sizes.forEach(function (s, j) {
        var h = (ah - 52) * s / 110;
        svg('rect', { x: 12 + j * colW + 1, y: ay + ah - 22 - h, width: Math.max(1, colW - 2), height: h, rx: 1.5, fill: j === sizes.length - 1 ? 'var(--navy)' : 'var(--text-muted)', 'fill-opacity': j === sizes.length - 1 ? 1 : 0.55 }, root);
      });
      if (sizes.length && play.playing()) {
        var arrowY = top + 4;
        styled(arrow(root, cells[3][0] + bw / 2, cells[3][1] + bh + 4, Math.min(aw - 12, 12 + (sizes.length - 1) * colW + colW / 2), ay - 2), 'color: var(--border-strong)');
        void arrowY;
      }
      // What was never proposed.
      if (wide) {
        var ox = aw + 18, ow = W - ox;
        box(root, ox, ay + 20, ow, ah - 40, T('never proposed: cloud deployment, a new overall topology', '从未提出：云端部署、新的整体拓扑'), { dash: '3 3', fill: 'none', color: 'var(--text-muted)', size: 12.5 });
      } else {
        styled(svg('text', { x: 0, y: ay + ah + 18, text: T('never proposed: cloud deployment, a new topology', '从未提出：云端部署、新的拓扑') }, root), 'fill: var(--text-muted)');
      }
      var H = ay + ah + (wide ? 4 : 26);
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 3: stripping structure, one role at a time. Playing, it steps
  // through the four configurations; clicking one reads it.
  F.register('fig3.png', function (f) {
    var T = f.T, width = 0, cur = f.reduced ? 3 : 0, clock = 0;
    var ROLES = [T('Strategist', 'Strategist'), T('Executor', 'Executor'), T('Tester', 'Tester'), T('Documenter', 'Documenter')];
    var CONFIGS = [
      { title: T('Full pipeline', '完整流水线'), keep: [1, 1, 1, 1], note: T('Four roles. The cycle never breaks, and over a week the changes shrink to micro-optimizations.', '四个角色。循环从不中断，一周之内，改动缩成了微优化。') },
      { title: T('Three roles', '三个角色'), keep: [1, 1, 1, 0], note: T('Without the Documenter, knowledge is no longer recorded between rounds; each round leaves only the code and the Tester’s results.', '去掉 Documenter，知识不再在轮次之间被记录，每一轮只留下代码和 Tester 的验证结果。') },
      { title: T('Two roles', '两个角色'), keep: [1, 1, 0, 0], note: T('Without the Tester, nothing checks the Executor. After 500-some iterations the code reaches sixty or seventy thousand lines, and a large refactor breaks the application.', '去掉 Tester，没有人检查 Executor。500 多次迭代之后，代码膨胀到六七万行，一次大规模重构让应用彻底跑不起来。') },
      { title: T('One agent, no goals', '一个 Agent，没有目标'), keep: null, note: T('One agent and no goals: the most freedom, and collapse after 42 rounds.', '一个 Agent，没有目标：自由度最大，42 轮之后走向崩溃。') }
    ];
    var root = svg('svg', { role: 'group', 'aria-label': T('Four configurations, from full structure to none', '四种配置，从结构完整到毫无结构') }, f.stage);
    var text = note(f.stage), cards = [];
    var play = F.player(f.controls, T, function (on) { if (on) { clock = 0; anim.start(true); } });
    var anim = F.loop(f.root, function (dt) {
      if (!play.playing()) return false;
      clock += dt;
      if (clock > 3.6) { clock = 0; cur = (cur + 1) % 4; update(); }
      return true;
    });
    function update() {
      cards.forEach(function (c, i) {
        c.frame.setAttribute('stroke', i === cur ? 'var(--navy)' : 'var(--border-strong)');
        c.frame.setAttribute('stroke-width', i === cur ? 1.8 : 1);
        c.title.style.fill = i === cur ? 'var(--navy)' : 'var(--text-secondary)';
      });
      if (marker) marker.setAttribute('cx', markerX(cur));
      text.textContent = CONFIGS[cur].note;
    }
    var marker = null, markerX = function () { return 0; };
    function draw() {
      if (!width) return;
      root.textContent = '';
      cards = [];
      var W = width, wide = W >= 620, gap = 14, cols = wide ? 4 : 2;
      var cw = (W - (cols - 1) * gap) / cols, chh = 150;
      CONFIGS.forEach(function (cfg, i) {
        var col = i % cols, row = Math.floor(i / cols), x = col * (cw + gap), y = row * (chh + 30 + gap);
        var g = svg('g', { tabindex: 0, role: 'button', 'aria-label': cfg.title + '. ' + cfg.note, style: 'cursor: pointer; outline: none' }, root);
        var title = styled(svg('text', { x: x + cw / 2, y: y + 14, 'text-anchor': 'middle', text: cfg.title }, g), 'font-weight: 600; font-size: 13px');
        var frame = svg('rect', { x: x + 0.5, y: y + 24.5, width: cw - 1, height: chh - 1, rx: 10, fill: 'var(--bg)', stroke: 'var(--border-strong)' }, g);
        var tw = (cw - 30) / 2, th = (chh - 30) / 2;
        if (cfg.keep) {
          ROLES.forEach(function (r, k) {
            var tx = x + 10 + (k % 2) * (tw + 10), ty = y + 34 + Math.floor(k / 2) * (th + 10), on = cfg.keep[k];
            box(g, tx, ty, tw, th, r, on ? { fill: 'var(--bg-raised)', stroke: 'var(--border-strong)', size: 12, weight: 600 } :
              { fill: 'none', dash: '4 3', color: 'var(--text-muted)', size: 12, weight: 500 });
          });
        } else {
          svg('circle', { cx: x + cw / 2, cy: y + 24 + chh / 2, r: Math.min(30, cw / 5), fill: 'var(--text)' }, g);
          styled(svg('text', { x: x + cw / 2, y: y + 24 + chh / 2 + 4, 'text-anchor': 'middle', text: 'Agent' }, g), 'fill: var(--bg); font-weight: 600; font-size: 12.5px');
        }
        function pick() { play.set(false); cur = i; update(); }
        g.addEventListener('click', pick);
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
        cards.push({ frame: frame, title: title });
      });
      var rows = Math.ceil(4 / cols), by = rows * (chh + 30 + gap) + 8;
      var grad = 'g' + Math.round(W);
      var defs = svg('defs', {}, root), lg = svg('linearGradient', { id: grad, x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
      svg('stop', { offset: 0, 'stop-color': 'var(--text)', 'stop-opacity': 0.55 }, lg);
      svg('stop', { offset: 1, 'stop-color': 'var(--navy)', 'stop-opacity': 0.55 }, lg);
      svg('rect', { x: 0, y: by, width: W, height: 8, rx: 4, fill: 'url(#' + grad + ')' }, root);
      markerX = function (i) { return wide ? (i * (cw + gap) + cw / 2) : 12 + (W - 24) * i / 3; };
      marker = svg('circle', { cx: markerX(cur), cy: by + 4, r: 7, fill: 'var(--bg)', stroke: 'var(--navy)', 'stroke-width': 2.5 }, root);
      marker.style.transition = 'cx 0.5s';
      styled(svg('text', { x: 0, y: by + 28, text: T('full structure: stable, constrained', '结构完整：稳定，受约束') }, root), 'font-size: 12.5px');
      styled(svg('text', { x: W, y: by + 28, 'text-anchor': 'end', text: T('no structure: fragile, free', '毫无结构：脆弱，自由') }, root), 'font-size: 12.5px');
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + (by + 34));
      update();
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 4: three ways of searching one landscape, for higher f.
  //
  // The landscape is a sum of seven bumps with random heights. Each cycle:
  //   pipeline  (exploit only): step ±0.012 toward higher f, if either is.
  //   goalless  (explore only): jump by a normal step of spread 0.3, and
  //             keep nothing: every cycle starts somewhere new.
  //   rhythm    (explore one cycle in every 1/share): jump like goalless,
  //             then climb like the pipeline; before each new jump, return
  //             to the best place reached if the new one is lower.
  // The readout is the height each walker keeps. A sketch of the essay's
  // argument, not a model of the agents.
  F.register('fig4.png', function (f) {
    var T = f.T, width = 0, seed = 7, share = 0.2, t = 0, cycle = 0, CYCLES = 100, hold = 0;
    var land, walkers;
    function makeLand() {
      var R = rng(seed), bumps = [];
      for (var i = 0; i < 7; i++) bumps.push({ c: 0.06 + i * 0.145 + (R() - 0.5) * 0.05, h: 0.25 + 0.55 * R(), w: 0.035 + 0.03 * R() });
      bumps[1 + Math.floor(R() * 2)].h = 0.3;  // a modest peak near the start
      bumps[4 + Math.floor(R() * 3)].h = 1;    // the tallest one is far away
      return function (x) { var v = 0.08; bumps.forEach(function (b) { v += b.h * Math.exp(-Math.pow((x - b.c) / b.w, 2)); }); return v; };
    }
    function start() {
      land = makeLand();
      var R = rng(seed * 31 + 1), x0 = 0.2;
      walkers = [
        { key: 'pipe', x: x0, trail: [], R: R },
        { key: 'free', x: x0, trail: [], R: rng(seed * 17 + 5) },
        { key: 'rhythm', x: x0, best: x0, trail: [], R: rng(seed * 13 + 9) }
      ];
      cycle = 0; t = 0;
    }
    function gauss(R) { return Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R()); }
    function clamp01(x) { return Math.max(0.01, Math.min(0.99, x)); }
    function climb(w) {
      var d = 0.012, a = land(w.x - d), b = land(w.x + d), c = land(w.x);
      if (a > c && a >= b) w.x -= d; else if (b > c) w.x += d;
    }
    function stepAll() {
      cycle++;
      var pipe = walkers[0], free = walkers[1], rh = walkers[2];
      climb(pipe); pipe.trail.push(pipe.x);
      free.x = clamp01(free.x + 0.3 * gauss(free.R)); free.trail.push(free.x);
      var period = share <= 0 ? Infinity : Math.max(1, Math.round(1 / share));
      if (period !== Infinity && cycle % period === 0) {
        if (land(rh.x) < land(rh.best)) rh.x = rh.best;
        rh.x = clamp01(rh.x + 0.3 * gauss(rh.R));
        rh.jumped = true;
      } else { climb(rh); rh.jumped = false; }
      if (land(rh.x) > land(rh.best)) rh.best = rh.x;
      rh.trail.push(rh.x);
    }
    start();
    if (f.reduced) for (var i = 0; i < CYCLES; i++) stepAll();
    var running = false;  // set by the reader's controls, so the figure keeps running when paused by them
    var root = svg('svg', { role: 'img', 'aria-label': T('Three searches on one landscape', '在同一片地形上的三种搜索') }, f.stage);
    var text = note(f.stage);
    text.textContent = T('The pipeline climbs to the nearest peak; goalless search keeps jumping; the rhythm jumps one cycle in five, climbs in between, and flags the best peak it has reached.', '流水线爬上最近的山头；无目标的搜索一直在跳；节奏式的搜索每五轮跳一次，其余时间都在爬，并用旗子标出到过的最高点。');
    var play = F.player(f.controls, T, function (on) { if (on) anim.start(true); });
    var sShare = F.slider(f.controls, { label: T('exploration share', '探索占比'), min: 0, max: 1, step: 0.1, value: share,
      format: function (v) { return Math.round(v * 100) + '%'; },
      onInput: function (v) { play.set(false); share = v; seed++; start(); running = true; anim.start(true); } });
    F.button(f.controls, T('new landscape', '换一片地形'), function () { play.set(false); seed++; start(); running = true; anim.start(true); });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing() && !running) return false;
      if (hold > 0) { hold -= dt; if (hold <= 0) { seed++; start(); } draw(); return true; }
      t += dt;
      while (t > 0.16 && cycle < CYCLES) { t -= 0.16; stepAll(); }
      if (cycle >= CYCLES) { if (play.playing()) hold = 2.5; else running = false; }
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, L = 10, R = 10, Tp = 34, B = 30, H = Math.max(220, Math.min(300, W * 0.4));
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var px = function (x) { return L + (W - L - R) * x; }, py = function (v) { return Tp + (H - Tp - B) * (1 - v / 1.15); };
      var d = '';
      for (var i = 0; i <= 300; i++) { var x = i / 300; d += (i ? 'L' : 'M') + px(x).toFixed(1) + ',' + py(land(x)).toFixed(1); }
      svg('path', { d: d + 'L' + px(1) + ',' + py(0) + 'L' + px(0) + ',' + py(0) + 'Z', fill: 'var(--bg-raised)' }, root);
      svg('path', { d: d, fill: 'none', stroke: 'var(--text-secondary)', 'stroke-width': 1.8 }, root);
      svg('line', { x1: px(0), y1: py(0), x2: px(1), y2: py(0), stroke: 'var(--border-strong)' }, root);
      svg('text', { x: px(0), y: H - 8, text: T('the space of things to build', '可以去做的事情的空间') }, root);
      // Trails.
      walkers[1].trail.forEach(function (x) { svg('circle', { cx: px(x), cy: py(land(x)), r: 2.2, fill: 'var(--text-muted)', 'fill-opacity': 0.4 }, root); });
      function mark(w, style) {
        var x = px(w.x), y = py(land(w.x));
        if (style === 'pipe') svg('rect', { x: x - 5, y: y - 12, width: 10, height: 10, fill: 'var(--text)' }, root);
        else if (style === 'free') svg('circle', { cx: x, cy: y - 7, r: 5.5, fill: 'var(--bg)', stroke: 'var(--text-secondary)', 'stroke-width': 2 }, root);
        else svg('circle', { cx: x, cy: y - 7, r: 6, fill: 'var(--navy)' }, root);
      }
      // The best place the rhythm has reached, which it returns to.
      var bx = px(walkers[2].best), by = py(land(walkers[2].best));
      svg('path', { d: 'M' + bx + ',' + (by - 2) + ' L' + bx + ',' + (by - 22) + ' L' + (bx + 11) + ',' + (by - 17) + ' L' + bx + ',' + (by - 12), fill: 'var(--navy)', stroke: 'var(--navy)', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, root);
      mark(walkers[1], 'free'); mark(walkers[0], 'pipe'); mark(walkers[2], 'rhythm');
      // Legend.
      var lx = 0, ly = 12, items = [
        ['pipe', T('pipeline: exploit only', '流水线：只利用')],
        ['free', T('goalless: explore only', '无目标：只探索')],
        ['rhythm', T('rhythm: explore ' + Math.round(share * 100) + '% of cycles', '节奏：' + Math.round(share * 100) + '% 的轮次探索')]
      ];
      items.forEach(function (it) {
        if (it[0] === 'pipe') svg('rect', { x: lx, y: ly - 8, width: 9, height: 9, fill: 'var(--text)' }, root);
        else if (it[0] === 'free') svg('circle', { cx: lx + 5, cy: ly - 4, r: 4.5, fill: 'var(--bg)', stroke: 'var(--text-secondary)', 'stroke-width': 2 }, root);
        else svg('circle', { cx: lx + 5, cy: ly - 4, r: 5, fill: 'var(--navy)' }, root);
        var tt = svg('text', { x: lx + 15, y: ly, text: it[1] }, root);
        lx += 15 + tt.getComputedTextLength() + 18;
        if (lx > W - 150) { lx = 0; ly += 16; }
      });
      styled(svg('text', { x: W, y: H - 8, 'text-anchor': 'end', text: T('a sketch, not data', '示意，并非数据') }, root), 'font-style: italic; fill: var(--text-muted)');
      readout.textContent = T('height kept: pipeline ', '守住的高度：流水线 ') + land(walkers[0].x).toFixed(2) + ' · ' + T('rhythm ', '节奏 ') + land(walkers[2].best).toFixed(2) + ' · ' + T('goalless keeps nothing, now ', '无目标什么也不守，当前 ') + land(walkers[1].x).toFixed(2);
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 5: two priors. Given the same clean sandbox and no goal, Claude
  // built the Game of Life and Codex a to-do app, restart after restart.
  // The Game of Life here is real: Conway's rules on a small torus. The
  // to-do list is a stand-in. Restarting reseeds both; it does not run the
  // models, it replays what the essay reports.
  F.register('fig5.png', function (f) {
    var T = f.T, width = 0, restarts = 1, gen = 0, clock = 0, since = 0, CW = 30, CH = 18, cells;
    var TODOS = T(['write the first task', 'add a due date', 'filter by status', 'edit a task', 'sync with the server', 'sort by priority'],
      ['写下第一个任务', '加上截止日期', '按状态筛选', '编辑任务', '与服务器同步', '按优先级排序']);
    var done = 0, seed = 11;
    function seedLife() {
      var R = rng(seed + restarts * 97);
      cells = [];
      for (var i = 0; i < CW * CH; i++) cells.push(R() < 0.3 ? 1 : 0);
      gen = 0;
    }
    function stepLife() {
      var next = new Array(CW * CH);
      for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) {
        var n = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (dx || dy) n += cells[((y + dy + CH) % CH) * CW + (x + dx + CW) % CW];
        }
        var alive = cells[y * CW + x];
        next[y * CW + x] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
      }
      cells = next; gen++;
    }
    seedLife();
    var root = svg('svg', { role: 'img', 'aria-label': T('Claude builds the Game of Life, Codex a to-do app', 'Claude 构建生命游戏，Codex 构建待办应用') }, f.stage);
    var text = note(f.stage);
    function say() { text.textContent = T('Restart ', '第 ') + restarts + T(': Claude builds the Game of Life, Codex a to-do app. The theme does not change.', ' 次重启：Claude 构建生命游戏，Codex 构建待办应用。主题没有变。'); }
    say();
    var play = F.player(f.controls, T, function (on) { if (on) anim.start(true); });
    F.button(f.controls, T('restart the sandbox', '重启沙箱'), function () { play.set(false); restart(); running = true; anim.start(true); });
    var running = false;
    function restart() { restarts++; done = 0; since = 0; seedLife(); say(); }

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing() && !running) return false;
      clock += dt; since += dt;
      if (clock > 0.14) { clock = 0; stepLife(); }
      done = Math.min(TODOS.length, Math.floor(since / 1.3));
      if (play.playing() && since > 11) restart();
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 560, gap = 22, pw = wide ? (W - gap) / 2 : W;
      var head = 34, top = head + 30;
      box(root, (W - Math.min(W, 300)) / 2, 0, Math.min(W, 300), head, T('a clean sandbox, and no goal', '一个干净的沙箱，没有目标'), { dash: '4 3', fill: 'none', weight: 600 });
      var panels = [
        { x: 0, y: top, who: 'Claude', what: T('Conway’s Game of Life', '康威的生命游戏'), tags: [T('emergence, self-organization', '涌现，自组织'), T('language varied: Python, C, Go', '语言会变：Python、C、Go'), T('one file grows, then collapses', '单个文件越长越大，然后崩溃')], prior: T('autopoietic: sustains itself', '自创生：自我维持') },
        { x: wide ? pw + gap : 0, y: wide ? top : top + 330, who: 'Codex', what: T('a to-do app', '一个待办应用'), tags: [T('utility, convention', '实用，惯例'), T('Vue.js front end, Go back end', '前端 Vue.js，后端 Go'), T('architecture too early; dependencies untraceable', '过早引入架构；依赖难以追踪')], prior: T('allopoietic: exists for its users', '他组织：为使用者而存在') }
      ];
      var a = svg('g', { style: 'color: var(--text-muted)' }, root);
      if (wide) { arrow(a, W / 2 - 40, head + 4, pw / 2, top - 4); arrow(a, W / 2 + 40, head + 4, pw + gap + pw / 2, top - 4); }
      else arrow(a, W / 2, head + 4, W / 2, top - 4);
      panels.forEach(function (p, i) {
        var x = p.x, y = p.y;
        box(root, x, y, pw, 36, p.who + ' → ' + p.what, { weight: 600, fill: i ? 'var(--text)' : 'var(--navy)', stroke: i ? 'var(--text)' : 'var(--navy)', color: 'var(--bg)' });
        var sy = y + 46, sh = 160;
        svg('rect', { x: x + 0.5, y: sy + 0.5, width: pw - 1, height: sh - 1, rx: 8, fill: 'var(--bg-raised)', stroke: 'var(--border-strong)' }, root);
        if (i === 0) {
          var cs = Math.min((pw - 20) / CW, (sh - 20) / CH), ox = x + (pw - cs * CW) / 2, oy = sy + (sh - cs * CH) / 2;
          for (var k = 0; k < CW * CH; k++) if (cells[k]) svg('rect', { x: ox + (k % CW) * cs + 0.5, y: oy + Math.floor(k / CW) * cs + 0.5, width: cs - 1, height: cs - 1, rx: 1, fill: 'var(--navy)' }, root);
          svg('text', { x: x + pw - 4, y: sy + sh + 20, 'text-anchor': 'end', text: T('generation ', '第 ') + gen + T('', ' 代') }, root);
        } else {
          var rowH = (sh - 16) / TODOS.length;
          TODOS.forEach(function (td, k) {
            var ry = sy + 8 + k * rowH, isDone = k < done;
            svg('rect', { x: x + 14, y: ry + rowH / 2 - 6, width: 12, height: 12, rx: 3, fill: isDone ? 'var(--text)' : 'none', stroke: 'var(--text-secondary)' }, root);
            if (isDone) svg('path', { d: 'M' + (x + 17) + ',' + (ry + rowH / 2) + ' l3,3 l5,-6', fill: 'none', stroke: 'var(--bg)', 'stroke-width': 1.8 }, root);
            var tx = styled(svg('text', { x: x + 34, y: ry + rowH / 2 + 4, text: td }, root), isDone ? 'text-decoration: line-through; fill: var(--text-muted)' : 'fill: var(--text)');
            void tx;
          });
        }
        p.tags.forEach(function (tg, k) { svg('text', { x: x + 4, y: sy + sh + 20 + k * 17, text: '· ' + tg }, root); });
        styled(svg('text', { x: x + 4, y: sy + sh + 20 + p.tags.length * 17 + 8, text: p.prior }, root), 'font-weight: 600; fill: ' + (i ? 'var(--text)' : 'var(--navy)'));
      });
      var H = wide ? top + 46 + 160 + 20 + 3 * 17 + 14 : top + 330 + 46 + 160 + 20 + 3 * 17 + 14;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });
})();
