/* =====================================================================
   ✏️  EDIT HERE — everything you need to personalise is in this block
   ===================================================================== */
const birthdayConfig = {
  name: "HER NAME",                 // her name (shows on screens 2 and 5)
  fromName: "Lorenzo",              // your name (shows in the signature)

  birthdayMessage: "I hope today reminds you how loved you are.",

  // Photos: just replace the files in the images/ folder (keep the names).
  // Change the captions below. Add/remove lines if you want more/fewer photos.
  photos: [
    { src: "images/photo1.jpg", caption: "One of my favorite memories with you." },
    { src: "images/photo2.jpg", caption: "Caption for photo 2 — edit me." },
    { src: "images/photo3.jpg", caption: "Caption for photo 3 — edit me." },
    { src: "images/photo4.jpg", caption: "Caption for photo 4 — edit me." },
    { src: "images/photo5.jpg", caption: "Caption for photo 5 — edit me." }
  ],

  // The letter. Each new line is a new line in the letter; an empty line = a gap.
  letter: `Happy birthday, love.

I wanted to make something for you instead of just giving you something I bought.

So I made this little corner of the internet just for you.

Thank you for being part of my life.

I hope you know how special you are to me.

Happy birthday. ❤️`,

  oneLastThing: "One last thing...",
  finalMessage: "Happy Birthday, {name} ❤️",   // {name} is replaced by her name
  signature: "Made with love by {from}.",      // {from} is replaced by your name

  letterSpeedMs: 140                           // time per word in the letter (lower = faster)
};
/* ===================== END OF EDITABLE SECTION ===================== */

(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = birthdayConfig;
  const fill = (t) => t.replace("{name}", C.name).replace("{from}", C.fromName);
  const screens = Array.from(document.querySelectorAll(".screen"));
  const audio = $("#bgm"), musicBtn = $("#musicBtn");
  let current = 0, timers = [], typing = null;

  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; clearInterval(typing); };

  /* ---------- fill in text from config ---------- */
  document.title = "For " + C.name + " ♡";
  document.querySelectorAll("[data-name]").forEach((e) => (e.textContent = C.name));
  $("#bdayMsg").textContent = C.birthdayMessage;
  $("#oneLast").textContent = C.oneLastThing;
  $("#finalMsg").textContent = fill(C.finalMessage);
  $("#signature").textContent = fill(C.signature);

  /* images that fail to load get a soft placeholder instead of a broken icon */
  function safeImg(img, src, alt) {
    img.addEventListener("error", () => img.classList.add("missing"));
    img.alt = alt; img.src = src;
  }
  safeImg($("#heroImg"), C.photos[0].src, "A photo of us");

  /* ---------- navigation ---------- */
  function go(n) {
    current = n;
    screens.forEach((s, i) => {
      s.classList.toggle("active", i === n);
      s.setAttribute("aria-hidden", i !== n);
    });
    screens[n].scrollTop = 0;
    clearAll();
    if (n === 3) startLetter();
    if (n === 4) startGarden();
  }
  document.querySelectorAll("[data-go]").forEach((b) =>
    b.addEventListener("click", () => go(+b.dataset.go))
  );

  /* ---------- music ---------- */
  function setMusicUI(on) {
    musicBtn.classList.toggle("off", !on);
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function playMusic() {
    audio.volume = 0.6;
    const p = audio.play();
    if (p && p.catch) p.catch(() => setMusicUI(false));
    setMusicUI(true);
  }
  musicBtn.addEventListener("click", () => {
    if (audio.paused) playMusic(); else { audio.pause(); setMusicUI(false); }
  });

  /* ---------- particles (petals + hearts) on one lightweight canvas ---------- */
  const cv = $("#fx"), cx = cv.getContext("2d");
  const COLORS = ["#f4b6c2", "#f9d3d8", "#e79aac", "#fbe3d6", "#ffffff", "#f1c9a8"];
  let W = 0, H = 0, parts = [], running = true;

  function resize() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", resize); resize();

  const rnd = (a, b) => a + Math.random() * (b - a);
  function ambient() {
    return { x: rnd(0, W), y: -20, vx: rnd(-.25, .25), vy: rnd(.35, .9), s: rnd(5, 10),
      r: rnd(0, 6.28), vr: rnd(-.02, .02), heart: Math.random() < .3, c: COLORS[(Math.random() * COLORS.length) | 0],
      a: rnd(.35, .75), sw: rnd(0, 6.28) };
  }
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const ang = rnd(0, 6.28), sp = rnd(2, 7);
      parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3, s: rnd(6, 12), r: rnd(0, 6.28), vr: rnd(-.12, .12),
        heart: Math.random() < .45, c: COLORS[(Math.random() * COLORS.length) | 0], a: 1, life: 110, b: true, sw: 0 });
    }
  }
  function drawHeart(s) {
    cx.beginPath(); cx.moveTo(0, s * .35);
    cx.bezierCurveTo(-s, -s * .4, -s * .5, -s * 1.1, 0, -s * .5);
    cx.bezierCurveTo(s * .5, -s * 1.1, s, -s * .4, 0, s * .35); cx.fill();
  }
  function frame() {
    if (!running) return;
    cx.clearRect(0, 0, W, H);
    const target = reduce ? 0 : (W < 500 ? 12 : 24);
    if (parts.filter((p) => !p.b).length < target && Math.random() < .06) parts.push(ambient());
    parts = parts.filter((p) => p.y < H + 30 && !(p.b && p.life <= 0));
    for (const p of parts) {
      if (p.b) { p.vy += .13; p.vx *= .985; p.life--; p.a = Math.min(1, p.life / 40); }
      else { p.sw += .02; p.x += Math.sin(p.sw) * .4; }
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = p.a; cx.fillStyle = p.c;
      if (p.heart) drawHeart(p.s * .8);
      else { cx.beginPath(); cx.ellipse(0, 0, p.s * .6, p.s, 0, 0, 6.28); cx.fill(); }
      cx.restore();
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden; if (running) requestAnimationFrame(frame);
  });
  requestAnimationFrame(frame);

  /* ---------- screen 1: open the gift ---------- */
  const gift = $("#gift"), openBtn = $("#openBtn");
  openBtn.addEventListener("click", () => {
    openBtn.disabled = true;
    gift.classList.add("opened");
    const r = gift.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + 20, reduce ? 12 : 55);
    playMusic();
    musicBtn.classList.add("show");
    later(() => go(1), reduce ? 200 : 1800);
  });

  /* ---------- screen 3: polaroids + lightbox ---------- */
  const ROT = [-5, 4, -3, 6, -6, 3, -4];
  const board = $("#board"), lb = $("#lb");
  C.photos.forEach((ph, i) => {
    const fig = document.createElement("button");
    fig.className = "polaroid"; fig.style.setProperty("--r", ROT[i % ROT.length] + "deg");
    fig.setAttribute("aria-label", "Open photo " + (i + 1));
    const img = document.createElement("img"); img.loading = "lazy";
    safeImg(img, ph.src, ph.caption);
    fig.appendChild(img);
    fig.addEventListener("click", () => openPhoto(ph, fig));
    board.appendChild(fig);
  });
  let lastFocus = null;
  function openPhoto(ph, trigger) {
    lastFocus = trigger;
    safeImg($("#lbImg"), ph.src, ph.caption);
    $("#lbCap").textContent = ph.caption;
    lb.hidden = false; $("#lbClose").focus();
  }
  function closePhoto() { lb.hidden = true; if (lastFocus) lastFocus.focus(); }
  $("#lbClose").addEventListener("click", closePhoto);
  lb.addEventListener("click", (e) => { if (!$("#lbCard").contains(e.target)) closePhoto(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closePhoto(); });

  /* ---------- screen 4: the letter writes itself ---------- */
  let words = [];
  function buildLetter() {
    const box = $("#letterText"); box.innerHTML = ""; words = [];
    C.letter.split("\n").forEach((line) => {
      const p = document.createElement("p");
      if (!line.trim()) p.className = "gap";
      else line.trim().split(/\s+/).forEach((w) => {
        const s = document.createElement("span"); s.className = "w"; s.textContent = w + " ";
        p.appendChild(s); words.push(s);
      });
      box.appendChild(p);
    });
    $("#letterNext").classList.remove("show");
  }
  function finishLetter() {
    clearInterval(typing); words.forEach((w) => w.classList.add("on"));
    $("#letterNext").classList.add("show");
  }
  function startLetter() {
    buildLetter();
    if (reduce) return finishLetter();
    let i = 0;
    later(() => {
      typing = setInterval(() => {
        if (i < words.length) words[i++].classList.add("on"); else finishLetter();
      }, C.letterSpeedMs);
    }, 1200);
  }
  $("#letter").addEventListener("click", finishLetter);

  /* ---------- screen 5: the garden ---------- */
  // x = position (%), h = height (% of garden), s = bloom size (px), d = start delay (s)
  const FLOWERS = [
    { x: 12, h: 52, s: 15, d: 0.0, c1: "#f4b6c2", c2: "#e58ca3" },
    { x: 27, h: 74, s: 19, d: 0.5, c1: "#fbe3d6", c2: "#f0b9a0" },
    { x: 41, h: 60, s: 16, d: 0.9, c1: "#ffffff", c2: "#f3d3da" },
    { x: 54, h: 84, s: 21, d: 0.3, c1: "#f9c9d2", c2: "#e07d98" },
    { x: 67, h: 58, s: 16, d: 1.2, c1: "#fbe3d6", c2: "#f3b3a0" },
    { x: 80, h: 72, s: 19, d: 0.7, c1: "#f4b6c2", c2: "#e58ca3" },
    { x: 92, h: 48, s: 14, d: 1.5, c1: "#ffffff", c2: "#f3d3da" }
  ];
  function buildGarden() {
    const g = $("#garden"); g.innerHTML = "";
    FLOWERS.forEach((f) => {
      const el = document.createElement("div"); el.className = "fl";
      el.style.cssText = `left:${f.x}%;--h:${f.h}%;--s:${f.s}px;--d:${f.d + 2.2}s;--c1:${f.c1};--c2:${f.c2}`;
      let html = '<div class="stem"></div><div class="bloom">';
      for (let i = 0; i < 6; i++) html += `<i class="petal" style="--a:${i * 60}deg"></i>`;
      el.innerHTML = html + '<i class="core"></i></div>';
      g.appendChild(el);
    });
  }
  function startGarden() {
    const one = $("#oneLast"), fin = $("#finale");
    one.classList.remove("on", "off"); fin.classList.remove("show");
    buildGarden();
    later(() => one.classList.add("on"), 400);
    later(() => one.classList.add("off"), 2400);
    const total = reduce ? 300 : (1.5 + 2.2 + 1.7 + 1.3 + 0.8) * 1000 + 800;
    later(() => {
      fin.classList.add("show");
      burst(innerWidth / 2, innerHeight * 0.35, reduce ? 0 : 45);
    }, total);
  }

  /* ---------- replay ---------- */
  $("#replayBtn").addEventListener("click", () => {
    clearAll(); audio.pause(); audio.currentTime = 0; setMusicUI(true);
    musicBtn.classList.remove("show");
    gift.classList.remove("opened"); openBtn.disabled = false;
    $("#finale").classList.remove("show"); $("#garden").innerHTML = "";
    go(0);
  });
})();
