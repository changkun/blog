// The two figures of "Dark Forest Theory: A Formal Derivation", drawn with
// the blog's figure kit (themes/ink/assets/js/ifig.js). Each replaces the
// image of the same name, in the language of the block it sits in.
//
// Figure 1 computes Proposition 2 and 3 directly. Figure 2 is a small
// agent-based universe whose rules are stated in Section 9 of the post and
// again below; nothing in it is decided by the theorem it checks.
(function () {
  'use strict';
  var F = window.ifig;
  if (!F) return;
  var svg = F.svg, el = F.el, wrap = F.wrap;
  var SANS = F.sans();

  function styled(node, css) { node.setAttribute('style', css); return node; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function note(stage) {
    var p = el('p', { class: 'ifig-note' }, stage);
    p.setAttribute('style', 'min-height: 3.2em; margin: 10px 0 0; font-size: 14px; color: var(--text-secondary)');
    return p;
  }

  // ------------------------------------------------------------------
  // Figure 1: the chain of suspicion and the game after exposure.
  //
  // Strike success q varies across civilizations, uniformly on
  // [q̄ − s, q̄ + s]; a civilization strikes when the threat it perceives
  // exceeds its threshold 1 − q (Proposition 3, large M). So
  //   F(r) = P(q > 1 − r) = clamp((q̄ + s − 1 + r) / 2s, 0, 1),
  // a step at 1 − q̄ when s = 0, and the identity when q̄ = s = 0.5.
  // The chain is r₀ = π, rₙ₊₁ = π + (1 − π) F(rₙ).
  //
  // The map on the left is for identical civilizations (s = 0): striking is
  // the only equilibrium when π > 1 − q; both are, with striking
  // risk-dominant, when (1 − π)/2 < q ≤ 1 − π; otherwise restraint is
  // risk-dominant.
  F.register('fig-chain.png', function (f) {
    var T = f.T, width = 0, pi = 0.1, qm = 0.7, s = 0, steps = f.reduced ? 99 : 0, clock = 0, stage = 0;
    var TOUR = [
      { pi: 0.10, q: 0.70, s: 0, text: T('Identical civilizations with q = 0.7: the chain stops at π at once. Both equilibria exist, and striking is the risk-dominant one.', '彼此相同的文明，q = 0.7：猜疑链当场停在 π。两个均衡都存在，打击是风险占优的那个。') },
      { pi: 0.10, q: 0.95, s: 0, text: T('q = 0.95: the threshold 1 − q is below π, so the chain collapses in one step. Striking is the only equilibrium.', 'q = 0.95：门槛 1 − q 低于 π，猜疑链一步就崩塌。打击是唯一的均衡。') },
      { pi: 0.10, q: 0.30, s: 0, text: T('q = 0.3: the chain stops at π, and restraint is the risk-dominant equilibrium.', 'q = 0.3：猜疑链停在 π，克制是风险占优的均衡。') },
      { pi: 0.10, q: 0.50, s: 0.5, text: T('Thresholds spread evenly over [0, 1]: this is the original recurrence, and it always climbs to 1.', '门槛在 [0, 1] 上均匀分布：这就是原来那条递推，它总会爬到 1。') },
      { pi: 0.40, q: 0.20, s: 0.5, text: T('Some civilizations can never strike successfully: the chain comes to rest partway.', '有些文明的打击永远不可能成功：猜疑链停在了半路。') }
    ];
    var root = svg('svg', { role: 'img', 'aria-label': T('The chain of suspicion, and which equilibria exist', '猜疑链，以及存在哪些均衡') }, f.stage);
    var text = note(f.stage);
    text.textContent = TOUR[0].text;
    var play = F.player(f.controls, T, function (on) { if (on) { stage = -1; clock = 99; anim.start(true); } });
    function manual() { play.set(false); steps = 0; anim.start(true); }
    var sPi = F.slider(f.controls, { label: 'π', min: 0, max: 0.6, step: 0.01, value: pi, format: function (v) { return v.toFixed(2); }, onInput: function (v) { pi = v; manual(); } });
    var sQ = F.slider(f.controls, { label: 'q', min: 0, max: 1, step: 0.01, value: qm, format: function (v) { return v.toFixed(2); }, onInput: function (v) { qm = v; manual(); } });
    var sS = F.slider(f.controls, { label: T('spread', '分散'), min: 0, max: 0.5, step: 0.01, value: s, format: function (v) { return v.toFixed(2); }, onInput: function (v) { s = v; manual(); } });
    F.button(f.controls, T('original recurrence', '原来的递推'), function () { qm = 0.5; s = 0.5; sQ.set(qm); sS.set(s); manual(); });

    function Fr(r) {
      if (s < 1e-6) return r > 1 - qm ? 1 : 0;
      return clamp((qm + s - 1 + r) / (2 * s), 0, 1);
    }
    function G(r) { return pi + (1 - pi) * Fr(r); }
    function limit() {
      var r = pi;
      for (var i = 0; i < 400; i++) { var n = G(r); if (Math.abs(n - r) < 1e-9) return n; r = n; }
      return r;
    }
    function verdict() {
      if (pi > 1 - qm) return T('only striking is an equilibrium', '只有打击是均衡');
      if (qm > (1 - pi) / 2) return T('both are equilibria; striking is risk-dominant', '两者都是均衡；打击风险占优');
      return T('both are equilibria; restraint is risk-dominant', '两者都是均衡；克制风险占优');
    }
    function describe() {
      var L = limit();
      var chain = L > 0.999 ? T('The chain climbs to 1.', '猜疑链爬到了 1。') : T('The chain stops at r = ', '猜疑链停在 r = ') + L.toFixed(2) + T('.', '。');
      return chain + (s < 1e-6 ? ' ' + T('For identical civilizations here, ', '对这里彼此相同的文明来说，') + verdict() + T('.', '。') : '');
    }

    var anim = F.loop(f.root, function (dt) {
      if (play.playing()) {
        clock += dt;
        if (clock > 5.5) {
          clock = 0; stage = (stage + 1) % TOUR.length;
          var st = TOUR[stage];
          pi = st.pi; qm = st.q; s = st.s; sPi.set(pi); sQ.set(qm); sS.set(s); steps = 0;
          text.textContent = st.text;
        }
      }
      steps = Math.min(40, steps + dt / 0.32);
      draw();
      return play.playing() || steps < 40;
    });

    var dragging = false;
    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 600, gap = 40;
      var side = wide ? Math.min(260, (W - gap) / 2 - 48) : Math.min(W - 56, 300);
      var L = 48, Tp = 10, H = wide ? side + Tp + 44 : 2 * (side + Tp + 44) + 12;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

      // Left: which equilibria exist, for identical civilizations.
      var x0 = L, y0 = Tp;
      var mx = function (v) { return x0 + v * side; }, my = function (v) { return y0 + (1 - v) * side; };
      svg('polygon', { points: [mx(0), my(1), mx(1), my(1), mx(1), my(0)].join(' '), fill: 'var(--navy)', 'fill-opacity': 0.22 }, root);
      svg('polygon', { points: [mx(0), my(0.5), mx(0), my(1), mx(1), my(0)].join(' '), fill: 'var(--navy)', 'fill-opacity': 0.09 }, root);
      svg('rect', { x: mx(0), y: my(1), width: side, height: side, fill: 'none', stroke: 'var(--border-strong)' }, root);
      function label(x, y, str, anchor) {
        wrap(str, '12px ' + SANS, side * 0.5).forEach(function (ln, k) {
          styled(svg('text', { x: x, y: y + k * 14, 'text-anchor': anchor || 'middle', text: ln }, root), 'font-size: 12px; fill: var(--text)');
        });
      }
      label(mx(0.74), my(0.86), T('only striking', '只有打击'));
      label(mx(0.27), my(0.62), T('both; striking safer', '两者皆可；打击更稳妥'));
      label(mx(0.3), my(0.2), T('both; restraint safer', '两者皆可；克制更稳妥'));
      svg('text', { x: mx(0.5), y: my(0) + 30, 'text-anchor': 'middle', text: T('base threat π', '基础威胁 π') }, root);
      svg('text', { 'text-anchor': 'middle', transform: 'translate(' + (x0 - 34) + ',' + my(0.5) + ') rotate(-90)', text: T('strike success q', '打击成功率 q') }, root);
      [0, 0.5, 1].forEach(function (v) {
        svg('text', { x: mx(v), y: my(0) + 14, 'text-anchor': 'middle', text: String(v) }, root);
        svg('text', { x: x0 - 6, y: my(v) + 4, 'text-anchor': 'end', text: String(v) }, root);
      });
      svg('circle', { cx: mx(pi), cy: my(qm), r: 6.5, fill: 'var(--navy)', stroke: 'var(--bg)', 'stroke-width': 2 }, root);
      var hit = svg('rect', { x: mx(0), y: my(1), width: side, height: side, fill: 'transparent', style: 'cursor: crosshair; touch-action: none' }, root);
      function pick(e) {
        var box = hit.getBoundingClientRect();
        pi = clamp((e.clientX - box.left) / box.width, 0, 0.6);
        qm = clamp(1 - (e.clientY - box.top) / box.height, 0, 1);
        pi = Math.round(pi * 100) / 100; qm = Math.round(qm * 100) / 100;
        sPi.set(pi); sQ.set(qm); manual();
      }
      hit.addEventListener('pointerdown', function (e) { dragging = true; hit.setPointerCapture(e.pointerId); pick(e); });
      hit.addEventListener('pointermove', function (e) { if (dragging) pick(e); });
      hit.addEventListener('pointerup', function () { dragging = false; });

      // Right: the chain, as a cobweb on r ↦ π + (1 − π) F(r).
      var cx0 = wide ? x0 + side + gap + 44 : L, cy0 = wide ? Tp : Tp + side + 44 + 12;
      var cside = side;
      var px = function (v) { return cx0 + v * cside; }, py = function (v) { return cy0 + (1 - v) * cside; };
      svg('rect', { x: px(0), y: py(1), width: cside, height: cside, fill: 'none', stroke: 'var(--border-strong)' }, root);
      svg('line', { x1: px(0), y1: py(0), x2: px(1), y2: py(1), stroke: 'var(--text-muted)', 'stroke-dasharray': '4 4' }, root);
      var d = '';
      for (var i = 0; i <= 400; i++) {
        var r = i / 400;
        d += (i ? 'L' : 'M') + px(r).toFixed(1) + ',' + py(G(r)).toFixed(1);
      }
      svg('path', { d: d, fill: 'none', stroke: 'var(--text)', 'stroke-width': 2 }, root);
      // The staircase, drawn one segment at a time: up to the curve, then
      // across to the diagonal.
      var pts = [[pi, 0]], r0 = pi;
      for (var k = 0; k < 40; k++) { var r1 = G(r0); pts.push([r0, r1]); pts.push([r1, r1]); r0 = r1; }
      var segs = Math.min(pts.length - 1, Math.floor(steps * 2)), frac = steps * 2 - Math.floor(steps * 2);
      var path = 'M' + px(pts[0][0]) + ',' + py(pts[0][1]);
      for (var m = 1; m <= segs; m++) path += ' L' + px(pts[m][0]) + ',' + py(pts[m][1]);
      if (segs < pts.length - 1) {
        var a = pts[segs], b = pts[segs + 1];
        path += ' L' + px(a[0] + (b[0] - a[0]) * frac) + ',' + py(a[1] + (b[1] - a[1]) * frac);
      }
      svg('path', { d: path, fill: 'none', stroke: 'var(--navy)', 'stroke-width': 1.6 }, root);
      var Lr = limit();
      if (steps >= 6 || f.reduced) svg('circle', { cx: px(Lr), cy: py(Lr), r: 5, fill: 'var(--navy)' }, root);
      svg('circle', { cx: px(pi), cy: py(0), r: 3.5, fill: 'var(--navy)' }, root);
      svg('text', { x: px(0.5), y: py(0) + 30, 'text-anchor': 'middle', text: T('threat believed at this level, r', '这一阶相信的威胁 r') }, root);
      svg('text', { 'text-anchor': 'middle', transform: 'translate(' + (cx0 - 34) + ',' + py(0.5) + ') rotate(-90)', text: T('at the next level', '下一阶') }, root);
      [0, 0.5, 1].forEach(function (v) {
        svg('text', { x: px(v), y: py(0) + 14, 'text-anchor': 'middle', text: String(v) }, root);
        svg('text', { x: cx0 - 6, y: py(v) + 4, 'text-anchor': 'end', text: String(v) }, root);
      });
      if (!play.playing()) text.textContent = describe();
    }
    if (f.reduced) text.textContent = describe();
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 2: a small dark forest.
  //
  // One hundred civilizations sit at fixed random places on a unit torus.
  // Each has two heritable traits, b (broadcasts) and s (strikes whatever it
  // detects); a share p is hostile and strikes whatever it detects. Within
  // range L, once light from j has had time to arrive (distance / c steps),
  // i detects j with probability λR per step if j broadcasts or was recently
  // exposed, λH otherwise. Strikes travel at c and succeed with probability
  // q; a failed strike reveals the attacker to its target, which strikes
  // back; any strike exposes the attacker to everyone with probability e.
  // Civilizations die of other causes at rate 0.002 per step. A dead slot is
  // refilled after 15 steps by an offspring of a survivor, drawn in
  // proportion to 1 + B × its peaceful contacts (pairs that know each other
  // and have not struck); each trait flips with probability 0.02 at birth,
  // and the offspring is hostile with probability p.
  var BASE = { N: 100, p: 0.1, q: 0.7, e: 0.2, B: 0.3, lamR: 0.2, lamH: 0.004, L: 0.3, c: 0.02, v: 0.02, death: 0.002, mu: 0.02, respawn: 15 };
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
  function forest(P, seed) {
    var R = rng(seed), f = { t: 0, civs: [], strikes: [], flashes: [], hist: [] }, pairs = {};
    function key(c) { return c.id + '/' + c.gen; }
    function spawn(slot, parent) {
      var prev = f.civs[slot], b, s;
      if (parent) { b = parent.b; s = parent.s; if (R() < P.mu) b = 1 - b; if (R() < P.mu) s = 1 - s; }
      else { b = R() < 0.7 ? 1 : 0; s = R() < 0.3 ? 1 : 0; }
      f.civs[slot] = { id: slot, gen: prev ? prev.gen + 1 : 0, x: R(), y: R(), alive: true, hostile: R() < P.p, b: b, s: s, born: f.t, known: {}, contacts: 0, flare: 0, deadAt: -1 };
    }
    for (var i = 0; i < P.N; i++) spawn(i, null);
    function delta(a, b) {
      var dx = b.x - a.x, dy = b.y - a.y;
      if (dx > 0.5) dx -= 1; if (dx < -0.5) dx += 1; if (dy > 0.5) dy -= 1; if (dy < -0.5) dy += 1;
      return [dx, dy];
    }
    function dist(a, b) { var d = delta(a, b); return Math.sqrt(d[0] * d[0] + d[1] * d[1]); }
    function launch(a, b) {
      f.strikes.push({ from: a.id, fromGen: a.gen, to: b.id, toGen: b.gen, t0: f.t, arrive: f.t + dist(a, b) / P.v, x: a.x, y: a.y, d: delta(a, b) });
      pairs[key(a) + '|' + key(b)] = pairs[key(b) + '|' + key(a)] = 1;
    }
    function kill(c) { c.alive = false; c.deadAt = f.t; }
    f.step = function () {
      var t = ++f.t, civs = f.civs, i, j;
      for (i = 0; i < civs.length; i++) if (civs[i].alive && R() < P.death) kill(civs[i]);
      for (i = 0; i < civs.length; i++) {
        var a = civs[i];
        if (!a.alive) continue;
        for (j = 0; j < civs.length; j++) {
          var b = civs[j];
          if (j === i || !b.alive || a.known[key(b)]) continue;
          var d = dist(a, b);
          if (d > P.L || t - b.born < d / P.c) continue;
          if (R() < (b.b || b.flare > t ? P.lamR : P.lamH)) {
            a.known[key(b)] = 1;
            if (a.hostile || a.s) launch(a, b);
          }
        }
      }
      var keep = [];
      f.strikes.forEach(function (s) {
        if (t < s.arrive) { keep.push(s); return; }
        var a = civs[s.from], b = civs[s.to];
        var aLive = a.alive && a.gen === s.fromGen, bLive = b.alive && b.gen === s.toGen;
        if (aLive && R() < P.e) a.flare = t + 40;
        if (!bLive) return;
        if (R() < P.q) { kill(b); f.flashes.push({ x: b.x, y: b.y, t: t }); }
        else if (aLive) { b.known[key(a)] = 1; launch(b, a); }
      });
      f.strikes = keep;
      civs.forEach(function (c) { c.contacts = 0; });
      civs.forEach(function (c) {
        if (!c.alive) return;
        Object.keys(c.known).forEach(function (k) {
          var parts = k.split('/'), o = civs[+parts[0]];
          if (o.alive && o.gen === +parts[1] && o.known[key(c)] && !pairs[key(c) + '|' + k]) c.contacts++;
        });
      });
      var alive = civs.filter(function (c) { return c.alive; });
      civs.forEach(function (c) {
        if (c.alive || t - c.deadAt < P.respawn || !alive.length) return;
        var tot = 0; alive.forEach(function (a) { tot += 1 + P.B * a.contacts; });
        var r = R() * tot, parent = alive[0];
        for (var k = 0; k < alive.length; k++) { r -= 1 + P.B * alive[k].contacts; if (r <= 0) { parent = alive[k]; break; } }
        spawn(c.id, parent);
      });
      f.flashes = f.flashes.filter(function (x) { return t - x.t < 24; });
      if (t % 20 === 0) f.hist.push(f.shares());
    };
    f.shares = function () {
      var alive = f.civs.filter(function (c) { return c.alive; }), nh = alive.filter(function (c) { return !c.hostile; });
      return {
        loud: alive.length ? alive.filter(function (c) { return c.b; }).length / alive.length : 0,
        strike: nh.length ? nh.filter(function (c) { return c.s; }).length / nh.length : 0
      };
    };
    f.hist.push(f.shares());
    return f;
  }

  F.register('fig-forest.png', function (f) {
    var T = f.T, width = 0, live = false, seed = 1, runLen = 3000, perFrame = 4, stage = 0;
    var PRESETS = [
      { name: T('dark forest', '黑暗森林'), p: 0.1, q: 0.7, e: 0.2, B: 0.3, text: T('Hostile civilizations exist: broadcasting dies out, and so does striking.', '存在敌对文明：广播消失了，打击也消失了。') },
      { name: T('hunting ground', '猎场'), p: 0.3, q: 0.95, e: 0, B: 0.3, text: T('Many hostiles, strikes that almost always succeed and that no one else sees: striking spreads.', '敌对文明众多，打击几乎必定成功，而且别人看不见：打击蔓延开来。') },
      { name: T('strikes fail', '打击失败'), p: 0.1, q: 0.15, e: 0.8, B: 0.3, text: T('Strikes usually fail and expose the attacker: nobody strikes, but the hostile few still keep most civilizations quiet.', '打击通常失败，还会暴露攻击者：没有谁去打击，但少数敌对文明仍让大多数文明保持安静。') },
      { name: T('lit forest', '明亮的森林'), p: 0, q: 0.15, e: 0.2, B: 1.5, text: T('No hostiles, and contact pays: most civilizations keep broadcasting.', '没有敌对文明，接触又有好处：大多数文明一直在广播。') }
    ];
    var P = Object.assign({}, BASE, { p: PRESETS[0].p, q: PRESETS[0].q, e: PRESETS[0].e, B: PRESETS[0].B });
    var sim = forest(P, seed);
    var root = svg('svg', { role: 'img', 'aria-label': T('A simulated dark forest', '一片模拟的黑暗森林') }, f.stage);
    var text = note(f.stage);
    text.textContent = PRESETS[0].text;
    var play = F.player(f.controls, T, function (on) { live = false; if (on) { load(0, true); anim.start(true); } });
    var pbtn = PRESETS.map(function (pr, k) {
      return F.button(f.controls, pr.name, function () { play.set(false); live = true; load(k, false); anim.start(true); });
    });
    function slider(label, key, max) {
      return F.slider(f.controls, { label: label, min: 0, max: max, step: 0.05, value: P[key], format: function (v) { return v.toFixed(2); },
        onInput: function (v) { play.set(false); live = true; P[key] = v; pbtn.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); anim.start(true); } });
    }
    var sl = { p: slider(T('hostile p', '敌对 p'), 'p', 0.5), q: slider(T('success q', '成功率 q'), 'q', 1), e: slider(T('exposure e', '暴露 e'), 'e', 1), B: slider(T('contact B', '接触 B'), 'B', 2) };
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    function load(k, touring) {
      stage = k;
      var pr = PRESETS[k];
      ['p', 'q', 'e', 'B'].forEach(function (key) { P[key] = pr[key]; sl[key].set(pr[key]); });
      seed++;
      sim = forest(P, seed);
      pbtn.forEach(function (b, i) { b.setAttribute('aria-pressed', i === k ? 'true' : 'false'); });
      text.textContent = pr.text;
    }
    pbtn[0].setAttribute('aria-pressed', 'true');

    var anim = F.loop(f.root, function () {
      if (!play.playing() && !live) return false;
      for (var i = 0; i < perFrame; i++) sim.step();
      if (play.playing() && sim.t >= runLen) load((stage + 1) % PRESETS.length, true);
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 600, gap = 28;
      var side = wide ? Math.min(300, W * 0.46) : Math.min(W, 340);
      var cw = wide ? W - side - gap : W, ch = wide ? side : 170;
      var H = wide ? side + 34 : side + 20 + ch + 34;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

      // The map.
      var clipId = 'dfclip' + Math.round(W);
      var defs = svg('defs', {}, root), cp = svg('clipPath', { id: clipId }, defs);
      svg('rect', { x: 0, y: 0, width: side, height: side }, cp);
      svg('rect', { x: 0.5, y: 0.5, width: side - 1, height: side - 1, rx: 6, fill: 'var(--bg-raised)', stroke: 'var(--border-strong)' }, root);
      var g = svg('g', { 'clip-path': 'url(#' + clipId + ')' }, root);
      var t = sim.t;
      sim.strikes.forEach(function (s) {
        var k = clamp((t - s.t0) / Math.max(1, s.arrive - s.t0), 0, 1), k0 = Math.max(0, k - 0.18);
        var x1 = (s.x + s.d[0] * k0) * side, y1 = (s.y + s.d[1] * k0) * side, x2 = (s.x + s.d[0] * k) * side, y2 = (s.y + s.d[1] * k) * side;
        svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'var(--text)', 'stroke-width': 1.2, 'stroke-opacity': 0.7 }, g);
        svg('circle', { cx: x2, cy: y2, r: 1.6, fill: 'var(--text)' }, g);
      });
      sim.flashes.forEach(function (fl) {
        var a = (t - fl.t) / 24;
        svg('circle', { cx: fl.x * side, cy: fl.y * side, r: 4 + a * 12, fill: 'none', stroke: 'var(--text)', 'stroke-opacity': 0.6 * (1 - a) }, g);
      });
      sim.civs.forEach(function (c) {
        if (!c.alive) return;
        var x = c.x * side, y = c.y * side, loud = c.b || c.flare > t;
        if (c.b) svg('circle', { cx: x, cy: y, r: 7, fill: 'var(--navy)', 'fill-opacity': 0.12 }, g);
        svg('circle', { cx: x, cy: y, r: 3.2, fill: loud ? 'var(--navy)' : 'var(--text-muted)', 'fill-opacity': loud ? 1 : 0.7 }, g);
        if (c.hostile || c.s) svg('circle', { cx: x, cy: y, r: 5.4, fill: 'none', stroke: 'var(--text)', 'stroke-width': 1 }, g);
      });

      // The chart.
      var cx0 = wide ? side + gap : 0, cy0 = wide ? 0 : side + 20;
      var L = 34, Rm = 8, Tp = 22, Bm = 26, pw = cw - L - Rm, ph = ch - Tp - Bm;
      var X = function (k) { return cx0 + L + pw * k / (runLen / 20); }, Y = function (v) { return cy0 + Tp + ph * (1 - v); };
      svg('line', { x1: cx0 + L, y1: Y(0), x2: cx0 + L + pw, y2: Y(0), stroke: 'var(--border-strong)' }, root);
      svg('line', { x1: cx0 + L, y1: Y(0), x2: cx0 + L, y2: Y(1), stroke: 'var(--border-strong)' }, root);
      [0, 0.5, 1].forEach(function (v) { svg('text', { x: cx0 + L - 6, y: Y(v) + 4, 'text-anchor': 'end', text: Math.round(v * 100) + '%' }, root); });
      svg('text', { x: cx0 + L + pw, y: Y(0) + 18, 'text-anchor': 'end', text: T('steps', '步数') + ' → ' + runLen }, root);
      var hist = sim.hist.slice(-runLen / 20);
      function line(keyName, stroke, sw) {
        var d = '';
        hist.forEach(function (h, k) { d += (k ? 'L' : 'M') + X(k).toFixed(1) + ',' + Y(h[keyName]).toFixed(1); });
        if (d) svg('path', { d: d, fill: 'none', stroke: stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' }, root);
      }
      line('loud', 'var(--navy)', 2.2);
      line('strike', 'var(--text)', 1.6);
      svg('line', { x1: cx0 + L, y1: cy0 + 8, x2: cx0 + L + 16, y2: cy0 + 8, stroke: 'var(--navy)', 'stroke-width': 2.2 }, root);
      var t1 = styled(svg('text', { x: cx0 + L + 22, y: cy0 + 12, text: T('broadcasting', '广播') }, root), 'fill: var(--navy)');
      var lx = cx0 + L + 22 + t1.getComputedTextLength() + 16;
      svg('line', { x1: lx, y1: cy0 + 8, x2: lx + 16, y2: cy0 + 8, stroke: 'var(--text)', 'stroke-width': 1.6 }, root);
      svg('text', { x: lx + 22, y: cy0 + 12, text: T('striking (non-hostile)', '打击（非敌对）') }, root);
      styled(svg('text', { x: 0, y: H - 6, text: T('illustrative, not data', '示意，并非数据') }, root), 'font-style: italic; fill: var(--text-muted)');
      var sh = sim.shares();
      readout.textContent = T('step ', '第 ') + t + T('', ' 步') + ' · ' + T('broadcasting ', '广播 ') + Math.round(sh.loud * 100) + '% · ' + T('striking ', '打击 ') + Math.round(sh.strike * 100) + '%';
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });
})();
