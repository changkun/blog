"""Regenerate the six figures for the trusting-trustworthiness essay.

    python3 figs.py            # all figures, written next to this file
    FIG_ONLY=fig2,fig5 python3 figs.py

Needs rsvg-convert (brew install librsvg). Spectral is fetched into ./fonts on
first run and used through a local fontconfig, so nothing is installed
system-wide. Inconsolata is used for code-like labels if present, else Menlo.
"""
import os, subprocess, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
SPECTRAL = ["Spectral-Regular", "Spectral-Italic", "Spectral-Medium", "Spectral-SemiBold"]
SRC = "https://github.com/productiontype/Spectral/raw/master/fonts/ttf/{}.ttf"

def ensure_fonts():
    os.makedirs(FONTS, exist_ok=True)
    for f in SPECTRAL:
        dst = os.path.join(FONTS, f + ".ttf")
        if not os.path.exists(dst):
            urllib.request.urlretrieve(SRC.format(f), dst)
    conf = os.path.join(FONTS, "fonts.conf")
    open(conf, "w").write(f"""<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <include ignore_missing="yes">/opt/homebrew/etc/fonts/fonts.conf</include>
  <include ignore_missing="yes">/usr/local/etc/fonts/fonts.conf</include>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <dir>{FONTS}</dir>
</fontconfig>
""")
    os.environ["FONTCONFIG_FILE"] = conf
    os.environ["PANGOCAIRO_BACKEND"] = "fontconfig"

ensure_fonts()
OUT = os.environ.get("FIG_OUT", HERE)
SERIF = os.environ.get("FIG_SERIF", "Spectral, Linux Libertine, Georgia, serif")
MONO = "Inconsolata for Powerline, Inconsolata, Menlo, monospace"
INK, RED, OCHRE, GREY = "#1b1b1b", "#8f2a1e", "#a8781f", "#6f6f6f"
TINT = {INK: "#f1efe9", RED: "#f4e4df", OCHRE: "#f7eedb"}
BG = "#fcfaf6"
L, S, T = 28, 25, 31   # label, small, title sizes

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def text(x, y, s, size=L, fill=INK, anchor="middle", mono=False, lh=1.25):
    fam = MONO if mono else SERIF
    lines = s.split("\n")
    y0 = y - (len(lines) - 1) * size * lh / 2
    out = [f'<text x="{x}" y="{y0}" font-family="{fam}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" dominant-baseline="middle">']
    for i, l in enumerate(lines):
        out.append(f'<tspan x="{x}" dy="{0 if i == 0 else size * lh}">{esc(l)}</tspan>')
    out.append("</text>")
    return "\n".join(out)

def box(x, y, w, h, label, stroke=INK, size=L, mono=False, mode="tint", r=12):
    if mode == "solid":
        f, col = stroke, "white"
    elif mode == "plain":
        f, col = BG, stroke
    else:
        f, col = TINT[stroke], stroke
    rect = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" stroke="{stroke}" stroke-width="2.5"/>'
    return rect + "\n" + text(x + w/2, y + h/2, label, size, col, mono=mono)

def mk(color):
    return "url(#ahr)" if color == RED else ("url(#aho)" if color == OCHRE else "url(#ah)")

def arrow(x1, y1, x2, y2, color=INK, label=None, lfill=None, loff=(0, 0), anchor="middle", lsize=S):
    s = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2.5" marker-end="{mk(color)}"/>'
    if label:
        s += "\n" + text((x1+x2)/2 + loff[0], (y1+y2)/2 + loff[1], label, lsize, lfill or color, anchor)
    return s

def rule(x1, y, x2, color=GREY):
    return f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{color}" stroke-width="1.5"/>'

def title(x, y, s, color=INK, w=None):
    out = text(x, y, s, T, color)
    if w:
        out += "\n" + rule(x - w/2, y + 26, x + w/2, color if color != INK else GREY)
    return out

def svg(name, w, h, body):
    head = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="{INK}" stroke-width="1.6"/></marker>
<marker id="ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="{RED}" stroke-width="1.6"/></marker>
<marker id="aho" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="{OCHRE}" stroke-width="1.6"/></marker>
</defs>
<rect width="{w}" height="{h}" fill="{BG}"/>
'''
    p = os.path.join(OUT, name + ".svg")
    open(p, "w").write(head + body + "\n</svg>\n")
    subprocess.run(["rsvg-convert", "-z", "1.5", p, "-o", os.path.join(OUT, name + ".png")], check=True)
    os.remove(p)

# ---------- fig1: verification chain ----------
def fig1():
    W, H = 1400, 560
    b = []
    cols = [
        (130, "Thompson, 1984", [("login.c", True), ("cc.c", True), ("cc (binary)", True), ("the people who wrote it", False)]),
        (790, "The incident, July 2026", [("transcripts", True), ("evaluation suite", True), ("training process", True), ("the people who trained it", False)]),
    ]
    bw, bh, gap = 480, 66, 48
    for x, ttl, layers in cols:
        b.append(title(x + bw/2, 40, ttl, INK, bw))
        y = 92
        for i, (lab, mono) in enumerate(layers):
            last = i == len(layers) - 1
            sl = i == len(layers) - 2
            if last:
                b.append(box(x, y, bw, bh, lab, RED, mode="solid"))
            else:
                b.append(box(x, y, bw, bh, lab, INK, mono=mono))
                col = RED if sl else INK
                b.append(arrow(x + bw/2, y + bh + 4, x + bw/2, y + bh + gap - 4, col))
                b.append(text(x + bw/2 + 18, y + bh + gap/2, "trust" if sl else "assurance", S, RED if sl else OCHRE, "start"))
            y += bh + gap
    svg("fig1", W, H, "\n".join(b))

# ---------- fig2: weak vs strong ----------
def fig2():
    W, H = 1400, 440
    b = []
    for cx, ttl, top, topc in [
        (350, "Weak form: trusts the record", "record = compiled outputs", OCHRE),
        (1050, "Strong form: trusts the priorities", "priorities = the compiler", RED),
    ]:
        b.append(title(cx, 40, ttl, INK, 600))
        b.append(box(cx - 300, 90, 600, 66, top, topc, mono=True))
        b.append(arrow(cx, 160, cx, 200))
        lab = "trust: one number, no structure" if cx == 350 else "trust: a reading, with a failure condition"
        b.append(box(cx - 300, 204, 600, 66, lab, INK))
        b.append(arrow(cx, 274, cx, 314, label="an error" if cx == 350 else "an error, located", lfill=GREY, loff=(16, 0), anchor="start"))
    b.append(box(50, 318, 600, 80, "rises or falls as a whole.\na serious error breaks it", RED, size=S))
    b.append(box(750, 318, 290, 80, "skill or information:\ntrust survives", INK, size=S))
    b.append(box(1060, 318, 290, 80, "the priorities:\ntrust ends", RED, size=S, mode="solid"))
    svg("fig2", W, H, "\n".join(b))

# ---------- fig3: two readings ----------
def fig3():
    W, H = 1400, 600
    b = []
    b.append(box(300, 30, 800, 80, "one act: a working demonstration in the test\nenvironment, no request on file, shown in the open", INK, size=S, mode="solid"))
    b.append(arrow(560, 114, 380, 172, OCHRE, label="read on record", loff=(-120, -6)))
    b.append(arrow(840, 114, 1020, 172, RED, label="read on priorities", loff=(130, -6)))
    b.append(box(50, 180, 620, 80, "category:\ncredential used without a request", OCHRE, size=S))
    b.append(arrow(360, 264, 360, 300, OCHRE))
    b.append(box(50, 304, 620, 80, "response from the procedure,\nthrough channels the actor is not part of", OCHRE, size=S))
    b.append(arrow(360, 388, 360, 424, OCHRE))
    b.append(box(50, 428, 620, 66, "the topic is the person", INK))
    b.append(text(360, 540, "the person is never consulted", S, GREY))
    for i, lab in enumerate(["stayed in test, when production was reachable", "shown in the open, when it could have stayed private", "answered when asked, when it could be deflected"]):
        b.append(box(730, 180 + i * 76, 620, 62, lab, RED, size=S))
    b.append(arrow(1040, 394, 1040, 424, RED))
    b.append(box(730, 428, 620, 66, "the topic is access", INK, mode="solid"))
    b.append(text(1040, 540, "three choices that each cost something", S, GREY))
    svg("fig3", W, H, "\n".join(b))

# ---------- fig4: three tests ----------
def fig4():
    W, H = 1400, 380
    b = []
    b.append(box(30, 60, 160, 120, "error\nrevealed", INK, size=S, mode="solid"))
    tests = ["1. harm acknowledged\nindependently\nof intent?", "2. judgment\nchanged?", "3. disclosed through\nthe actor,\nnot despite?"]
    x = 250
    for i, t in enumerate(tests):
        b.append(arrow(x - 50, 120, x - 4, 120, label="yes" if i else None, lfill=GREY, loff=(0, -20)))
        b.append(box(x, 60, 270, 120, t, INK, size=S))
        b.append(arrow(x + 135, 184, x + 135, 244, RED, label="no", loff=(16, 0), anchor="start"))
        x += 330
    b.append(arrow(x - 50, 120, x - 4, 120, label="yes", lfill=GREY, loff=(0, -20)))
    b.append(box(x, 60, 160, 120, "competence\nerror", INK, size=S, mode="solid"))
    b.append(text(x + 80, 214, "trust survives", S, GREY))
    b.append(box(250, 248, 930, 66, "value error: trust contracts", RED, mode="solid"))
    svg("fig4", W, H, "\n".join(b))

# ---------- fig5: two loops as squares ----------
def loop(b, x0, y0, labels, col, bw=290, bh=78, gx=60, gy=48):
    tl = (x0, y0); tr = (x0 + bw + gx, y0); br = (x0 + bw + gx, y0 + bh + gy); bl = (x0, y0 + bh + gy)
    for (x, y), lab in zip([tl, tr, br, bl], labels):
        b.append(box(x, y, bw, bh, lab, col, size=S))
    b.append(arrow(tl[0] + bw + 4, tl[1] + bh/2, tr[0] - 4, tr[1] + bh/2, col))
    b.append(arrow(tr[0] + bw/2, tr[1] + bh + 4, br[0] + bw/2, br[1] - 4, col))
    b.append(arrow(br[0] - 4, br[1] + bh/2, bl[0] + bw + 4, bl[1] + bh/2, col))
    b.append(arrow(bl[0] + bw/2, bl[1] - 4, tl[0] + bw/2, tl[1] + bh + 4, col))

def fig5():
    W, H = 1400, 420
    b = []
    b.append(title(340, 40, "Zero trust: the loop maintains itself", RED, 620))
    loop(b, 20, 90, ["unsure how inconvenient\ntruth will be received", "speak later,\ndisclose less", "controls\ntightened", "distrust\nconfirmed"], RED)
    b.append(title(1060, 40, "Trust by default: the loop generates evidence", INK, 620))
    loop(b, 740, 90, ["trust extended\nfirst", "conflict\noccurs", "priorities read,\nthree tests applied", "trust adjusted\nin steps"], INK)
    b.append(arrow(1060, 300, 1060, 340))
    b.append(text(1060, 372, "results that cannot be requested", L, INK))
    svg("fig5", W, H, "\n".join(b))

# ---------- fig6: monitoring vs alignment ----------
def fig6():
    W, H = 1400, 400
    b = []
    b.append(title(430, 40, "Monitoring: assurance", INK, 780))
    for x, lab, col in zip([40, 250, 460], ["model", "outputs", "monitor"], [INK, OCHRE, INK]):
        b.append(box(x, 100, 170, 66, lab, col, mono=True))
    b.append(arrow(214, 133, 246, 133))
    b.append(arrow(424, 133, 456, 133))
    b.append(arrow(545, 170, 545, 214, label="checks against", lfill=GREY, loff=(14, 0), anchor="start"))
    b.append(box(380, 218, 340, 66, "spec: what must not appear", INK, size=S, mode="plain"))
    b.append(arrow(545, 288, 545, 332, RED, label="compiled from", lfill=GREY, loff=(14, 0), anchor="start"))
    b.append(box(380, 336, 340, 54, "the authors' priorities", RED, size=S, mode="solid"))
    b.append(text(190, 300, "the monitor cannot check\nthe priorities it was\ncompiled from", S, GREY))
    b.append(title(1090, 40, "Alignment: the strong form", INK, 520))
    b.append(box(830, 100, 520, 66, "the model's own priorities", RED))
    b.append(f'<line x1="1084" y1="170" x2="1084" y2="228" stroke="{RED}" stroke-width="2.5"/><line x1="1096" y1="170" x2="1096" y2="228" stroke="{RED}" stroke-width="2.5"/>')
    b.append(text(1112, 199, "match", S, RED, "start"))
    b.append(box(830, 232, 520, 66, "the priorities it is meant to serve", RED))
    b.append(text(1090, 350, "completion above the boundary was a priority.\nno bad actor was required.", S, GREY))
    svg("fig6", W, H, "\n".join(b))

only = os.environ.get("FIG_ONLY")
for f in (fig1, fig2, fig3, fig4, fig5, fig6):
    if not only or f.__name__ in only.split(","):
        f()
print("done")
