// Hilfsfunktionen für die Erklärvideos: sichtbarer Mauszeiger, Einblendungen, langsames Klicken/Tippen,
// Aufnahme mit Playwright und Umwandlung in MP4. Aufruf: node <skript>.mjs (App unter APP_URL, Standard
// die Vorschau 127.0.0.1:5184). Ausgabe: VIDEO_OUT (Standard ../video), Kontrollbilder optional in SHOTS.
import { cpSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const W = 1440, H = 900;
export const URL = process.env.APP_URL || 'http://127.0.0.1:5184/';
const OUT = process.env.VIDEO_OUT || fileURLToPath(new globalThis.URL('../video', import.meta.url));
const TMP = '/tmp/ava-videos';

const OVERLAY = () => {
  const install = () => {
    if (document.getElementById('__cap')) return;
    const st = document.createElement('style');
    st.textContent = `
      #__cursor{position:fixed;z-index:2147483647;left:0;top:0;width:22px;height:22px;margin:-3px 0 0 -3px;pointer-events:none;
        transition:transform .08s;}
      #__cursor svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
      #__cursor.down{transform:scale(.8)}
      #__ring{position:fixed;z-index:2147483646;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;
        border:3px solid #ff6b2c;opacity:0;pointer-events:none}
      #__ring.go{animation:__r .5s ease-out}
      @keyframes __r{from{opacity:.9;transform:scale(.3)}to{opacity:0;transform:scale(1.4)}}
      #__cap{position:fixed;z-index:2147483645;left:84px;bottom:28px;width:560px;pointer-events:none;
        font:15px/1.45 Inter,system-ui,sans-serif;color:#fafafa;background:rgba(24,24,27,.88);border-radius:14px;
        backdrop-filter:blur(10px);padding:14px 18px 15px;box-shadow:0 12px 40px rgba(0,0,0,.28);opacity:0;
        transform:translateY(6px);transition:opacity .25s,transform .25s;letter-spacing:-.006em}
      #__cap.on{transform:none}
      #__cap.on{opacity:1}
      #__cap .k{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#fb923c;margin-bottom:5px;font-weight:600}
      #__cap .t{font-weight:600;font-size:16.5px;margin-bottom:3px}
      #__cap .note{margin-top:8px;padding:8px 10px;border-radius:8px;background:rgba(251,191,36,.18);color:#fde68a;font-size:14px}
      #__cap.right{left:auto;right:24px}
      #__card{position:fixed;inset:0;z-index:2147483644;display:flex;align-items:center;justify-content:center;
        background:radial-gradient(1200px 600px at 20% 10%,#2a1a12 0%,#18181b 55%,#0f0f11 100%);color:#fff;font-family:Inter,system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .4s}
      #__card.on{opacity:1}
      #__card .box{max-width:900px;padding:40px}
      #__card .k{color:#fb923c;text-transform:uppercase;letter-spacing:.08em;font-size:13px;font-weight:600;margin-bottom:12px}
      #__card h1{font-size:46px;margin:0 0 18px;font-weight:650;letter-spacing:-.02em}
      #__card p,#__card li{font-size:20px;line-height:1.6;color:#d4d4d8}
      #__card ul{padding-left:24px;margin:8px 0}
      #__hl{position:fixed;z-index:2147483643;border:3px solid #ff6b2c;border-radius:8px;pointer-events:none;opacity:0;
        transition:all .25s;box-shadow:0 0 0 4000px rgba(0,0,0,.0)}
      #__hl.on{opacity:1}
      @media print{#__cursor,#__ring,#__cap,#__card,#__hl{display:none!important}}`;
    document.documentElement.appendChild(st);
    const c = document.createElement('div'); c.id = '__cursor';
    c.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6-3.6 6.9z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const r = document.createElement('div'); r.id = '__ring';
    const cap = document.createElement('div'); cap.id = '__cap';
    const card = document.createElement('div'); card.id = '__card';
    const hl = document.createElement('div'); hl.id = '__hl';
    document.documentElement.append(c, r, cap, card, hl);
    const pos = window.__pos || { x: W / 2, y: H / 2 };
    c.style.transform = ''; c.style.left = pos.x + 'px'; c.style.top = pos.y + 'px';
    addEventListener('mousemove', (e) => { window.__pos = { x: e.clientX, y: e.clientY }; c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', (e) => { c.classList.add('down'); r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      r.classList.remove('go'); void r.offsetWidth; r.classList.add('go'); }, true);
    addEventListener('mouseup', () => c.classList.remove('down'), true);
  };
  const W = innerWidth, H = innerHeight;
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', install); else install();
  window.__cap = (k, t, text, note, side) => {
    install();
    const cap = document.getElementById('__cap');
    if (!t) { cap.classList.remove('on'); return; }
    cap.className = side === 'right' ? 'right' : '';
    cap.innerHTML = `<div class="k">${k}</div><div class="t">${t}</div><div>${text || ''}</div>${note ? `<div class="note">${note}</div>` : ''}`;
    requestAnimationFrame(() => cap.classList.add('on'));
  };
  window.__card = (html) => { install(); const c = document.getElementById('__card');
    if (!html) { c.classList.remove('on'); return; } c.innerHTML = `<div class="box">${html}</div>`; requestAnimationFrame(() => c.classList.add('on')); };
  window.__hl = (b) => { install(); const h = document.getElementById('__hl');
    if (!b) { h.classList.remove('on'); return; }
    Object.assign(h.style, { left: b.x - 6 + 'px', top: b.y - 6 + 'px', width: b.width + 12 + 'px', height: b.height + 12 + 'px' }); h.classList.add('on'); };
};

/** Aufnahme starten. profile: Name des Browser-Profils (Daten bleiben zwischen Videos erhalten, z. B. LPH 1 → 2 → 3);
 *  frisch: Profil vorher löschen („alles leer“). Rückgabe: page, Hilfsfunktionen und fertig() zum Abschließen. */
export async function aufnahme(name, { profile = name, frisch = false, kicker = '' } = {}) {
  const prof = `${TMP}/profile-${profile}`, raw = `${TMP}/raw-${name}`;
  if (frisch) rmSync(prof, { recursive: true, force: true });
  // Stand eines früheren Videos wiederherstellen (z. B. „kita“ nach 01), damit Folgevideos wiederholbar sind
  if (process.env.AB_STAND) { rmSync(prof, { recursive: true, force: true }); cpSync(`${TMP}/stand-${process.env.AB_STAND}`, prof, { recursive: true }); }
  rmSync(raw, { recursive: true, force: true }); mkdirSync(raw, { recursive: true });
  const ctx = await chromium.launchPersistentContext(prof, {
    ...(process.env.OHNE_CHROME ? {} : { channel: 'chrome' }), headless: true, viewport: { width: W, height: H }, locale: 'de-DE',
    recordVideo: { dir: raw, size: { width: W, height: H } },
  });
  await ctx.addInitScript(OVERLAY);
  const page = ctx.pages()[0] || await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERR', e.message));
  const h = helpers(page, kicker);
  let shot = 0;
  const snap = async (n) => { if (process.env.SHOTS) { mkdirSync(process.env.SHOTS, { recursive: true }); await page.screenshot({ path: `${process.env.SHOTS}/${name}-${String(++shot).padStart(2, '0')}-${n}.png` }); } };
  const fertig = async ({ stand } = {}) => {
    await ctx.close();
    // Profil als benannten Stand sichern (AB_STAND=<stand> startet ein Folgevideo genau hier)
    if (stand) { rmSync(`${TMP}/stand-${stand}`, { recursive: true, force: true }); cpSync(prof, `${TMP}/stand-${stand}`, { recursive: true }); }
    const webm = readdirSync(raw).find((f) => f.endsWith('.webm'));
    mkdirSync(OUT, { recursive: true });
    const mp4 = `${OUT}/${name}.mp4`;
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${raw}/${webm}`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
    const dauer = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', mp4]).toString().trim();
    console.log(`VIDEO ${mp4} (${Math.round(Number(dauer))} s)`);
    return mp4;
  };
  return { page, ...h, snap, fertig };
}

export function helpers(page, kicker) {
  let mx = W / 2, my = H / 2;
  const wait = (ms) => page.waitForTimeout(ms);
  const moveTo = async (x, y, steps = 18) => { await page.mouse.move(x, y, { steps }); mx = x; my = y; };
  const center = async (loc) => { await loc.scrollIntoViewIfNeeded(); const b = await loc.boundingBox(); if (!b) throw new Error('no box'); return { x: b.x + b.width / 2, y: b.y + b.height / 2, b }; };
  const hover = async (loc) => { const c = await center(loc); await moveTo(c.x, c.y); await wait(250); };
  const click = async (loc, { dbl = false, pause = 350 } = {}) => {
    const c = await center(loc); await moveTo(c.x, c.y); await wait(220);
    if (dbl) await page.mouse.dblclick(c.x, c.y); else await page.mouse.click(c.x, c.y);
    await wait(pause);
  };
  const type = async (text, delay = 55) => { await page.keyboard.type(text, { delay }); await wait(250); };
  const key = async (k, pause = 400) => { await page.keyboard.press(k); await wait(pause); };
  const cap = async (t, text, { note, ms = 3800, side } = {}) => { await page.evaluate(([k, t, x, n, s]) => window.__cap(k, t, x, n, s), [kicker, t, text, note, side]); await wait(ms); };
  const capOff = () => page.evaluate(() => window.__cap());
  const card = async (html, ms = 5000) => { await page.evaluate((h) => window.__card(h), html); await wait(ms); await page.evaluate(() => window.__card()); await wait(450); };
  const hl = async (loc) => { const b = loc ? await loc.boundingBox() : null; await page.evaluate((b) => window.__hl(b), b); };
  return { wait, moveTo, hover, click, type, key, cap, capOff, card, hl };
}
