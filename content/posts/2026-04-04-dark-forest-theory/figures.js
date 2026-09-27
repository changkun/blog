// The two figures of "Dark Forest Theory: A Formal Derivation", drawn with
// the blog's figure kit (themes/ink/assets/js/ifig.js). Each replaces the
// image of the same name, in the language of the block it sits in.
//
// Figure 1 computes Proposition 2 and 3 directly. Figure 2 is a small
// agent-based universe with two modes, whose rules are stated in Section 9
// of the post and again below: in the selection mode behaviours are
// inherited and culled, in the reasoning mode civilizations decide by
// Propositions 3 and 4 with beliefs learned from what they see.
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
    var sPi = F.slider(f.controls, { label: 'π', min: 0, max: 0.99, step: 0.01, value: pi, format: function (v) { return v.toFixed(2); }, onInput: function (v) { pi = v; manual(); } });
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

    var dragging = false, geo = null;
    function local(e) {
      var r = root.getBoundingClientRect();
      return { x: (e.clientX - r.left) * geo.W / r.width, y: (e.clientY - r.top) * geo.H / r.height };
    }
    function inMap(p) { return p.x >= geo.x0 && p.x <= geo.x0 + geo.side && p.y >= geo.y0 && p.y <= geo.y0 + geo.side; }
    function pick(e) {
      var p = local(e);
      pi = Math.round(clamp((p.x - geo.x0) / geo.side, 0, 0.99) * 100) / 100;
      qm = Math.round(clamp(1 - (p.y - geo.y0) / geo.side, 0, 1) * 100) / 100;
      sPi.set(pi); sQ.set(qm); manual();
    }
    root.addEventListener('pointerdown', function (e) {
      if (!geo || !inMap(local(e))) return;
      dragging = true; root.setPointerCapture(e.pointerId); pick(e);
    });
    root.addEventListener('pointermove', function (e) { if (dragging) pick(e); });
    root.addEventListener('pointerup', function () { dragging = false; });
    root.addEventListener('pointercancel', function () { dragging = false; });
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
      // The map is redrawn every frame while the chain animates, so the
      // pointer is handled on the figure itself, which persists, and this
      // rectangle only sets the cursor and stops touch scrolling.
      svg('rect', { x: mx(0), y: my(1), width: side, height: side, fill: 'transparent', style: 'cursor: crosshair; touch-action: none' }, root);
      geo = { x0: x0, y0: y0, side: side, W: W, H: H };

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

  // ------------------------------------------------------------------
  // Figure 2, reasoning mode: civilizations that decide by the theory.
  //
  // Civilizations arise independently, at a random place, with probability
  // b per step, and only where no living civilization's territory already
  // lies (A2: space and matter are finite). A newcomer has capability 1 and
  // is hostile with probability p, a type no one else can see (B2).
  // Capability grows on resources shared with overlapping neighbours,
  //   cap ← cap · exp(g (1 − crowd / K) + gB · B · contacts − gC · hiding),
  // where crowd is its own capability plus its neighbours' weighted by how
  // much their territories overlap; territory has radius τ0 √cap. With
  // probability j per step capability jumps F-fold (B4). A civilization is
  // found, per step, by each one within range L whose light it has reached
  // (B3), with probability λ √cap, λ = λR if it broadcasts and λH if it
  // hides, so expansion makes hiding harder. A strike travels at v and
  // succeeds with probability 1 − exp(−s · cap_a / cap_b) (B5); a failed
  // one reveals the attacker to its target, and any strike is seen by those
  // within L of the target, each of whom also locates the attacker with
  // probability e. Civilizations die of other causes at rate d.
  //
  // Beliefs come from what a civilization sees: of the civilizations it has
  // found and not struck itself, the share destroyed by a strike within H
  // steps of being found, a Beta(α0, β0) estimate ρ̂ that starts near zero. Decisions are the
  // post's formulas with these beliefs:
  //   hide or broadcast, Proposition 4: hide iff ΔΛ · ρ̂ · M > B + C, where
  //     ΔΛ is how much broadcasting raises the chance of being found within
  //     H, along the civilization's projected growth;
  //   strike or wait on finding b, Proposition 3 extended to one-sided
  //     detection, unequal capability and exposure:
  //     wait risks r · q_H(b→a), with r = D · σ̂, D the chance b finds a
  //     within H (1 if b has already struck a), σ̂ = min(1, ρ̂ / q̄) the
  //     chance that a finder strikes (1 for a known striker), and q_H b's
  //     success allowing for b to explode; striking risks
  //     (1 − q(a→b)) q(b→a), a failed strike answered, plus X, the chance
  //     that one of the n civilizations a knows near b sees the strike and
  //     answers it, 1 − (1 − e σ̂ q̄)^n, plus the cost K/M.
  //   Hostile civilizations decide Proposition 4 the same way but strike
  //   whatever they find. Every `every` steps each civilization reconsiders
  //   the ones it knows, as beliefs and capabilities change.
  var BASE2 = { b: 0.3, d: 0.001, p: 0.1, g: 0.02, K: 20, tau0: 0.01, j: 0.001, F: 5,
    lamR: 0.2, lamH: 0.0005, L: 0.2, c: 0.02, v: 0.02, s: 1.2, e: 0.2, B: 0.3, gB: 0.004,
    C: 0.5, gC: 0.002, M: 200, Kst: 0.1, H: 400, a0: 0.1, b0: 20, A2: 1, learn: 1, cap: 250, every: 20, mature: 100 };
  function reason(P, seed) {
    var R = rng(seed), f = { t: 0, civs: [], strikes: [], flashes: [], hist: [], finds: 0, pre: 0, bins: [], born: 0, grown: 0, sbins: [], last: [0, 0] };
    var byId = {}, events = [], nextId = 0, qbar = 1 - Math.exp(-P.s);
    function delta(a, b) {
      var dx = b.x - a.x, dy = b.y - a.y;
      if (dx > 0.5) dx -= 1; if (dx < -0.5) dx += 1; if (dy > 0.5) dy -= 1; if (dy < -0.5) dy += 1;
      return [dx, dy];
    }
    function dist(a, b) { var d = delta(a, b); return Math.sqrt(d[0] * d[0] + d[1] * d[1]); }
    function tau(c) { return P.tau0 * Math.sqrt(c.cap); }
    function lam(cap, loud) { return Math.min(1, (loud ? P.lamR : P.lamH) * (P.A2 ? Math.sqrt(cap) : 1)); }
    function rho(c) { return (P.a0 + c.succ) / (P.a0 + P.b0 + c.trials); }
    function sig(c) { return Math.min(1, rho(c) / qbar); }
    function q(a, b, k) { return 1 - Math.exp(-P.s * (k || 1) * a.cap / b.cap); }
    // Capability along the civilization's own logistic path toward what its
    // neighbours leave it, and the chance of being found within w steps.
    function findProb(c, loud, w) {
      if (w <= 0) return 0;
      var room = Math.max(c.cap, P.K - (c.crowd - c.cap)), logS = 0, n = 8;
      for (var k = 0; k < n; k++) {
        var tk = (k + 0.5) * w / n;
        var cap = P.A2 ? room / (1 + (room / c.cap - 1) * Math.exp(-P.g * tk)) : c.cap;
        var l = lam(cap, loud);
        if (l >= 1) return 1;
        logS += (w / n) * Math.log(1 - l);
      }
      return 1 - Math.exp(logS);
    }
    function decideLoud(c) {
      var dL = findProb(c, true, P.H) - findProb(c, false, P.H);
      c.b = !(dL * rho(c) * P.M > P.B + P.C);
    }
    function decideStrike(a, b, info) {
      if (a.hostile) return true;
      var d = dist(a, b), seen = f.t - a.born - d / P.c;
      var D = info.foundMe ? 1 : findProb(a, a.b, P.H + Math.min(0, seen));
      var s = info.striker ? 1 : sig(a), r = D * s;
      var px = 1 - Math.pow(1 - P.j, P.H), qba = q(b, a);
      var qH = (1 - px) * qba + px * q(b, a, P.F);
      var n = 0;
      Object.keys(a.known).forEach(function (id) {
        var o = byId[id];
        if (o && o.alive && o !== b && dist(o, b) <= P.L) n++;
      });
      var X = 1 - Math.pow(1 - P.e * sig(a) * qbar, n);
      var wait = -r * qH * P.M, strike = -(1 - q(a, b)) * qba * P.M - X * P.M - P.Kst;
      return strike > wait;
    }
    function launch(a, b, first) {
      var info = a.known[b.id];
      if (info.struck) return;
      info.struck = true;
      if (!a.hostile && first) { f.pre++; a.pre = true; if (P.onPre) P.onPre(a, b); }
      f.strikes.push({ from: a.id, to: b.id, t0: f.t, arrive: f.t + dist(a, b) / P.v, x: a.x, y: a.y, d: delta(a, b) });
    }
    function learn(a, b, striker, foundMe) {
      var info = a.known[b.id];
      if (!info) {
        info = a.known[b.id] = { t: f.t, striker: false, foundMe: false };
        if (!a.hostile && !striker) { f.finds++; if (P.onFind) P.onFind(a, b); }
      }
      if (striker) info.striker = true;
      if (foundMe) info.foundMe = true;
      if (!info.struck && decideStrike(a, b, info)) launch(a, b, !info.foundMe && !info.striker);
    }
    function kill(c, how) { c.alive = false; c.deadAt = f.t; c.how = how; }
    function born() {
      var c = { id: nextId++, x: R(), y: R(), born: f.t, alive: true, hostile: R() < P.p, cap: 1, crowd: 1,
        known: {}, trials: 0, succ: 0, b: true, pre: false, deadAt: -1, contacts: 0 };
      var alive = f.civs.filter(function (o) { return o.alive; });
      if (alive.length >= P.cap) return;
      for (var i = 0; i < alive.length; i++) if (dist(alive[i], c) < tau(alive[i]) + P.tau0) return;
      decideLoud(c);
      f.civs.push(c); byId[c.id] = c; f.born++;
    }
    f.step = function () {
      var t = ++f.t, i, j;
      if (R() < P.b) born();
      var civs = f.civs.filter(function (c) { return c.alive; });
      civs.forEach(function (c) { if (R() < P.d) kill(c, 'other'); else if (t - c.born === P.mature) f.grown++; });
      civs = civs.filter(function (c) { return c.alive; });
      // A2 and B4: shared resources, contact, the cost of hiding, explosions.
      civs.forEach(function (c) {
        var crowd = c.cap, contacts = 0;
        civs.forEach(function (o) {
          if (o === c) return;
          var w = 1 - dist(c, o) / (tau(c) + tau(o));
          if (w > 0) crowd += o.cap * w;
          var k = c.known[o.id];
          if (k && !k.striker && c.b && o.b && o.known[c.id] && !o.known[c.id].striker) contacts++;
        });
        c.crowd = crowd; c.contacts = contacts;
      });
      if (P.A2) civs.forEach(function (c) {
        c.cap *= Math.exp(P.g * (1 - c.crowd / P.K) + P.gB * P.B * c.contacts - (c.b ? 0 : P.gC));
        if (R() < P.j) c.cap *= P.F;
        c.cap = Math.max(0.1, c.cap);
      });
      // B3: finding, once light has had time to arrive.
      for (i = 0; i < civs.length; i++) {
        var a = civs[i];
        for (j = 0; j < civs.length; j++) {
          var b = civs[j];
          if (j === i || !b.alive || !a.alive || a.known[b.id]) continue;
          var d = dist(a, b);
          if (d > P.L || t - b.born < d / P.c) continue;
          if (R() < lam(b.cap, b.b)) learn(a, b, false, false);
        }
      }
      // Strikes land.
      var keep = [];
      f.strikes.forEach(function (s) {
        if (t < s.arrive) { keep.push(s); return; }
        var a = byId[s.from], b = byId[s.to];
        if (!b || !b.alive) return;
        var hit = R() < q(a, b);
        if (hit) { kill(b, 'strike'); f.flashes.push({ x: b.x, y: b.y, t: t }); }
        civs.forEach(function (o) {
          if (o === a || o === b || !o.alive) return;
          var d = dist(o, b);
          if (d <= P.L) events.push({ t: t + d / P.c, o: o.id, b: b.id, a: a.id, hit: hit, exposed: R() < P.e });
        });
        if (!hit && a.alive && b.alive) learn(b, a, true, true);
      });
      f.strikes = keep;
      // What observers see, after the light delay.
      var later = [];
      events.forEach(function (ev) {
        if (ev.t > t) { later.push(ev); return; }
        var o = byId[ev.o], a = byId[ev.a], b = byId[ev.b];
        if (!o || !o.alive) return;
        if (ev.hit && o.known[ev.b]) o.known[ev.b].killed = true;
        if (ev.exposed && a && a.alive) learn(o, a, true, false);
      });
      events = later;
      // Beliefs: resolve what became of those found H steps ago.
      civs.forEach(function (c) {
        if (!c.alive) return;
        Object.keys(c.known).forEach(function (id) {
          var k = c.known[id];
          if (k.done) return;
          if (!P.learn || k.struck) { k.done = true; }
          else if (k.killed) { c.trials++; c.succ++; k.done = true; }
          else if (t - k.t >= P.H) { c.trials++; k.done = true; }
        });
        decideLoud(c);
      });
      // Reconsider, as beliefs and capabilities change.
      if (t % P.every === 0) civs.forEach(function (a) {
        if (!a.alive || a.hostile) return;
        Object.keys(a.known).forEach(function (id) {
          var b = byId[id], k = a.known[id];
          if (b && b.alive && !k.struck && decideStrike(a, b, k)) launch(a, b, !k.foundMe && !k.striker);
        });
      });
      f.civs = f.civs.filter(function (c) { return c.alive || t - c.deadAt < 30; });
      Object.keys(byId).forEach(function (id) { if (!byId[id].alive && t - byId[id].deadAt > P.H + 50) delete byId[id]; });
      f.flashes = f.flashes.filter(function (x) { return t - x.t < 24; });
      if (t % 20 === 0) {
        f.bins.push([f.finds, f.pre]); f.finds = 0; f.pre = 0;
        if (f.bins.length > 10) f.bins.shift();
        f.sbins.push([f.born - f.last[0], f.grown - f.last[1]]); f.last = [f.born, f.grown];
        if (f.sbins.length > 50) f.sbins.shift();
        f.hist.push(f.shares());
      }
    };
    f.shares = function () {
      var alive = f.civs.filter(function (c) { return c.alive; });
      var fd = 0, pr = 0, nb = 0, ng = 0;
      f.bins.forEach(function (x) { fd += x[0]; pr += x[1]; });
      f.sbins.forEach(function (x) { nb += x[0]; ng += x[1]; });
      var nh = alive.filter(function (c) { return !c.hostile; });
      var est = alive.filter(function (c) { return f.t - c.born >= P.mature; });
      return {
        loud: est.length ? est.filter(function (c) { return c.b; }).length / est.length : 0,
        young: alive.length ? 1 - est.length / alive.length : 0,
        estN: est.length,
        survive: nb ? Math.min(1, ng / nb) : 0,
        strike: fd ? Math.min(1, pr / fd) : 0,
        pop: alive.length / P.cap,
        n: alive.length,
        belief: nh.length ? nh.reduce(function (s, c) { return s + sig(c); }, 0) / nh.length : 0
      };
    };
    f.hist.push(f.shares());
    return f;
  }

  F.register('fig-forest.png', function (f) {
    var T = f.T, width = 0, live = false, seed = 1, runLen = 3000, perFrame = 4, mode = 0, stage = 0;
    var MODES = [
      { name: T('selection', '选择'), base: BASE, model: forest,
        presets: [
          { name: T('dark forest', '黑暗森林'), set: { p: 0.1, q: 0.7, e: 0.2, B: 0.3 }, text: T('Hostile civilizations exist: broadcasting dies out, and so does striking.', '存在敌对文明：广播消失了，打击也消失了。') },
          { name: T('hunting ground', '猎场'), set: { p: 0.3, q: 0.95, e: 0, B: 0.3 }, text: T('Many hostiles, strikes that almost always succeed and that no one else sees: striking survives, and in some runs spreads to most civilizations.', '敌对文明众多，打击几乎必定成功，而且别人看不见：打击存活下来，在有些运行中还会扩散到多数文明。') },
          { name: T('strikes fail', '打击失败'), set: { p: 0.1, q: 0.15, e: 0.8, B: 0.3 }, text: T('Strikes usually fail and expose the attacker: nobody strikes, but the hostile few still keep most civilizations quiet.', '打击通常失败，还会暴露攻击者：没有谁去打击，但少数敌对文明仍让大多数文明保持安静。') },
          { name: T('lit forest', '明亮的森林'), set: { p: 0, q: 0.15, e: 0.2, B: 1.5 }, text: T('No hostiles, and contact pays: most civilizations keep broadcasting.', '没有敌对文明，接触又有好处：大多数文明一直在广播。') }
        ],
        sliders: [
          { key: 'p', label: T('hostile p', '敌对 p'), max: 0.5, step: 0.05, digits: 2 },
          { key: 'q', label: T('success q', '成功率 q'), max: 1, step: 0.05, digits: 2 },
          { key: 'e', label: T('exposure e', '暴露 e'), max: 1, step: 0.05, digits: 2 },
          { key: 'B', label: T('contact B', '接触 B'), max: 2, step: 0.05, digits: 2 }
        ] },
      { name: T('reasoning', '推理'), base: BASE2, model: reason,
        presets: [
          { name: T('growing forest', '生长的森林'), set: { p: 0.1, j: 0.001, e: 0.2, KM: 0.0005, A2: 1 }, text: T('Civilizations grow, and one that finds a much smaller one usually strikes it: established civilizations hide, and most newcomers die young.', '文明会生长；一个文明发现比自己小得多的文明时，通常会打击它：已成形的文明都在隐藏，大多数新文明早早死去。') },
          { name: T('no hostiles', '没有敌对文明'), set: { p: 0, j: 0.001, e: 0.2, KM: 0.0005, A2: 1 }, text: T('No hostile civilizations, yet the strong still strike the weak they find, because it costs them almost nothing.', '没有敌对文明，强者仍会打击它们发现的弱者，因为这对它们几乎没有代价。') },
          { name: T('costly strikes', '昂贵的打击'), set: { p: 0.1, j: 0.001, e: 0.2, KM: 0.05, A2: 1 }, text: T('A strike costs a twentieth of extinction: first strikes stop, and far more newcomers survive to grow.', '一次打击的代价是灭绝的二十分之一：先发打击停止了，存活下来、得以生长的新文明也多得多。') },
          { name: T('no growth', '不再生长'), set: { p: 0.1, j: 0.001, e: 0.2, KM: 0.0005, A2: 0 }, text: T('Capabilities stay equal: civilizations learn to hide, nobody strikes first, and most newcomers survive.', '能力保持相等：文明学会了隐藏，没有谁先发打击，大多数新文明都活了下来。') }
        ],
        sliders: [
          { key: 'p', label: T('hostile p', '敌对 p'), max: 0.5, step: 0.05, digits: 2 },
          { key: 'j', label: T('explosion j', '爆炸 j'), max: 0.005, step: 0.0005, digits: 4 },
          { key: 'e', label: T('exposure e', '暴露 e'), max: 1, step: 0.05, digits: 2 },
          { key: 'KM', label: T('strike cost K/M', '打击成本 K/M'), max: 0.1, step: 0.0005, digits: 4 }
        ] }
    ];
    // The tour visits every preset of both modes in turn.
    var TOUR = [];
    MODES.forEach(function (m, i) { m.presets.forEach(function (pr, k) { TOUR.push([i, k]); }); });
    var P, sim;
    function params(m, set) {
      var P = Object.assign({}, m.base, set);
      if (set.KM !== undefined) P.Kst = set.KM * P.M;
      return P;
    }
    var root = svg('svg', { role: 'img', 'aria-label': T('A simulated dark forest', '一片模拟的黑暗森林') }, f.stage);
    var text = note(f.stage);
    var play = F.player(f.controls, T, function (on) { live = false; if (on) { load(0, 0); anim.start(true); } });
    var mbtn = MODES.map(function (m, i) {
      return F.button(f.controls, m.name, function () { play.set(false); live = true; load(i, 0); anim.start(true); });
    });
    MODES.forEach(function (m, i) {
      m.pbtn = m.presets.map(function (pr, k) {
        return F.button(f.controls, pr.name, function () { play.set(false); live = true; load(i, k); anim.start(true); });
      });
      m.sl = m.sliders.map(function (d) {
        return F.slider(f.controls, { label: d.label, min: 0, max: d.max, step: d.step, value: 0,
          format: function (v) { return v.toFixed(d.digits); },
          onInput: function (v) {
            play.set(false); live = true; P[d.key] = v;
            if (d.key === 'KM') P.Kst = v * P.M;
            m.pbtn.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
            anim.start(true);
          } });
      });
    });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);

    function load(i, k) {
      var m = MODES[i], pr = m.presets[k];
      mode = i;
      TOUR.forEach(function (x, n) { if (x[0] === i && x[1] === k) stage = n; });
      P = params(m, pr.set);
      m.sliders.forEach(function (d, n) { m.sl[n].set(pr.set[d.key]); });
      seed++;
      sim = m.model(P, seed);
      mbtn.forEach(function (b, n) { b.setAttribute('aria-pressed', n === i ? 'true' : 'false'); });
      MODES.forEach(function (mm, n) {
        var show = n === i ? '' : 'none';
        mm.pbtn.forEach(function (b, kk) { b.style.display = show; b.setAttribute('aria-pressed', n === i && kk === k ? 'true' : 'false'); });
        mm.sl.forEach(function (s) { s.parentNode.style.display = show; });
      });
      text.textContent = pr.text;
    }
    load(0, 0);

    var anim = F.loop(f.root, function () {
      if (!play.playing() && !live) return false;
      for (var i = 0; i < perFrame; i++) sim.step();
      if (play.playing() && sim.t >= runLen) { var nx = TOUR[(stage + 1) % TOUR.length]; load(nx[0], nx[1]); }
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 600, gap = 28, reasoning = mode === 1;
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
      if (reasoning) sim.civs.forEach(function (c) {
        if (!c.alive) return;
        svg('circle', { cx: c.x * side, cy: c.y * side, r: Math.max(2, P.tau0 * Math.sqrt(c.cap) * side), fill: c.b ? 'var(--navy)' : 'var(--text-muted)', 'fill-opacity': 0.12 }, g);
      });
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
        if (c.b && !reasoning) svg('circle', { cx: x, cy: y, r: 7, fill: 'var(--navy)', 'fill-opacity': 0.12 }, g);
        svg('circle', { cx: x, cy: y, r: 3.2, fill: loud ? 'var(--navy)' : 'var(--text-muted)', 'fill-opacity': loud ? 1 : 0.7 }, g);
        if (c.hostile || c.s || c.pre) svg('circle', { cx: x, cy: y, r: 5.4, fill: 'none', stroke: 'var(--text)', 'stroke-width': 1 }, g);
      });

      // The chart.
      var cx0 = wide ? side + gap : 0, cy0 = wide ? 0 : side + 20;
      var L = 34, Rm = 8, Tp = reasoning ? 40 : 22, Bm = 26, pw = cw - L - Rm, ph = ch - Tp - Bm;
      var X = function (k) { return cx0 + L + pw * k / (runLen / 20); }, Y = function (v) { return cy0 + Tp + ph * (1 - v); };
      svg('line', { x1: cx0 + L, y1: Y(0), x2: cx0 + L + pw, y2: Y(0), stroke: 'var(--border-strong)' }, root);
      svg('line', { x1: cx0 + L, y1: Y(0), x2: cx0 + L, y2: Y(1), stroke: 'var(--border-strong)' }, root);
      [0, 0.5, 1].forEach(function (v) { svg('text', { x: cx0 + L - 6, y: Y(v) + 4, 'text-anchor': 'end', text: Math.round(v * 100) + '%' }, root); });
      svg('text', { x: cx0 + L + pw, y: Y(0) + 18, 'text-anchor': 'end', text: T('steps', '步数') + ' → ' + runLen }, root);
      var hist = sim.hist.slice(-runLen / 20);
      function line(keyName, stroke, sw, dash) {
        // Established broadcasting is left out until a few civilizations are established.
        var d = '', gapped = true;
        hist.forEach(function (h, k) {
          if (reasoning && keyName === 'loud' && h.estN < 3) { gapped = true; return; }
          d += (gapped ? 'M' : 'L') + X(k).toFixed(1) + ',' + Y(h[keyName]).toFixed(1); gapped = false;
        });
        var at = { d: d, fill: 'none', stroke: stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' };
        if (dash) at['stroke-dasharray'] = dash;
        if (d) svg('path', at, root);
      }
      var series = reasoning
        ? [['loud', 'var(--navy)', 2.2, '', T('established broadcasting', '已成形文明中的广播')],
           ['strike', 'var(--text)', 1.6, '', T('strikes per finding', '每次发现后的打击')],
           ['survive', 'var(--text-muted)', 1.6, '4 3', T('newcomers surviving', '新文明存活')]]
        : [['loud', 'var(--navy)', 2.2, '', T('broadcasting', '广播')],
           ['strike', 'var(--text)', 1.6, '', T('striking (non-hostile)', '打击（非敌对）')]];
      series.forEach(function (sr) { line(sr[0], sr[1], sr[2], sr[3]); });
      // The legend, wrapping to a second row when it does not fit.
      var lx = cx0 + L, ly = cy0 + 8;
      series.forEach(function (sr) {
        var probe = svg('text', { x: 0, y: -100, text: sr[4] }, root), w = 22 + probe.getComputedTextLength() + 16;
        root.removeChild(probe);
        if (lx + w > cx0 + cw && lx > cx0 + L) { lx = cx0 + L; ly += 16; }
        var at = { x1: lx, y1: ly, x2: lx + 16, y2: ly, stroke: sr[1], 'stroke-width': sr[2] };
        if (sr[3]) at['stroke-dasharray'] = sr[3];
        svg('line', at, root);
        var tx = svg('text', { x: lx + 22, y: ly + 4, text: sr[4] }, root);
        if (sr[1] === 'var(--navy)') styled(tx, 'fill: var(--navy)');
        lx += w;
      });
      styled(svg('text', { x: 0, y: H - 6, text: T('illustrative, not data', '示意，并非数据') }, root), 'font-style: italic; fill: var(--text-muted)');
      var sh = sim.shares(), pc = function (v) { return Math.round(v * 100) + '%'; };
      readout.textContent = reasoning
        ? T('step ', '第 ') + t + T('', ' 步') + ' · ' + T('civilizations ', '文明 ') + sh.n + ' · ' + T('established broadcasting ', '已成形文明广播 ') + pc(sh.loud) + ' · ' + T('strikes per finding ', '每次发现后的打击 ') + pc(sh.strike) + ' · ' + T('newcomers surviving ', '新文明存活 ') + pc(sh.survive)
        : T('step ', '第 ') + t + T('', ' 步') + ' · ' + T('broadcasting ', '广播 ') + pc(sh.loud) + ' · ' + T('striking ', '打击 ') + pc(sh.strike);
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });
})();
