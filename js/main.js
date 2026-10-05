document.documentElement.classList.add('js');

/* ================= SETTINGS (edit here) ================= */
const WA_NUMBER = '201080293128';
const WA_TEXT   = "Hi Ahmed, I'd like to book a free 30-minute meeting.";
const WA_URL    = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
const SERVICES  = ['Motion graphics','Reels and short-form video','Social media growth','Performance marketing','Brand identity','Content strategy'];
const MOTION    = ['bhYO5aG-2wk','npCUUHudCoc','ZqKlfCxzX24','qDqZ74iFcdc'];
// [videoId, 'v' = vertical short, 'w' = regular wide video]
const REELS = [
  ['cMbMOmZcgaY','w'],['nWUpOP7DzaE','v'],['d7TMBNPgy_o','v'],['RC1Dnq9mdG0','v'],
  ['iIvcHbtcYfc','v'],['xR6Xw_E--Tk','v'],['sCIhjzqLXl4','v'],['cZPQRlNc9Bw','v'],
  ['qfBXOT_LHeg','v'],['DG445FmFdgY','v'],['fK00XbMJV64','v'],['0yEHe6f6pCk','v'],
  ['gHmnegJUEYo','v'],['ce9FvAEECns','v'],['wKCqoPSR6Rg','v'],['dDPdIv1QLCg','w']
];
/* ========================================================= */

const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* WhatsApp links */
['ctaBtn','waLine','fab'].forEach(id => { const el = document.getElementById(id); if (el) el.href = WA_URL; });

/* Hero headline: letter by letter */
(function(){
  const h = $('#h1'); let i = 0;
  ['Hi, I\'m Ahmed','El.Biany'].forEach((line, li) => {
    line.split(' ').forEach((word, wi, arr) => {
      const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden','true');
      [...word].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; w.appendChild(s); });
      h.appendChild(w); h.appendChild(document.createTextNode(' '));
    });
    if (li === 0) { h.appendChild(document.createElement('br')); i += 2; }
  });
})();

/* Marquee */
(function(){
  const t = $('#track'); const html = SERVICES.map(s => '<span>' + s + '</span>').join('');
  t.innerHTML = html + html + html + html;
})();

/* Video cards */
const thumb = (id, q) => 'https://img.youtube.com/vi/' + id + '/' + q + '.jpg';
function card(id, type, label){
  const b = document.createElement('button');
  b.className = 'vcard rv s' + (type === 'w' ? ' wide' : '');
  b.type = 'button'; b.dataset.id = id; b.dataset.type = type;
  b.setAttribute('aria-label', 'Play ' + label);
  const img = document.createElement('img');
  img.src = thumb(id, 'hqdefault'); img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
  img.onerror = () => img.remove();
  b.appendChild(img);
  b.insertAdjacentHTML('beforeend', '<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span><span class="lbl">Watch now</span>');
  return b;
}
MOTION.forEach((id, i) => { const c = card(id, 'v', 'motion graphics video'); c.style.setProperty('--d', (i * .12) + 's'); $('#motionGrid').appendChild(c); });
REELS.forEach(([id, t], i) => { const c = card(id, t, 'reel'); c.classList.remove('rv','s'); $('#scroller').appendChild(c); });

/* Intro poster */
(function(){
  const b = $('#introBtn'); const id = b.dataset.id;
  const img = document.createElement('img'); img.alt = ''; img.referrerPolicy = 'no-referrer';
  img.src = thumb(id, 'maxresdefault');
  img.onerror = () => { if (!img.dataset.f) { img.dataset.f = 1; img.src = thumb(id, 'hqdefault'); } else img.remove(); };
  img.onload = () => { if (img.naturalWidth && img.naturalWidth < 200) img.src = thumb(id, 'hqdefault'); };
  b.prepend(img);
})();

/* Modal player */
const modal = $('#modal'), mFrame = $('#mFrame');
let lastFocus = null;
function openVideo(id, type){
  lastFocus = document.activeElement;
  mFrame.className = 'm-frame ' + (type === 'w' ? 'w' : 'v');
  const host = (location.protocol === 'http:' || location.protocol === 'https:') ? '&origin=' + encodeURIComponent(location.origin) : '';
  mFrame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1' + host + '" title="Ahmed El.Biany video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  $('#mClose').focus();
}
function closeVideo(){
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  setTimeout(() => { if (!modal.classList.contains('open')) mFrame.innerHTML = ''; }, 450);
  if (lastFocus) lastFocus.focus();
}
$('#mClose').addEventListener('click', closeVideo);
$('#mBack').addEventListener('click', closeVideo);
addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo(); });

let dragMoved = false;
document.addEventListener('click', e => {
  const t = e.target.closest('.vcard, .screen'); if (!t) return;
  if (dragMoved) { dragMoved = false; return; }
  openVideo(t.dataset.id, t.dataset.type);
});

/* Reels scroller: drag, arrows, progress */
(function(){
  const sc = $('#scroller'), prog = $('#prog');
  const step = () => (sc.querySelector('.vcard').offsetWidth + 20) * 2;
  $('#prev').onclick = () => sc.scrollBy({ left: -step(), behavior: 'smooth' });
  $('#next').onclick = () => sc.scrollBy({ left: step(), behavior: 'smooth' });
  const upd = () => { const max = sc.scrollWidth - sc.clientWidth; const r = max > 0 ? sc.scrollLeft / max : 0; const vis = sc.clientWidth / sc.scrollWidth; prog.style.width = (vis * 100 + (100 - vis * 100) * r) + '%'; };
  sc.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  let down = false, sx = 0, sl = 0;
  sc.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = sc.scrollLeft; dragMoved = false; });
  addEventListener('pointermove', e => {
    if (!down) return; const dx = e.clientX - sx;
    if (Math.abs(dx) > 6) { dragMoved = true; sc.classList.add('drag'); }
    if (dragMoved) sc.scrollLeft = sl - dx;
  });
  addEventListener('pointerup', () => { if (!down) return; down = false; sc.classList.remove('drag'); setTimeout(() => { dragMoved = false; }, 0); });
})();

/* Scroll reveal + counters */
(function(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    if (el.classList.contains('rv')) setTimeout(() => el.classList.remove('rv','s','l','r'), 1800);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv, .title').forEach(el => {
    if (el.classList.contains('stat')) { const d = ['l','','','r'][[...el.parentNode.children].indexOf(el)]; if (d) el.classList.add(d); }
    io.observe(el);
  });
  const fmt = n => n.toLocaleString('en-US');
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, suf = el.dataset.suffix || '', dur = 2200, t0 = performance.now();
    if (reduce) { el.textContent = fmt(to) + suf; return; }
    (function tick(t){ const p = Math.min((t - t0) / dur, 1), v = 1 - Math.pow(2, -10 * p); el.textContent = fmt(Math.round(to * (p === 1 ? 1 : v))) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: .6 });
  document.querySelectorAll('.num').forEach(n => cio.observe(n));
})();

/* Nav, progress bar, FAB, nebula parallax */
const nav = $('#nav'), bar = $('#progress'), fab = $('#fab'), neb = $('#nebula');
let sy = 0;
function onScroll(){
  sy = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? sy / max : 0) + ')';
  nav.classList.toggle('solid', sy > 40);
  fab.classList.toggle('show', sy > innerHeight * .6);
  neb.style.transform = 'translate3d(0,' + (-sy * .06) + 'px,0)';
}
addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true }); onScroll();

/* Mouse: orbit parallax + cursor glow */
const rig = $('#rig'), glow = $('#glow');
let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my, nx = 0, ny = 0;
if (fine && !reduce) {
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    nx = (mx / innerWidth - .5); ny = (my / innerHeight - .5);
    rig.style.transform = 'translate3d(' + (nx * -26) + 'px,' + (ny * -26) + 'px,0) rotateY(' + (nx * 10) + 'deg) rotateX(' + (ny * -10) + 'deg)';
  });
  (function loop(){ gx += (mx - gx) * .08; gy += (my - gy) * .08; glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)'; requestAnimationFrame(loop); })();

  /* 3D tilt on motion cards */
  document.querySelectorAll('#motionGrid .vcard').forEach(c => {
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg) translateZ(10px)'; });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
} else { glow.style.display = 'none'; }

/* Star field */
(function(){
  const cv = $('#space'), ctx = cv.getContext('2d');
  let W, H, D, stars = [], shoots = [], next = 2500;
  const cols = ['255,255,255','190,210,255','140,170,255','170,255,225'];
  function build(){
    D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * D; cv.height = H * D; ctx.setTransform(D, 0, 0, D, 0, 0);
    const n = Math.min(280, Math.floor(W * H / 6500));
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, tw: Math.random() * 6.28, sp: .4 + Math.random() * 1.6, c: cols[Math.random() * cols.length | 0] }));
  }
  function frame(t){
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const y = (((s.y - sy * s.z * .25) % H) + H) % H, x = s.x + nx * s.z * -30;
      const a = (.35 + .65 * (.5 + .5 * Math.sin(t / 1000 * s.sp + s.tw))) * (.3 + s.z * .7);
      ctx.beginPath(); ctx.fillStyle = 'rgba(' + s.c + ',' + a.toFixed(3) + ')';
      ctx.arc(x, y, s.z * 1.5 + .2, 0, 6.283); ctx.fill();
    }
    if (!reduce) {
      if (t > next) { next = t + 3500 + Math.random() * 4500; shoots.push({ x: Math.random() * W * .9 + W * .1, y: Math.random() * H * .4, vx: -7 - Math.random() * 4, vy: 3 + Math.random() * 2, l: 1 }); }
      shoots = shoots.filter(s => s.l > 0);
      for (const s of shoots) {
        s.x += s.vx; s.y += s.vy; s.l -= .014;
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
        g.addColorStop(0, 'rgba(200,220,255,' + s.l + ')'); g.addColorStop(1, 'rgba(120,150,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12); ctx.stroke();
      }
      requestAnimationFrame(frame);
    }
  }
  build(); addEventListener('resize', () => { build(); if (reduce) frame(0); });
  if (reduce) frame(0); else requestAnimationFrame(frame);
})();
