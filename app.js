import { EFFECTS, PALETTES } from './wled-data.js';
import { t, applyStatic, toggleLang, getLang } from './i18n.js';

// Common USB-serial bridges on WLED boards. The port picker lists only these.
const USB_FILTERS = [
  { usbVendorId: 0x1a86 },  // WCH: CH340, CH341, CH9102
  { usbVendorId: 0x10c4 },  // Silicon Labs: CP210x
  { usbVendorId: 0x0403 },  // FTDI
  { usbVendorId: 0x303a },  // Espressif: ESP32-S2/S3/C3/C6 native USB
  { usbVendorId: 0x067b },  // Prolific: PL2303
];
const BAUD = 115200;
const LIVE_MS = 120;      // per-LED color poll interval
const STATE_MS = 4000;    // full state sync interval
const SEND_MS = 70;       // minimum gap between commands while dragging a slider
const PRESET_SLOTS = 8;
const SWATCHES = ['#ff0000', '#ff6400', '#ffc800', '#d8ff75', '#00ff00', '#00ffff',
  '#0000ff', '#8c00ff', '#ff3c8c', '#ffaa50', '#ffffff'];

const $ = (s) => document.querySelector(s);
const ui = {
  connectBtn: $('#connectBtn'), connStatus: $('#connStatus'), strip: $('#strip'),
  stripCaption: $('#stripCaption'), unsupported: $('#unsupported'), controls: $('#controls'),
  powerBtn: $('#powerBtn'), bri: $('#bri'), briOut: $('#briOut'),
  colorPick: $('#colorPick'), colorHex: $('#colorHex'), swatches: $('#swatches'), pal: $('#pal'),
  fxSearch: $('#fxSearch'), fxList: $('#fxList'), fxEmpty: $('#fxEmpty'),
  sx: $('#sx'), sxOut: $('#sxOut'), ix: $('#ix'), ixOut: $('#ixOut'),
  presetBtns: $('#presetBtns'), saveForm: $('#saveForm'), saveSlot: $('#saveSlot'), saveName: $('#saveName'),
  devInfo: $('#devInfo'), langBtn: $('#langBtn'),
};

const app = {
  state: null, info: null, leds: [], ledCount: 63,
  busy: new Set(),         // controls the user is dragging; don't overwrite them from device state
  status: { key: 'statusIdle', vars: {}, state: '' },
};

// ------------------------------------------------------------------ serial
class WledSerial {
  constructor(onLine, onClose) {
    this.onLine = onLine; this.onClose = onClose;
    this.port = null; this.reader = null; this.writer = null;
    this.chain = Promise.resolve(); this.enc = new TextEncoder();
  }
  get connected() { return !!this.port; }

  async open(port) {
    await port.open({ baudRate: BAUD });
    // Never call setSignals(). On ESP boards with an auto-reset circuit (D1 mini, NodeMCU...):
    //   RTS on + DTR off -> pulls EN/RST low (chip resets)
    //   DTR on + RTS off -> pulls GPIO0 low (WLED reads it as a button press and toggles power)
    // Chrome opens the port with both asserted, which is safe. Changing them one at a time
    // passes through one of the states above.
    this.port = port;
    this.writer = port.writable.getWriter();
    this.readLoop();
  }

  async readLoop() {
    const dec = new TextDecoder();
    let buf = '';
    try {
      while (this.port?.readable) {
        this.reader = this.port.readable.getReader();
        try {
          for (;;) {
            const { value, done } = await this.reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            let i;
            while ((i = buf.indexOf('\n')) >= 0) {
              const line = buf.slice(0, i).trim();
              buf = buf.slice(i + 1);
              if (line) this.onLine(line);
            }
            if (buf.length > 65536) buf = '';
          }
        } finally {
          this.reader.releaseLock();
          this.reader = null;
        }
        if (!this.port) break;
      }
    } catch (err) {
      console.warn('Serial read error:', err);
    }
    if (this.port) this.close(true);
  }

  write(text) {
    if (!this.writer) return Promise.resolve();
    this.chain = this.chain
      .then(() => this.writer.write(this.enc.encode(text)))
      .catch((err) => console.warn('Serial write error:', err));
    return this.chain;
  }
  sendJson(obj) { return this.write(JSON.stringify(obj) + '\n'); }

  async close(lost = false) {
    const port = this.port;
    if (!port) return;
    this.port = null;
    try { await this.reader?.cancel(); } catch { /* ignore */ }
    try { await this.chain; this.writer?.releaseLock(); } catch { /* ignore */ }
    this.writer = null;
    try { await port.close(); } catch { /* ignore */ }
    this.onClose(lost);
  }
}

const serial = new WledSerial(handleLine, handleClosed);
let liveTimer = 0, stateTimer = 0, awaitingLeds = 0, refreshTimer = 0;

function handleLine(line) {
  if (line[0] === '[') {
    awaitingLeds = 0;
    try { app.leds = JSON.parse(line); renderStrip(); } catch { /* partial frame, ignore */ }
  } else if (line[0] === '{') {
    try {
      const d = JSON.parse(line);
      if (d.state) { app.state = d.state; app.info = d.info || app.info; renderState(); }
    } catch { /* ignore */ }
  }
}

function handleClosed(lost) {
  clearInterval(liveTimer); clearInterval(stateTimer); clearTimeout(refreshTimer);
  app.state = null; app.leds = [];
  ui.controls.disabled = true;
  ui.connectBtn.classList.add('btn-primary');
  setStatus(lost ? 'statusLost' : 'statusIdle', lost ? 'error' : '');
  renderDynamic();
  renderStrip();
  setGlow(null);
}

async function connect() {
  let port;
  try {
    const granted = await navigator.serial.getPorts();
    port = granted.find(matchesFilter) || await navigator.serial.requestPort({ filters: USB_FILTERS });
  } catch (err) {
    if (err.name !== 'NotFoundError') setStatus('statusChooserError', 'error', { msg: err.message });
    return; // NotFoundError: the user closed the picker
  }
  setStatus('statusConnecting');
  try {
    await serial.open(port);
  } catch (err) {
    setStatus(err.name === 'InvalidStateError' ? 'statusBusyTab' : 'statusBusyPort', 'error');
    return;
  }
  setStatus('statusConnected', 'on');
  ui.connectBtn.classList.remove('btn-primary');
  ui.controls.disabled = false;
  renderDynamic();
  requestState();
  stateTimer = setInterval(requestState, STATE_MS);
  liveTimer = setInterval(pollLeds, LIVE_MS);
}

function matchesFilter(p) {
  const i = p.getInfo();
  return USB_FILTERS.some((f) => f.usbVendorId === i.usbVendorId && (f.usbProductId ?? i.usbProductId) === i.usbProductId);
}

function requestState() { serial.write('{"v":true}\n'); }
function pollLeds() {
  if (document.hidden) return;
  if (awaitingLeds && performance.now() - awaitingLeds < 600) return;
  awaitingLeds = performance.now();
  serial.write('l');
}
function refreshSoon() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(requestState, 350);
}

// Send a command. With a key, rapid updates (slider drags) are coalesced.
const pending = new Map();
function send(obj, key = null) {
  if (!serial.connected) return;
  if (!key) { serial.sendJson(obj); refreshSoon(); return; }
  const p = pending.get(key) || { last: 0, timer: 0, obj: null };
  p.obj = obj;
  pending.set(key, p);
  const wait = SEND_MS - (performance.now() - p.last);
  if (wait <= 0) flush(key);
  else if (!p.timer) p.timer = setTimeout(() => flush(key), wait);
}
function flush(key) {
  const p = pending.get(key);
  if (!p) return;
  clearTimeout(p.timer); p.timer = 0; p.last = performance.now();
  if (p.obj) { serial.sendJson(p.obj); p.obj = null; refreshSoon(); }
}

// ------------------------------------------------------------------ render
function setStatus(key, state = '', vars = {}) {
  app.status = { key, state, vars };
  ui.connStatus.textContent = t(key, vars);
  ui.connStatus.dataset.state = state;
}

// Strings that depend on connection state and language.
function renderDynamic() {
  const { key, state, vars } = app.status;
  ui.connStatus.textContent = t(key, vars);
  ui.connStatus.dataset.state = state;
  ui.connectBtn.textContent = t(serial.connected ? 'disconnect' : 'connect');
  [...ui.swatches.children].forEach((b) => b.setAttribute('aria-label', t('colorN', { hex: b.dataset.hex })));
  [...ui.presetBtns.children].forEach((b) => b.setAttribute('aria-label', t('presetN', { i: b.dataset.id })));
  [...ui.saveSlot.options].forEach((o) => { o.textContent = t('slotN', { i: o.value }); });
  if (app.state) renderState();
  else {
    ui.powerBtn.textContent = t('turnOn');
    ui.stripCaption.textContent = t(serial.connected ? 'captionReading' : 'captionIdle');
    ui.devInfo.textContent = '';
    renderStrip();
  }
}

function buildStrip(n) {
  app.ledCount = n;
  ui.strip.style.setProperty('--n', n);
  ui.strip.replaceChildren(...Array.from({ length: n }, () => {
    const d = document.createElement('div'); d.className = 'led'; return d;
  }));
}

function renderStrip() {
  const n = app.leds.length || app.ledCount;
  if (ui.strip.children.length !== n) buildStrip(n);
  const st = app.state;
  const on = !!st?.on && app.leds.length > 0;
  const k = on ? Math.max(0.15, (st.bri ?? 255) / 255) : 0;
  let sr = 0, sg = 0, sb = 0;
  [...ui.strip.children].forEach((el, i) => {
    const v = app.leds[i] ?? 0;
    const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
    if (on && (r | g | b)) {
      const c = `${Math.round(r * k)} ${Math.round(g * k)} ${Math.round(b * k)}`;
      if (el.style.getPropertyValue('--c') !== c) el.style.setProperty('--c', c);
      el.style.setProperty('--a', (0.35 + 0.55 * k).toFixed(2));
      el.classList.add('lit');
      sr += r; sg += g; sb += b;
    } else {
      el.classList.remove('lit');
    }
  });
  const count = app.leds.length || 1;
  setGlow(on ? [sr / count, sg / count, sb / count] : null, k);
  ui.strip.setAttribute('aria-label', on ? t('stripOn', { n }) : t('stripOff'));
}

function setGlow(rgb, k = 0) {
  const root = document.documentElement.style;
  if (!rgb) { root.setProperty('--glow-k', 0); return; }
  root.setProperty('--glow', rgb.map(Math.round).join(' '));
  root.setProperty('--glow-k', (0.25 + 0.75 * k).toFixed(2));
}

function hex(rgb) { return '#' + rgb.slice(0, 3).map((x) => x.toString(16).padStart(2, '0')).join(''); }
function setAccent(rgb) {
  const root = document.documentElement.style;
  root.setProperty('--accent', hex(rgb));
  const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  root.setProperty('--on-accent', lum > 0.55 ? '#1b1f27' : '#ffffff');
}

function renderState() {
  const st = app.state, info = app.info || {};
  const seg = st.seg?.[0] || {};
  const col = seg.col?.[0] || [0, 0, 0];

  ui.powerBtn.setAttribute('aria-pressed', String(!!st.on));
  ui.powerBtn.textContent = t(st.on ? 'turnOff' : 'turnOn');
  if (!app.busy.has('bri')) { ui.bri.value = st.bri; ui.briOut.value = pct(st.bri); }
  if (!app.busy.has('color')) {
    ui.colorPick.value = hex(col);
    if (document.activeElement !== ui.colorHex) ui.colorHex.value = hex(col);
  }
  setAccent(col);
  markSwatch(hex(col));
  if (!app.busy.has('sx')) { ui.sx.value = seg.sx ?? 128; ui.sxOut.value = ui.sx.value; }
  if (!app.busy.has('ix')) { ui.ix.value = seg.ix ?? 128; ui.ixOut.value = ui.ix.value; }
  if (document.activeElement !== ui.pal) ui.pal.value = seg.pal ?? 0;
  markFx(seg.fx ?? 0);
  [...ui.presetBtns.children].forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.id) === st.ps)));

  const leds = info.leds || {};
  const fxName = EFFECTS.find(([id]) => id === seg.fx)?.[1] ?? `#${seg.fx}`;
  const n = leds.count ?? app.ledCount;
  ui.stripCaption.textContent = st.on
    ? t('captionOn', { n, fx: fxName, pwr: leds.pwr ?? '?', max: leds.maxpwr ?? '?' })
    : t('captionOff', { n });
  if (info.ver) ui.devInfo.textContent = t('devInfo', { ver: info.ver, rel: info.release ?? info.arch, up: fmtUptime(info.uptime) });
  renderStrip();
}

const pct = (b) => `${Math.round((b * 100) / 255)}%`;
function fmtUptime(s = 0) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? t('uptimeH', { h, m }) : t('uptimeM', { m });
}

// ------------------------------------------------------------------ controls
function markSwatch(h) {
  [...ui.swatches.children].forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.hex === h)));
}
function markFx(id) {
  ui.fxList.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.id) === id)));
}

function hexToRgb(h) {
  const m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function sendColor(rgb, key = 'color') {
  setAccent(rgb);
  markSwatch(hex(rgb));
  send({ on: true, seg: [{ fx: 0, col: [rgb] }] }, key);
}

function trackBusy(el, key) {
  el.addEventListener('pointerdown', () => app.busy.add(key));
  const done = () => setTimeout(() => app.busy.delete(key), 600);
  el.addEventListener('pointerup', done);
  el.addEventListener('change', done);
  el.addEventListener('blur', done);
}

function initControls() {
  ui.connectBtn.addEventListener('click', () => (serial.connected ? serial.close() : connect()));

  ui.powerBtn.addEventListener('click', () => {
    const on = ui.powerBtn.getAttribute('aria-pressed') !== 'true';
    ui.powerBtn.setAttribute('aria-pressed', String(on));
    ui.powerBtn.textContent = t(on ? 'turnOff' : 'turnOn');
    send({ on });
  });

  trackBusy(ui.bri, 'bri');
  ui.bri.addEventListener('input', () => {
    ui.briOut.value = pct(ui.bri.value);
    send({ on: true, bri: Number(ui.bri.value) }, 'bri');
  });

  trackBusy(ui.colorPick, 'color');
  ui.colorPick.addEventListener('input', () => {
    app.busy.add('color');
    ui.colorHex.value = ui.colorPick.value;
    ui.colorHex.removeAttribute('aria-invalid');
    sendColor(hexToRgb(ui.colorPick.value));
  });
  ui.colorHex.addEventListener('input', () => {
    const v = ui.colorHex.value.startsWith('#') ? ui.colorHex.value : '#' + ui.colorHex.value;
    const rgb = hexToRgb(v);
    if (rgb) { ui.colorHex.removeAttribute('aria-invalid'); ui.colorPick.value = hex(rgb); sendColor(rgb); }
    else ui.colorHex.setAttribute('aria-invalid', 'true');
  });

  SWATCHES.forEach((h) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'swatch'; b.dataset.hex = h;
    b.style.background = h;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      ui.colorPick.value = h; ui.colorHex.value = h;
      sendColor(hexToRgb(h), null);
    });
    ui.swatches.append(b);
  });

  PALETTES.forEach(([id, name]) => ui.pal.add(new Option(name, id)));
  ui.pal.addEventListener('change', () => send({ seg: [{ pal: Number(ui.pal.value) }] }));

  EFFECTS.forEach(([id, name]) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.id = id; b.dataset.name = name.toLowerCase();
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span></span><small>${id}</small>`;
    b.firstChild.textContent = name;
    b.addEventListener('click', () => { markFx(id); send({ on: true, seg: [{ fx: id }] }); });
    li.append(b);
    ui.fxList.append(li);
  });
  ui.fxSearch.addEventListener('input', () => {
    const q = ui.fxSearch.value.trim().toLowerCase();
    let shown = 0;
    ui.fxList.querySelectorAll('li').forEach((li) => {
      const hit = !q || li.firstChild.dataset.name.includes(q) || li.firstChild.dataset.id === q;
      li.hidden = !hit; if (hit) shown++;
    });
    ui.fxEmpty.hidden = shown > 0;
  });

  for (const [el, out, key] of [[ui.sx, ui.sxOut, 'sx'], [ui.ix, ui.ixOut, 'ix']]) {
    trackBusy(el, key);
    el.addEventListener('input', () => {
      out.value = el.value;
      send({ seg: [{ [key]: Number(el.value) }] }, key);
    });
  }

  for (let i = 1; i <= PRESET_SLOTS; i++) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.id = i; b.textContent = i;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => { send({ ps: i }); setTimeout(requestState, 1000); });
    ui.presetBtns.append(b);
    ui.saveSlot.add(new Option('', i));
  }
  ui.saveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(ui.saveSlot.value);
    const n = ui.saveName.value.trim() || t('slotN', { i: id });
    send({ psave: id, n, ib: true, sb: true });
    setStatus('statusSaved', 'on', { id, name: n });
    setTimeout(() => serial.connected && setStatus('statusConnected', 'on'), 3000);
    ui.saveName.value = '';
  });
}

// ------------------------------------------------------------------ boot
buildStrip(app.ledCount);
applyStatic();
ui.langBtn.lang = getLang() === 'vi' ? 'en' : 'vi';
ui.langBtn.addEventListener('click', () => {
  toggleLang();
  applyStatic();
  ui.langBtn.lang = getLang() === 'vi' ? 'en' : 'vi';
  renderDynamic();
});
if (!('serial' in navigator)) {
  ui.unsupported.hidden = false;
  ui.connectBtn.disabled = true;
  setStatus('statusUnsupported');
  renderDynamic();
} else {
  initControls();
  renderDynamic();
  navigator.serial.addEventListener('disconnect', (e) => { if (e.target === serial.port) serial.close(true); });
  navigator.serial.addEventListener('connect', () => {
    if (!serial.connected) setStatus('statusPlugged');
  });
}
