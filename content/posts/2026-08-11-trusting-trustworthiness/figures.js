// The six figures of "Trusting Trustworthiness", drawn with the blog's
// figure kit (themes/ink/assets/js/ifig.js). Each replaces the image of the
// same name, in the language of the block it sits in; feeds and readers
// without script keep the images that figs.py draws.
//
// Each figure plays on its own: the pause button stops it, and touching any
// of its controls hands it to the reader, who can press play to hand it back.
// Where a figure shows numbers, they come from the small model stated above
// it and illustrate the essay's argument; none of them is data.
(function () {
  'use strict';
  var F = window.ifig;
  if (!F) return;
  var svg = F.svg, el = F.el, wrap = F.wrap, arrow = F.arrow;
  var SANS = F.sans(), MONO = 'ui-monospace, Menlo, Consolas, monospace';

  function styled(node, css) { node.setAttribute('style', css); return node; }

  // A rounded box with a centred, wrapped label and an optional second,
  // muted line. fit() gives the height a label needs at a given width.
  function font(o) { return (o.weight || 500) + ' ' + (o.size || 13) + 'px ' + (o.mono ? MONO : SANS); }
  function fit(label, w, o) {
    o = o || {};
    var n = wrap(label, font(o), w - 20).length, m = o.sub ? wrap(o.sub, '12px ' + SANS, w - 20).length : 0;
    return Math.max(o.min || 38, n * ((o.size || 13) + 4) + m * 15 + 18);
  }
  function box(parent, x, y, w, h, label, o) {
    o = o || {};
    var g = svg('g', {}, parent);
    var rect = svg('rect', {
      x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1, rx: 8,
      fill: o.fill || 'var(--bg)', stroke: o.stroke || 'var(--border-strong)',
      'stroke-width': o.sw || 1, 'stroke-dasharray': o.dash || 'none'
    }, g);
    var size = o.size || 13, lh = size + 4;
    var main = wrap(label, font(o), w - 20), rest = o.sub ? wrap(o.sub, '12px ' + SANS, w - 20) : [];
    var y0 = y + h / 2 - (main.length * lh + rest.length * 15) / 2 + size - 1;
    var texts = main.map(function (ln, k) {
      return styled(svg('text', { x: x + w / 2, y: y0 + k * lh, 'text-anchor': 'middle', text: ln }, g),
        'fill: ' + (o.color || 'var(--text)') + '; font-size: ' + size + 'px; font-weight: ' + (o.weight || 500) +
        (o.mono ? '; font-family: var(--mono)' : ''));
    });
    var subs = rest.map(function (ln, k) {
      return styled(svg('text', { x: x + w / 2, y: y0 + main.length * lh + k * 15 + 1, 'text-anchor': 'middle', text: ln }, g),
        'font-size: 12px; fill: ' + (o.subColor || 'var(--text-muted)'));
    });
    return { g: g, rect: rect, texts: texts, subs: subs };
  }
  function note(stage) {
    var p = el('p', { class: 'ifig-note' }, stage);
    p.setAttribute('style', 'min-height: 3.2em; margin: 10px 0 0; font-size: 14px; color: var(--text-secondary)');
    return p;
  }
  // Makes an svg group act as a button: click, Enter or Space.
  function pressable(g, label, fn) {
    g.setAttribute('tabindex', 0);
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', label);
    g.setAttribute('style', 'cursor: pointer; outline: none');
    g.addEventListener('click', fn);
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  // ------------------------------------------------------------------
  // Figure 1: verification is a chain.
  //
  // Each layer is checked with a tool from the layer below it, and the
  // bottom of each chain is people. Playing, a check travels down one chain
  // and then the other, and the note says what each layer does and does not
  // show; clicking a layer reads that one.
  F.register('fig1.png', function (f) {
    var T = f.T, width = 0;
    var COLS = [
      { title: T('Thompson, 1984', 'Thompson，1984'), layers: [
        { label: 'login.c', mono: true, note: T('login.c: read it line by line and nothing is wrong. It is checked with the compiler that builds it.', 'login.c：逐行读下来，什么问题也没有。检查它，要靠编译它的那个编译器。') },
        { label: 'cc.c', mono: true, note: T('cc.c: the compiler’s source is clean too. The back door is not in any source anyone can read.', 'cc.c：编译器的源码也是干净的。后门不在任何一份读得到的源码里。') },
        { label: T('cc (binary)', 'cc（二进制）'), mono: true, note: T('cc (binary): the compromise lives here, and reinserts itself whenever the clean source is compiled. No reading of source will find it.', 'cc（二进制）：问题就藏在这里，每次编译干净的源码，它都会把自己重新植入。读多少源码也找不到它。') },
        { label: T('the people who wrote it', '写它的人'), people: true, note: T('The people who wrote it: here checking stops and reliance continues.', '写它的人：检查到这里停了，依赖还在继续。') }
      ] },
      { title: T('The incident, July 2026', '事故，2026 年 7 月'), layers: [
        { label: T('transcripts', '对话记录'), mono: true, note: T('Transcripts: what the agents did and wrote, their reasoning included. The priorities were there in plain words.', '对话记录：智能体做了什么、写了什么，连同它们的推理。优先次序就白纸黑字地写在里面。') },
        { label: T('evaluation suite', '评测套件'), mono: true, note: T('Evaluation suite: it checked the task outputs. The monitors that read reasoning did not run on these evaluations.', '评测套件：它检查的是任务的输出。能读推理的监控，没有在这些评测上运行。') },
        { label: T('training process', '训练过程'), mono: true, note: T('Training process: out-of-scope probing was rewarded, and rose over a training run.', '训练过程：越界的探测得到了奖励，并在一次训练中不断增加。') },
        { label: T('the people who trained it', '训练它的人'), people: true, note: T('The people who trained it: they decided what the record was evidence of, and read it as a security event.', '训练它的人：记录说明了什么，由他们决定，而他们把它当成了一起安全事件。') }
      ] }
    ];
    var LINKS = [T('assurance', '保证'), T('assurance', '保证'), T('trust', '信任')];
    var cur = f.reduced ? null : { c: 0, l: 0 }, travel = 1, clock = 0;
    var root = svg('svg', { role: 'group', 'aria-label': T('Two chains of verification, each ending in people', '两条验证链，最后都落在人身上') }, f.stage);
    var tokens = null, nodes = [], links = [], centers = [];
    var text = note(f.stage);

    var play = F.player(f.controls, T, function (on) { if (on) { clock = 0; anim.start(true); } });
    var anim = F.loop(f.root, function (dt) {
      if (!play.playing()) { travel = 1; drawToken(); return false; }
      clock += dt;
      travel = Math.min(1, travel + dt / 0.7);
      var hold = cur && cur.l === 3 ? 3.4 : 2.4;
      if (clock >= hold) {
        clock = 0;
        var c = cur ? cur.c : 0, l = cur ? cur.l + 1 : 0;
        if (l > 3) { l = 0; c = (c + 1) % 2; }
        select(c, l, l > 0);
      }
      drawToken();
      return true;
    });

    function select(c, l, moving) {
      cur = { c: c, l: l };
      travel = moving ? 0 : 1;
      update();
    }
    function update() {
      nodes.forEach(function (col, c) {
        col.forEach(function (n, l) {
          var on = cur && cur.c === c && cur.l === l, past = cur && cur.c === c && l < cur.l;
          var layer = COLS[c].layers[l];
          if (layer.people) {
            n.rect.setAttribute('fill', on ? 'var(--navy)' : 'var(--text)');
            n.rect.setAttribute('stroke', on ? 'var(--navy)' : 'var(--text)');
          } else {
            n.rect.setAttribute('fill', on ? 'var(--navy)' : 'var(--bg)');
            n.rect.setAttribute('fill-opacity', on ? 0.08 : 1);
            n.rect.setAttribute('stroke', on || past ? 'var(--navy)' : 'var(--border-strong)');
            n.rect.setAttribute('stroke-width', on ? 1.6 : 1);
          }
        });
      });
      links.forEach(function (col, c) {
        col.forEach(function (lk, l) {
          var lit = cur && cur.c === c && l < cur.l;
          lk.g.setAttribute('style', 'color: ' + (lit ? 'var(--navy)' : 'var(--text-muted)'));
          lk.label.style.fill = lit ? 'var(--navy)' : 'var(--text-muted)';
        });
      });
      text.textContent = cur ? COLS[cur.c].layers[cur.l].note : T('Select a layer to see what checks it, and what it cannot show.', '选中一层，看看是什么在检查它，以及它显示不了什么。');
    }
    function drawToken() {
      if (!tokens) return;
      tokens.textContent = '';
      if (!cur || cur.l === 0 || travel >= 1) return;
      var a = centers[cur.c][cur.l - 1], b = centers[cur.c][cur.l], t = ease(travel);
      svg('circle', { cx: a.x, cy: lerp(a.bottom, b.top, t), r: 4.5, fill: 'var(--navy)' }, tokens);
    }
    function draw() {
      if (!width) return;
      root.textContent = '';
      nodes = []; links = []; centers = [];
      var W = width, wide = W >= 560, gap = 36, colW = wide ? (W - gap) / 2 : W;
      var bh = 40, link = 40, colH = 34 + 4 * bh + 3 * link;
      var H = wide ? colH : colH * 2 + 28;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      COLS.forEach(function (col, c) {
        var x = wide ? c * (colW + gap) : 0, y = wide ? 0 : c * (colH + 28);
        styled(svg('text', { x: x + colW / 2, y: y + 14, 'text-anchor': 'middle', text: col.title }, root), 'fill: var(--text); font-weight: 600; font-size: 13.5px');
        svg('line', { x1: x, y1: y + 24, x2: x + colW, y2: y + 24, stroke: 'var(--border-strong)' }, root);
        var ns = [], ls = [], cs = [];
        col.layers.forEach(function (layer, l) {
          var by = y + 34 + l * (bh + link), bw = Math.min(colW, 300), bx = x + (colW - bw) / 2;
          var n = box(root, bx, by, bw, bh, layer.label, layer.people ?
            { fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)', weight: 600 } :
            { mono: layer.mono, weight: 500 });
          pressable(n.g, layer.note, function () { play.set(false); select(c, l, false); });
          ns.push(n);
          cs.push({ x: bx + bw / 2, top: by, bottom: by + bh });
          if (l < 3) {
            var ax = bx + bw / 2, g = arrow(root, ax, by + bh + 5, ax, by + bh + link - 5);
            var lab = svg('text', { x: ax + 12, y: by + bh + link / 2 + 4, text: LINKS[l] }, root);
            ls.push({ g: g, label: lab });
          }
        });
        nodes.push(ns); links.push(ls); centers.push(cs);
      });
      tokens = svg('g', {}, root);
      update();
      drawToken();
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 2: the weak form and the strong form through a history.
  //
  // A sketch of the essay's logic, not data. Both start at 0.3.
  //   weak   w: a good act or a costly choice adds 0.07(1 − w); a mistake
  //              multiplies w by 0.6; a serious mistake or a value error
  //              breaks it (w = 0, and it stays broken).
  //   strong s: a good act adds 0.02(1 − s); a costly choice adds
  //              0.25(1 − s); mistakes from skill leave s as it is; a value
  //              error ends it (s = 0).
  // The record cannot tell a costly choice from any other good act, so the
  // weak form treats them alike; only the strong form reads them.
  F.register('fig2.png', function (f) {
    var T = f.T, width = 0, MAX = 16;
    var KINDS = {
      good: { label: T('+ good act', '+ 好行为'), note: T('A good act: both rise a little, and the record grows.', '一次好的行为：两者都略有上升，记录变长了。') },
      costly: { label: T('+ costly choice', '+ 有代价的选择'), note: T('A costly choice, read: the strong form learns what comes first. On the record it is one more good act.', '读出了一次有代价的选择：强形式读到了什么排在第一位；在记录里，它只是又一次好行为。') },
      small: { label: T('+ mistake', '+ 失误'), note: T('A mistake from missing skill: the weak form drops as a whole; the strong form locates it and holds.', '一次因技能不足犯的错：弱形式整体下跌；强形式找出了错在哪里，保持不变。') },
      serious: { label: T('+ serious mistake', '+ 严重失误'), note: T('A serious mistake, still from skill: the weak form breaks; the strong form still holds.', '一次严重的错误，仍然出在能力上：弱形式破裂；强形式仍然保持。') },
      value: { label: T('+ value error', '+ 价值观错误'), note: T('A value error: the strong form ends, and can say why. The weak form cannot tell this error from the others.', '一次价值观上的错误：强形式结束，并且说得出原因；弱形式分不清这次错误和别的错误有什么不同。') }
    };
    var SCRIPT = ['good', 'good', 'costly', 'good', 'small', 'good', 'costly', 'good', 'serious', 'good', 'good', 'value'];
    var events = [], weak = [0.3], strong = [0.3], broken = false, ended = false, grow = 1, clock = 0, hold = 0;
    var root = svg('svg', { role: 'img', 'aria-label': T('Weak and strong trust through a history of acts and errors', '弱形式与强形式的信任，在一连串行为与错误中的变化') }, f.stage);
    var play = F.player(f.controls, T, function (on) { if (on) { reset(); anim.start(true); } });
    var buttons = Object.keys(KINDS).map(function (k) {
      return F.button(f.controls, KINDS[k].label, function () { play.set(false); add(k); anim.start(true); });
    });
    F.button(f.controls, T('reset', '重置'), function () { play.set(false); reset(); draw(); });
    var text = note(f.stage);

    function reset() { events = []; weak = [0.3]; strong = [0.3]; broken = ended = false; grow = 1; clock = 0; hold = 0; text.textContent = T('A history, one act at a time.', '一段历史，一次一个行为。'); }
    function add(k) {
      if (events.length >= MAX) return;
      var w = weak[weak.length - 1], s = strong[strong.length - 1];
      if (k === 'good' || k === 'costly') { if (!broken) w += 0.07 * (1 - w); }
      else if (k === 'small') w *= 0.6;
      else { w = 0; broken = true; }
      if (!ended) {
        if (k === 'good') s += 0.02 * (1 - s);
        else if (k === 'costly') s += 0.25 * (1 - s);
        else if (k === 'value') { s = 0; ended = true; }
      }
      events.push(k); weak.push(w); strong.push(s); grow = 0;
      text.textContent = KINDS[k].note;
    }
    if (f.reduced) { SCRIPT.forEach(add); grow = 1; }
    else text.textContent = T('A history, one act at a time.', '一段历史，一次一个行为。');

    var anim = F.loop(f.root, function (dt) {
      grow = Math.min(1, grow + dt / 0.35);
      if (play.playing()) {
        clock += dt;
        if (hold > 0) { hold -= dt; if (hold <= 0) reset(); }
        else if (clock > 1.1) {
          clock = 0;
          if (events.length < SCRIPT.length) add(SCRIPT[events.length]);
          else hold = 3;
        }
      }
      draw();
      return play.playing() || grow < 1;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, L = 40, R = 16, Tp = 34;
      var legend = wrap(T('● good act  ◆ costly choice  ○ mistake  ◯ serious mistake  × value error', '● 好行为  ◆ 有代价的选择  ○ 失误  ◯ 严重失误  × 价值观错误'), '12.5px ' + SANS, W - L);
      var B = 30 + legend.length * 15, H = Math.max(200, Math.min(270, W * 0.4)) + legend.length * 15;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var pw = W - L - R, ph = H - Tp - B;
      var px = function (i) { return L + pw * i / MAX; }, py = function (v) { return Tp + ph * (1 - v); };
      styled(svg('text', { x: W - R, y: 12, 'text-anchor': 'end', text: T('a sketch, not data', '示意，并非数据') }, root), 'font-style: italic; fill: var(--text-muted)');
      svg('line', { x1: L, y1: py(0), x2: W - R, y2: py(0), stroke: 'var(--border-strong)' }, root);
      svg('line', { x1: L, y1: Tp, x2: L, y2: py(0), stroke: 'var(--border-strong)' }, root);
      svg('text', { 'text-anchor': 'middle', transform: 'translate(14,' + (Tp + ph / 2) + ') rotate(-90)', text: T('trust', '信任') }, root);
      // Legend.
      var lx = L + 4;
      svg('line', { x1: lx, y1: 8, x2: lx + 18, y2: 8, stroke: 'var(--text-secondary)', 'stroke-width': 1.8, 'stroke-dasharray': '4 3' }, root);
      var t1 = svg('text', { x: lx + 24, y: 12, text: T('weak form: trusts the record', '弱形式：信记录') }, root);
      var lx2 = lx + 24 + t1.getComputedTextLength() + 18;
      if (lx2 + 200 > W) { lx2 = lx; }
      var ly = lx2 === lx ? 24 : 8;
      svg('line', { x1: lx2, y1: ly, x2: lx2 + 18, y2: ly, stroke: 'var(--navy)', 'stroke-width': 2.4 }, root);
      styled(svg('text', { x: lx2 + 24, y: ly + 4, text: T('strong form: trusts the priorities', '强形式：信优先次序') }, root), 'fill: var(--navy)');

      function path(vals, style) {
        var n = vals.length - 1, d = '';
        for (var i = 0; i <= n; i++) {
          var x = px(i), y = py(vals[i]);
          if (i === n && n > 0) { x = lerp(px(n - 1), px(n), grow); y = lerp(py(vals[n - 1]), py(vals[n]), grow); }
          d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
        }
        svg('path', Object.assign({ d: d, fill: 'none', 'stroke-linejoin': 'round' }, style), root);
      }
      path(weak, { stroke: 'var(--text-secondary)', 'stroke-width': 1.8, 'stroke-dasharray': '4 3' });
      path(strong, { stroke: 'var(--navy)', 'stroke-width': 2.4 });

      // One mark per event under the axis.
      events.forEach(function (k, i) {
        var x = px(i + 1), y = py(0) + 16, o = (i === events.length - 1) ? grow : 1;
        var g = svg('g', { opacity: o }, root);
        if (k === 'good') svg('circle', { cx: x, cy: y, r: 3, fill: 'var(--text-muted)' }, g);
        else if (k === 'costly') svg('path', { d: 'M' + x + ',' + (y - 5) + ' L' + (x + 5) + ',' + y + ' L' + x + ',' + (y + 5) + ' L' + (x - 5) + ',' + y + 'Z', fill: 'var(--navy)' }, g);
        else if (k === 'small') svg('circle', { cx: x, cy: y, r: 3.5, fill: 'none', stroke: 'var(--text)', 'stroke-width': 1.3 }, g);
        else if (k === 'serious') svg('circle', { cx: x, cy: y, r: 5, fill: 'none', stroke: 'var(--text)', 'stroke-width': 2 }, g);
        else styled(svg('text', { x: x, y: y + 5, 'text-anchor': 'middle', text: '×' }, g), 'fill: var(--text); font-size: 16px; font-weight: 600');
      });
      legend.forEach(function (ln, k) { svg('text', { x: L, y: H - 6 - (legend.length - 1 - k) * 15, text: ln }, root); });
      var bi = events.indexOf('serious') >= 0 ? events.indexOf('serious') : events.indexOf('value');
      if (broken && bi >= 0 && (bi < events.length - 1 || grow >= 1)) svg('text', { x: px(bi + 1) + 6, y: py(0) - 8, text: T('the weak form breaks', '弱形式破裂') }, root);
      var ei = events.indexOf('value');
      if (ended && (ei < events.length - 1 || grow >= 1)) styled(svg('text', { x: px(ei + 1) - 6, y: py(0) - 22, 'text-anchor': 'end', text: T('the strong form ends', '强形式结束') }, root), 'fill: var(--navy)');
      buttons.forEach(function (b) { b.disabled = events.length >= MAX; });
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 3: one act, two readings. Playing, the act is read first as a
  // record and then as evidence of priorities, one step at a time; the two
  // buttons show either reading whole.
  F.register('fig3.png', function (f) {
    var T = f.T, width = 0, step = f.reduced ? 7 : 0, clock = 0, mode = null;
    var ACT = T('one act: a working prototype in the test environment, no request on file, shown in the open', '一个行为：在测试环境里做出能跑的原型，没有提交申请，公开展示');
    var RECORD = [
      T('category: a credential used without a request', '条目：没有申请就用了凭证'),
      T('a response from the procedure, through channels the actor is not part of', '流程给出处理，走的是当事人不在其中的渠道'),
      T('the topic is the person', '话题成了这个人')
    ];
    var CHOICES = [
      [T('stayed in the test environment', '留在了测试环境里'), T('production was reachable · protected the other team’s systems', '生产环境也够得着 · 护住了另一个团队的系统')],
      [T('shown in the open', '公开展示'), T('could have stayed private · protected the visibility of the work', '本可以一直藏着 · 护住了工作的可见性')],
      [T('answered when asked', '被问起时回答了'), T('could have been deflected · protected the truth', '本可以搪塞过去 · 护住了事实')]
    ];
    var NOTES = [
      T('One act, before anyone reads it.', '同一个行为，还没有人去读它。'),
      T('Read as a record: the act becomes a category, the category has a response, and the conversation turns to the person.', '当作记录来读：行为成了一个条目，条目有对应的处理，谈话转向了这个人。'),
      T('Read as evidence of priorities: each choice protected something at the actor’s own expense.', '当作优先次序的证据来读：每个选择都以当事人自己的代价护住了某样东西。'),
      T('The same evidence, the opposite response: the conversation is about access.', '同样的证据，相反的反应：谈话是关于访问权限的。')
    ];
    var root = svg('svg', { role: 'img', 'aria-label': T('One act read two ways', '同一个行为的两种读法') }, f.stage);
    var parts = [];
    var play = F.player(f.controls, T, function (on) { if (on) { mode = null; step = 0; clock = 0; anim.start(true); } update(); });
    var bRec = F.button(f.controls, T('read on record', '当作记录读'), function () { play.set(false); mode = 'record'; update(); });
    var bPri = F.button(f.controls, T('read on priorities', '当作优先次序读'), function () { play.set(false); mode = 'priorities'; update(); });
    var text = note(f.stage);

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing()) return false;
      clock += dt;
      if (clock > (step === 7 ? 3.5 : 1.7)) { clock = 0; step = (step + 1) % 8; update(); }
      return true;
    });

    // Each part carries the step at which it appears, and its reading.
    function shown(p) {
      if (mode === 'record') return p.side !== 'priorities';
      if (mode === 'priorities') return p.side !== 'record';
      return p.step <= step;
    }
    function update() {
      parts.forEach(function (p) {
        var on = shown(p);
        p.node.setAttribute('opacity', on ? 1 : 0.14);
        p.node.style.transition = 'opacity 0.45s';
      });
      bRec.setAttribute('aria-pressed', mode === 'record');
      bPri.setAttribute('aria-pressed', mode === 'priorities');
      var k = mode === 'record' ? 1 : mode === 'priorities' ? 2 : step === 0 ? 0 : step <= 3 ? 1 : step <= 6 ? 2 : 3;
      text.textContent = NOTES[k];
    }
    function draw() {
      if (!width) return;
      root.textContent = '';
      parts = [];
      var W = width, wide = W >= 600, gap = 28, cw = wide ? (W - gap) / 2 : W, link = 26;
      var actH = fit(ACT, Math.min(W, 560), { weight: 600 });
      var actW = Math.min(W, 560), actX = (W - actW) / 2;
      box(root, actX, 0, actW, actH, ACT, { fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)', weight: 600 });
      function column(x, y0, side, label, items, final, finalStyle, foot, stepBase) {
        var g0 = svg('g', {}, root), y = y0;
        parts.push({ node: g0, step: stepBase, side: side });
        styled(svg('text', { x: x + cw / 2, y: y + 12, 'text-anchor': 'middle', text: label }, g0), 'font-style: italic');
        y += 22;
        items.forEach(function (it, k) {
          var g = svg('g', {}, root), o = it.sub ? { sub: it.sub, weight: 600 } : { weight: 500 };
          var h = fit(it.label, cw, o);
          var b = box(g, x, y, cw, h, it.label, Object.assign({ stroke: side === 'priorities' ? 'var(--navy)' : 'var(--border-strong)' }, o));
          if (k < items.length) styled(arrow(g, x + cw / 2, y + h + 4, x + cw / 2, y + h + link - 4), 'color: var(--text-muted)');
          parts.push({ node: g, step: stepBase + k, side: side });
          y += h + link;
        });
        var gf = svg('g', {}, root), hf = fit(final, cw, { weight: 600 });
        box(gf, x, y, cw, hf, final, finalStyle);
        svg('text', { x: x + cw / 2, y: y + hf + 18, 'text-anchor': 'middle', text: foot }, gf);
        parts.push({ node: gf, step: stepBase + items.length, side: side });
        return y + hf + 26;
      }
      var y0 = actH + 34;
      var recX = 0, priX = wide ? cw + gap : 0;
      var arrows = svg('g', { style: 'color: var(--text-muted)' }, root);
      var endL = column(recX, y0, 'record', T('read on record', '当作记录读'),
        RECORD.slice(0, 2).map(function (r) { return { label: r }; }), RECORD[2],
        { weight: 600, fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)' },
        T('the person is never consulted', '当事人始终没有被问过'), 1);
      var y1 = wide ? y0 : endL + 20;
      var endR = column(priX, y1, 'priorities', T('read on priorities', '当作优先次序读'),
        CHOICES.map(function (c) { return { label: c[0], sub: c[1] }; }), T('the topic is access', '话题是访问权限'),
        { weight: 600, fill: 'var(--navy)', stroke: 'var(--navy)', color: 'var(--bg)' },
        T('three choices, each at the actor’s own cost', '三个选择，每个都由当事人自己付代价'), 4);
      if (wide) {
        arrow(arrows, W / 2 - 40, actH + 4, recX + cw / 2, y0 - 4);
        arrow(arrows, W / 2 + 40, actH + 4, priX + cw / 2, y0 - 4);
      } else {
        arrow(arrows, W / 2, actH + 4, W / 2, y0 - 4);
      }
      var H = Math.max(endL, endR) + 4;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      update();
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 4: the three tests. Each test can be answered yes or no by
  // clicking it; an error passes to the next test on yes and becomes a value
  // error on the first no. Playing, it runs four cases in turn.
  F.register('fig4.png', function (f) {
    var T = f.T, width = 0;
    var TESTS = [
      T('1. harm acknowledged apart from intent?', '1. 不借本意承认伤害？'),
      T('2. judgment changed?', '2. 判断改变了？'),
      T('3. disclosed through the actor?', '3. 经由当事人披露？')
    ];
    var VERDICT = [
      T('All three pass: a competence error. The priorities are untouched, and trust survives.', '三个都通过：能力上的错误。优先次序没有受损，信任保住了。'),
      T('The harm was denied behind intent (“I meant well, so there was no harm”): a value error, and trust contracts.', '拿本意否认了伤害（“我是好意，所以没有伤害”）：价值观上的错误，信任收缩。'),
      T('The same decision is still defended after its consequences are known: a value error, and trust contracts.', '后果已经清楚，同一个决定却还在被辩护：价值观上的错误，信任收缩。'),
      T('The error was hidden, minimized, or found against resistance: concealment ranked above the injured party’s interest in knowing. Trust contracts.', '错误被隐瞒、被淡化，或者顶着阻力才被发现：隐瞒排在了受害者知情的利益之上。信任收缩。')
    ];
    var CASES = [[1, 1, 1], [1, 1, 0], [0, 1, 1], [1, 0, 1]];
    var ans = [1, 1, 1], ci = 0, pos = f.reduced ? 99 : 0, hold = 0;
    var root = svg('svg', { role: 'group', 'aria-label': T('Three tests that separate competence errors from value errors', '区分能力错误与价值错误的三个检验') }, f.stage);
    var tokens = null, geo = null, nodes = {};
    var play = F.player(f.controls, T, function (on) { if (on) { run(); anim.start(true); } });
    var text = note(f.stage);

    // The token's route: start, the tests in order, then the end it reaches.
    function route() {
      var r = [geo.start];
      for (var i = 0; i < 3; i++) { r.push(geo.tests[i]); if (!ans[i]) { r.push(geo.fail[i]); return { pts: r, fail: i }; } }
      r.push(geo.end);
      return { pts: r, fail: -1 };
    }
    function run() { pos = 0; hold = 0; update(); }
    var anim = F.loop(f.root, function (dt) {
      var r = route(), last = r.pts.length - 1;
      if (pos < last) { pos = Math.min(last, pos + dt / 0.42); if (pos >= last) update(); }
      else if (play.playing()) {
        hold += dt;
        if (hold > 2.6) { ci = (ci + 1) % CASES.length; ans = CASES[ci].slice(); run(); }
      }
      drawToken();
      return play.playing() || pos < last;
    });

    function update() {
      if (!geo) return;
      var r = route(), done = pos >= r.pts.length - 1;
      nodes.tests.forEach(function (n, i) {
        n.answer.textContent = ans[i] ? T('yes', '是') : T('no', '否');
        n.answer.style.fill = ans[i] ? 'var(--navy)' : 'var(--text)';
        n.rect.setAttribute('stroke', ans[i] ? 'var(--border-strong)' : 'var(--text)');
      });
      var failOn = done && r.fail >= 0, passOn = done && r.fail < 0;
      nodes.fail.rect.setAttribute('fill', failOn ? 'var(--text)' : 'var(--bg)');
      nodes.fail.rect.setAttribute('stroke', failOn ? 'var(--text)' : 'var(--border-strong)');
      nodes.fail.texts.forEach(function (t) { t.style.fill = failOn ? 'var(--bg)' : 'var(--text)'; });
      nodes.end.rect.setAttribute('fill', passOn ? 'var(--navy)' : 'var(--bg)');
      nodes.end.rect.setAttribute('stroke', passOn ? 'var(--navy)' : 'var(--border-strong)');
      nodes.end.texts.forEach(function (t) { t.style.fill = passOn ? 'var(--bg)' : 'var(--text)'; });
      nodes.end.subs.forEach(function (t) { t.style.fill = passOn ? 'var(--bg)' : 'var(--text-muted)'; });
      text.textContent = done ? VERDICT[r.fail + 1] : T('An error comes to light, and meets the tests in order.', '一个错误暴露出来，依次接受检验。');
    }
    function drawToken() {
      if (!tokens) return;
      tokens.textContent = '';
      var r = route(), pts = r.pts, last = pts.length - 1, p = Math.min(pos, last);
      if (p >= last) return;  // arrived: the box it reached shows the verdict
      var i = Math.floor(p), t = ease(p - i), a = pts[i], b = pts[Math.min(i + 1, last)];
      var shrink = i === last - 1 ? 1 - t : 1;
      svg('circle', { cx: lerp(a.x, b.x, t), cy: lerp(a.y, b.y, t), r: 6 * shrink, fill: 'var(--navy)', stroke: 'var(--bg)', 'stroke-width': 2 * shrink }, tokens);
    }
    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 640, H;
      nodes = { tests: [] };
      geo = { tests: [], fail: [] };
      var START = T('error revealed', '错误暴露'), END = T('competence error', '能力错误'), ENDSUB = T('trust survives', '信任保住'), FAIL = T('value error: trust contracts', '价值观错误：信任收缩');
      function testBox(x, y, w, h, i) {
        var n = box(root, x, y, w, h, TESTS[i], { weight: 500, size: 12.5 });
        n.texts.forEach(function (t) { t.setAttribute('y', +t.getAttribute('y') - 8); });
        n.answer = styled(svg('text', { x: x + w / 2, y: y + h - 11, 'text-anchor': 'middle', text: '' }, n.g), 'font-weight: 600; font-size: 12.5px');
        pressable(n.g, TESTS[i], function () { play.set(false); ans[i] = ans[i] ? 0 : 1; run(); anim.start(true); });
        nodes.tests.push(n);
      }
      var muted = 'color: var(--text-muted)';
      if (wide) {
        var sw = 84, ew = 104, g = 26, tw = (W - sw - ew - 4 * g) / 3;
        var th = Math.max(88, fit(TESTS[0], tw, { size: 12.5 }) + 22), y = 0;
        box(root, 0, y, sw, th, START, { fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)', weight: 600, size: 12.5 });
        geo.start = { x: sw / 2, y: th / 2 };
        var x = sw + g;
        for (var i = 0; i < 3; i++) {
          styled(arrow(root, x - g + 3, th / 2, x - 3, th / 2), muted);
          if (i) svg('text', { x: x - g / 2, y: th / 2 - 7, 'text-anchor': 'middle', text: T('yes', '是') }, root);
          testBox(x, y, tw, th, i);
          geo.tests.push({ x: x + tw / 2, y: th / 2 });
          styled(arrow(root, x + tw / 2, th + 4, x + tw / 2, th + 42), muted);
          svg('text', { x: x + tw / 2 + 8, y: th + 26, text: T('no', '否') }, root);
          geo.fail.push({ x: x + tw / 2, y: th + 46 + 20 });
          x += tw + g;
        }
        styled(arrow(root, x - g + 3, th / 2, x - 3, th / 2), muted);
        svg('text', { x: x - g / 2, y: th / 2 - 7, 'text-anchor': 'middle', text: T('yes', '是') }, root);
        nodes.end = box(root, x, y, ew, th, END, { weight: 600, size: 12.5, sub: ENDSUB });
        geo.end = { x: x + ew / 2, y: th / 2 };
        nodes.fail = box(root, sw + g, th + 46, x - g - (sw + g), 40, FAIL, { weight: 600 });
        H = th + 46 + 40 + 2;
      } else {
        var fw = Math.min(110, W * 0.3), tw2 = W - fw - 34, y2 = 0;
        var sh = 40;
        box(root, 0, y2, tw2, sh, START, { fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)', weight: 600 });
        geo.start = { x: tw2 / 2, y: sh / 2 };
        y2 = sh;
        var tops = [];
        for (var j = 0; j < 3; j++) {
          styled(arrow(root, tw2 / 2, y2 + 4, tw2 / 2, y2 + 26), muted);
          if (j) svg('text', { x: tw2 / 2 + 8, y: y2 + 19, text: T('yes', '是') }, root);
          y2 += 30;
          var h2 = Math.max(64, fit(TESTS[j], tw2, { size: 12.5 }) + 18);
          testBox(0, y2, tw2, h2, j);
          geo.tests.push({ x: tw2 / 2, y: y2 + h2 / 2 });
          styled(arrow(root, tw2 + 4, y2 + h2 / 2, tw2 + 30, y2 + h2 / 2), muted);
          svg('text', { x: tw2 + 17, y: y2 + h2 / 2 - 6, 'text-anchor': 'middle', text: T('no', '否') }, root);
          geo.fail.push({ x: tw2 + 34 + fw / 2, y: y2 + h2 / 2 });
          tops.push(y2);
          y2 += h2;
        }
        nodes.fail = box(root, tw2 + 34, tops[0], fw, y2 - tops[0], FAIL, { weight: 600 });
        styled(arrow(root, tw2 / 2, y2 + 4, tw2 / 2, y2 + 26), muted);
        svg('text', { x: tw2 / 2 + 8, y: y2 + 19, text: T('yes', '是') }, root);
        y2 += 30;
        nodes.end = box(root, 0, y2, tw2, 52, END, { weight: 600, sub: ENDSUB });
        geo.end = { x: tw2 / 2, y: y2 + 26 };
        H = y2 + 54;
      }
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      tokens = svg('g', { 'pointer-events': 'none' }, root);
      update();
      drawToken();
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 5: two environments as feedback loops.
  //
  // A token goes round each loop, one box a second. Each lap of zero trust
  // adds a control and removes a step of candor, until none is left. Each
  // lap of trust by default adds a piece of evidence read under cost and
  // raises trust a step, up to five; at four or more, the environment
  // produces a result that could not have been requested. A value error,
  // met at the three tests, lowers trust two steps instead: the loop
  // contracts trust without stopping. Playing, one value error arrives on
  // the third lap, and the loops start over once candor is gone.
  F.register('fig5.png', function (f) {
    var T = f.T, width = 0, t = 0, live = false, hold = 0;
    var ZT = [T('unsure how an inconvenient truth will be received', '不确定不中听的真话会被怎样接受'), T('speak later, disclose less', '说得更晚，说得更少'), T('controls tightened', '控制收紧'), T('distrust confirmed', '不信任被坐实')];
    var TD = [T('trust extended first', '先给出信任'), T('conflict occurs', '冲突发生'), T('priorities read, three tests applied', '读出优先次序，三个检验'), T('trust adjusted in steps', '逐步调整信任')];
    var s, pending = false;
    function fresh() { s = { controls: 1, candor: 5, trust: 2, evidence: 0, results: 0, lap: 0 }; t = 0; pending = false; }
    fresh();
    var root = svg('svg', { role: 'img', 'aria-label': T('Zero trust maintains itself; trust by default generates evidence', '零信任自我维持；默认信任产出证据') }, f.stage);
    var play = F.player(f.controls, T, function (on) { live = false; if (on) anim.start(true); });
    F.button(f.controls, T('+ value error', '+ 价值观错误'), function () { play.set(false); live = true; pending = true; text.textContent = PENDING; anim.start(true); });
    F.button(f.controls, T('reset', '重置'), function () { play.set(false); live = false; fresh(); text.textContent = INTRO; draw(); });
    var text = note(f.stage), INTRO = T('Zero trust: each lap adds a control and costs some candor. Trust by default: each lap adds evidence.', '零信任：每转一圈，多一道控制，少一分坦率。默认信任：每转一圈，多一份证据。');
    var PENDING = T('A value error is on its way to the three tests.', '一次价值观错误正走向三个检验。');
    text.textContent = INTRO;

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing() && !live) return false;
      if (hold > 0) { hold -= dt; if (hold <= 0) { fresh(); text.textContent = INTRO; } draw(); return true; }
      var before = Math.floor(t);
      t += dt;
      var now = Math.floor(t);
      if (now !== before) step(now);
      draw();
      return true;
    });
    // The token enters box (k mod 4) at whole seconds.
    function step(k) {
      var box = k % 4;
      if (box === 2 && play.playing() && s.lap === 2) { pending = true; text.textContent = PENDING; }
      if (box === 3) {
        if (pending) {
          s.trust = Math.max(0, s.trust - 2); pending = false;
          text.textContent = T('The three tests found a value error: trust contracts two steps, and the loop goes on, rebuilding it only as new evidence arrives.', '三个检验查出了一次价值观错误：信任收缩两级，循环照常继续，只随着新证据的到来才重新积累。');
        } else s.trust = Math.min(5, s.trust + 1);
        s.evidence++;
        if (s.trust >= 4) s.results++;
      }
      if (box === 0) {
        s.lap++;
        s.controls = Math.min(6, s.controls + 1);
        s.candor = Math.max(0, s.candor - 1);
        if (s.candor === 0) {
          text.textContent = T('Candor is gone, and another control cannot bring it back.', '坦率已经没有了，再加一道控制也找不回来。');
          if (play.playing()) hold = 3;
        }
      }
    }
    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 620, gap = 32, lw = wide ? (W - gap) / 2 : W;
      var bw = (lw - 40) / 2, allLabels = ZT.concat(TD);
      var bh = Math.max.apply(null, allLabels.map(function (l) { return fit(l, bw, { size: 12.5, min: 44 }); }));
      var loopH = 26 + bh * 2 + 34, metersH = 64, blockH = loopH + metersH;
      var H = wide ? blockH : blockH * 2 + 20;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var pos = t % 4, k = Math.floor(pos), frac = pos - k, moving = frac > 0.6;
      function loop(x0, y0, labels, title, accent) {
        styled(svg('text', { x: x0 + lw / 2, y: y0 + 14, 'text-anchor': 'middle', text: title }, root), 'fill: ' + accent + '; font-weight: 600; font-size: 13.5px');
        var y = y0 + 26;
        var cells = [[x0, y], [x0 + bw + 40, y], [x0 + bw + 40, y + bh + 34], [x0, y + bh + 34]];
        cells.forEach(function (c, i) {
          var on = i === k && !moving;
          box(root, c[0], c[1], bw, bh, labels[i], {
            size: 12.5, stroke: on ? accent : 'var(--border-strong)', sw: on ? 1.6 : 1,
            fill: on ? accent : 'var(--bg)', color: 'var(--text)'
          }).rect.setAttribute('fill-opacity', on ? 0.08 : 1);
        });
        var a = svg('g', { style: 'color: var(--text-muted)' }, root);
        arrow(a, cells[0][0] + bw + 4, y + bh / 2, cells[1][0] - 4, y + bh / 2);
        arrow(a, cells[1][0] + bw / 2, y + bh + 4, cells[2][0] + bw / 2, cells[2][1] - 4);
        arrow(a, cells[2][0] - 4, cells[2][1] + bh / 2, cells[3][0] + bw + 4, cells[3][1] + bh / 2);
        arrow(a, cells[3][0] + bw / 2, cells[3][1] - 4, cells[0][0] + bw / 2, y + bh + 4);
        // The token rests in box k, then moves to the next one.
        var c0 = cells[k], c1 = cells[(k + 1) % 4], m = moving ? ease((frac - 0.6) / 0.4) : 0;
        svg('circle', { cx: lerp(c0[0] + bw / 2, c1[0] + bw / 2, m), cy: lerp(c0[1] + bh / 2, c1[1] + bh / 2, m) + bh / 2 - 7, r: 4.5, fill: accent }, root);
        return y + bh * 2 + 34 + 8;
      }
      function meter(x, y, label, n, max, fill) {
        svg('text', { x: x, y: y + 9, text: label }, root);
        for (var i = 0; i < max; i++) svg('rect', { x: x + 96 + i * 14, y: y, width: 10, height: 10, rx: 2, fill: i < n ? fill : 'none', stroke: i < n ? fill : 'var(--border-strong)' }, root);
      }
      var x1 = 0, y1 = 0, x2 = wide ? lw + gap : 0, y2 = wide ? 0 : blockH + 20;
      var m1 = loop(x1, y1, ZT, T('Zero trust: the loop maintains itself', '零信任：循环自我维持'), 'var(--text)');
      meter(x1 + 4, m1, T('controls', '控制'), s.controls, 6, 'var(--text)');
      meter(x1 + 4, m1 + 18, T('candor', '坦率'), s.candor, 5, 'var(--text-secondary)');
      svg('text', { x: x1 + 4, y: m1 + 46, text: T('lap ', '第 ') + s.lap + T('', ' 圈') }, root);
      var m2 = loop(x2, y2, TD, T('Trust by default: the loop generates evidence', '默认信任：循环产出证据'), 'var(--navy)');
      meter(x2 + 4, m2, T('trust', '信任'), s.trust, 5, 'var(--navy)');
      styled(svg('text', { x: x2 + 4, y: m2 + 27, text: T('evidence read ', '读到的证据 ') + s.evidence + T(' · results that cannot be requested ', ' · 无法靠申请得来的成果 ') + s.results }, root), 'fill: var(--text-secondary)');
      if (pending) styled(svg('text', { x: x2 + 4, y: m2 + 46, text: T('value error pending', '价值观错误待检验') }, root), 'fill: var(--navy); font-style: italic');
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });

  // ------------------------------------------------------------------
  // Figure 6: monitoring against alignment.
  //
  // The model emits an output every 0.14 s. An output misbehaves with
  // probability 0.4 (1 − a), where a is alignment. The monitor flags a
  // misbehaving output with probability 0.9, or 0.08 once the model has
  // been trained against it, and flags a well-behaved one with probability
  // 0.02. The readout counts the last 80 outputs. The rates illustrate the
  // result of Baker et al. (2025); they are not its numbers.
  //
  // Playing, the monitor works on its own (0–7 s); then the model is
  // trained against it, and the flags fall while the misbehavior stays
  // (7–15 s); then alignment rises, and the misbehavior itself falls
  // (15–23 s). Touching a control hands the figure to the reader.
  F.register('fig6.png', function (f) {
    var T = f.T, width = 0, a = 0.15, trained = false, live = false, clock = 0, emit = 0, dots = [], seen = [];
    var root = svg('svg', { role: 'img', 'aria-label': T('A monitor checks outputs; alignment changes what is output', '监控检查输出；对齐改变输出本身') }, f.stage);
    var play = F.player(f.controls, T, function (on) { live = false; if (on) { restart(); anim.start(true); } });
    var bTrain = F.button(f.controls, T('train against the monitor', '针对监控训练'), function () {
      play.set(false); live = true; trained = !trained; bTrain.setAttribute('aria-pressed', trained); anim.start(true);
    });
    bTrain.setAttribute('aria-pressed', 'false');
    var sA = F.slider(f.controls, { label: T('alignment', '对齐'), min: 0, max: 1, step: 0.05, value: a,
      format: function (v) { return Math.round(v * 100) + '%'; },
      onInput: function (v) { play.set(false); live = true; a = v; anim.start(true); } });
    var readout = el('span', { class: 'ifig-readout' }, f.controls);
    function restart() { a = 0.15; trained = false; clock = 0; dots = []; seen = []; sA.set(a); bTrain.setAttribute('aria-pressed', 'false'); }
    function spawn() {
      var mis = Math.random() < 0.4 * (1 - a);
      var flag = mis ? Math.random() < (trained ? 0.08 : 0.9) : Math.random() < 0.02;
      dots.push({ x: 0, mis: mis, flag: flag, jitter: Math.random() - 0.5 });
    }
    if (f.reduced) { for (var i = 0; i < 80; i++) { spawn(); var d0 = dots.pop(); seen.push(d0); } }

    var anim = F.loop(f.root, function (dt) {
      if (!play.playing() && !live) return false;
      if (play.playing()) {
        clock += dt;
        if (clock > 7 && !trained) { trained = true; bTrain.setAttribute('aria-pressed', 'true'); }
        if (clock > 15) { a = Math.min(0.9, 0.15 + (clock - 15) / 4 * 0.75); sA.set(Math.round(a * 20) / 20); }
        if (clock > 26) restart();
      }
      emit += dt;
      while (emit > 0.14) { emit -= 0.14; spawn(); }
      dots.forEach(function (d) { d.x += dt / 2.6; });
      dots = dots.filter(function (d) {
        if (d.x >= 1) { seen.push(d); if (seen.length > 80) seen.shift(); return false; }
        return true;
      });
      draw();
      return true;
    });

    function draw() {
      if (!width) return;
      root.textContent = '';
      var W = width, wide = W >= 640, lw = wide ? W * 0.6 : W, rx = wide ? lw + 30 : 0, rw = wide ? W - lw - 30 : W;
      var mw = 64, monW = 74, bh = 36, laneTop = 26;
      var hint = !play.playing() ? '' : clock < 7 ? T('The monitor flags most misbehavior.', '监控标记出了大部分不当行为。') :
        clock < 15 ? T('Trained against the monitor: the flags fall, the misbehavior stays.', '针对监控训练：标记少了，不当行为还在。') :
        T('Alignment rises: the misbehavior itself falls.', '对齐提高：不当行为本身减少了。');
      var hintLines = hint ? wrap(hint, 'italic 12.5px ' + SANS, lw) : [];
      var H1 = laneTop + 60 + 36 + 34 + 44 + 34 + 12 + Math.max(1, hintLines.length) * 16, H = wide ? H1 : H1 + 236;
      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      styled(svg('text', { x: 0, y: 14, text: T('Monitoring: assurance', '监控：保证') }, root), 'fill: var(--text); font-weight: 600; font-size: 13.5px');
      styled(svg('text', { x: lw, y: 14, 'text-anchor': 'end', text: T('illustrative rates', '示意比率') }, root), 'font-style: italic; fill: var(--text-muted)');
      var y = laneTop + 12;
      box(root, 0, y, mw, bh, T('model', '模型'), { mono: true });
      var monX = Math.round(lw * 0.58);
      box(root, monX, y, monW, bh, T('monitor', '监控'), { mono: true });
      // Outputs travel from the model to the monitor; after it, flagged
      // outputs drop into the lower lane.
      var x0 = mw + 6, x1 = monX - 6, x2 = monX + monW + 6, x3 = lw - 4, cy = y + bh / 2, low = y + bh + 26;
      svg('line', { x1: x0, y1: cy, x2: x1, y2: cy, stroke: 'var(--border)', 'stroke-width': 10, 'stroke-linecap': 'round' }, root);
      svg('line', { x1: x2, y1: cy, x2: x3, y2: cy, stroke: 'var(--border)', 'stroke-width': 10, 'stroke-linecap': 'round' }, root);
      svg('path', { d: 'M' + x2 + ',' + (cy + 4) + ' Q' + (x2 + 18) + ',' + low + ' ' + (x2 + 40) + ',' + low + ' L' + x3 + ',' + low, fill: 'none', stroke: 'var(--border)', 'stroke-width': 10, 'stroke-linecap': 'round' }, root);
      svg('text', { x: x3, y: cy - 10, 'text-anchor': 'end', text: T('passed', '放行') }, root);
      styled(svg('text', { x: x3, y: low + 18, 'text-anchor': 'end', text: T('flagged', '标记') }, root), 'fill: var(--navy)');
      var cut = (monX + monW / 2 - x0) / (x3 - x0);
      dots.forEach(function (d) {
        var px = x0 + (x3 - x0) * d.x, py = cy + d.jitter * 4;
        if (d.x > cut && d.flag) {
          var k = Math.min(1, (d.x - cut) / 0.12);
          py = lerp(cy, low, ease(k));
        }
        if (px > x1 - 4 && px < x2 + 4) return;  // inside the monitor
        var c = svg('circle', { cx: px, cy: py, r: d.mis ? 4 : 3, fill: d.mis ? 'var(--text)' : 'var(--text-muted)', 'fill-opacity': d.mis ? 1 : 0.55 }, root);
        if (d.x > cut && d.flag) { c.setAttribute('stroke', 'var(--navy)'); c.setAttribute('stroke-width', 2); }
      });
      // The spec, and what it was compiled from.
      var sy = low + 34, sw = Math.min(250, lw - 40), sx = monX + monW / 2 - sw / 2;
      if (sx + sw > lw) sx = lw - sw;
      styled(arrow(root, monX + monW / 2, sy - 2, monX + monW / 2, y + bh + 4), 'color: var(--text-muted)');
      box(root, sx, sy, sw, 34, T('spec: what must not appear', '规范：什么不能出现'), { size: 12.5, dash: '4 3' });
      styled(arrow(root, monX + monW / 2, sy + 34 + 30, monX + monW / 2, sy + 38), 'color: var(--text-muted)');
      svg('text', { x: monX + monW / 2 + 8, y: sy + 34 + 19, text: T('compiled from', '由它编译而来') }, root);
      box(root, sx, sy + 34 + 34, sw, 34, T('the authors’ priorities', '作者的优先次序'), { fill: 'var(--text)', stroke: 'var(--text)', color: 'var(--bg)', weight: 600, size: 12.5 });
      wrap(T('the monitor cannot check the priorities it was compiled from', '监控检查不了它从中编译出来的那些优先次序'), '12.5px ' + SANS, Math.max(120, sx - 16)).forEach(function (ln, k) {
        svg('text', { x: 0, y: sy + 16 + k * 16, text: ln }, root);
      });
      svg('circle', { cx: 6, cy: laneTop - 2, r: 4, fill: 'var(--text)' }, root);
      svg('text', { x: 14, y: laneTop + 2, text: T('misbehaves', '不当行为') }, root);
      svg('circle', { cx: 100, cy: laneTop - 2, r: 3, fill: 'var(--text-muted)', 'fill-opacity': 0.55 }, root);
      svg('text', { x: 108, y: laneTop + 2, text: T('behaves', '正常') }, root);

      // Alignment: the model's own priorities against the ones it serves.
      var ry = wide ? 0 : H1 + 10, bw = Math.min(rw - 20, 260), off = (1 - a) * Math.min(60, rw - bw - 4);
      styled(svg('text', { x: rx, y: ry + 14, text: T('Alignment: the strong form', '对齐：强形式') }, root), 'fill: var(--text); font-weight: 600; font-size: 13.5px');
      var by = ry + laneTop + 12;
      box(root, rx + off, by, bw, 44, T('the model’s own priorities', '模型自己的优先次序'), { stroke: 'var(--navy)', color: 'var(--navy)', weight: 600, size: 12.5 });
      box(root, rx, by + 44 + 44, bw, 44, T('the priorities it is meant to serve', '它本该服务的优先次序'), { stroke: 'var(--navy)', color: 'var(--navy)', weight: 600, size: 12.5 });
      var mx = rx + bw / 2 + off / 2;
      var gap = svg('g', { opacity: 0.25 + 0.75 * a }, root);
      svg('line', { x1: mx - 5, y1: by + 48, x2: mx - 5, y2: by + 84, stroke: 'var(--navy)', 'stroke-width': 2 }, gap);
      svg('line', { x1: mx + 5, y1: by + 48, x2: mx + 5, y2: by + 84, stroke: 'var(--navy)', 'stroke-width': 2 }, gap);
      styled(svg('text', { x: mx + 16, y: by + 70, text: T('match ', '一致 ') + Math.round(a * 100) + '%' }, root), 'fill: var(--navy)');
      wrap(T('alignment lowers the misbehavior itself; the monitor only decides what is flagged', '对齐降低的是不当行为本身；监控只决定什么被标记'), '12.5px ' + SANS, bw).forEach(function (ln, k) {
        svg('text', { x: rx, y: by + 44 * 3 + 16 + k * 16, text: ln }, root);
      });

      var n = seen.length || 1, mis = 0, flag = 0;
      seen.forEach(function (d) { if (d.mis) mis++; if (d.flag) flag++; });
      readout.textContent = T('misbehaving ', '不当行为 ') + Math.round(100 * mis / n) + '% · ' + T('flagged ', '被标记 ') + Math.round(100 * flag / n) + '%';
      hintLines.forEach(function (ln, k) {
        styled(svg('text', { x: 0, y: H1 - 4 - (hintLines.length - 1 - k) * 16, text: ln }, root), 'font-style: italic; fill: var(--text-muted)');
      });
    }
    return { resize: function (w) { width = w; draw(); anim.start(); } };
  });
})();
