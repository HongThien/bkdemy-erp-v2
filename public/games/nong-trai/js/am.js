/* Nông Trại BK — ÂM THANH tổng hợp bằng WebAudio (không cần file âm thanh). NT_AM.on('pop'|'soat'|'xu'|'tim'|'gau'|'sao'|'lenCap'|'bam'|'loi'|'xe'|'xay') */
(function () {
'use strict';
let ctx = null, tat = false, cuoi = {};
try { tat = localStorage.getItem('nt_tat_tieng') === '1'; } catch (e) {}
function c() {
  if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function not(a, f, t0, dai, kieu, am, f2) {
  const o = a.createOscillator(), g = a.createGain();
  o.type = kieu || 'sine'; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dai);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(am || 0.15, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dai);
  o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dai + 0.02);
}
function on(kieu) {
  if (tat) return;
  const bay = performance.now(); if (cuoi[kieu] && bay - cuoi[kieu] < 45) return; cuoi[kieu] = bay; // vuốt nhanh không dồn tiếng
  const a = c(); if (!a) return; const t = a.currentTime;
  switch (kieu) {
    case 'pop': not(a, 420 + Math.random() * 120, t, 0.09, 'sine', 0.16, 900); break;
    case 'soat': not(a, 1400 + Math.random() * 300, t, 0.07, 'triangle', 0.07, 700); not(a, 700, t + 0.02, 0.06, 'sine', 0.06, 1100); break;
    case 'xu': not(a, 988, t, 0.08, 'square', 0.05); not(a, 1319, t + 0.07, 0.16, 'square', 0.05); break;
    case 'gau': not(a, 560, t, 0.07, 'sawtooth', 0.07, 250); not(a, 520, t + 0.11, 0.08, 'sawtooth', 0.06, 230); break; // chó sủa gâu gâu
    case 'tim': not(a, 660, t, 0.1, 'sine', 0.12, 990); not(a, 880, t + 0.08, 0.12, 'sine', 0.1, 1320); break;
    case 'sao': not(a, 1047, t, 0.08, 'triangle', 0.08); not(a, 1568, t + 0.06, 0.12, 'triangle', 0.07); break;
    case 'lenCap': [523, 659, 784, 1047, 1319].forEach((f, i) => not(a, f, t + i * 0.09, 0.22, 'triangle', 0.12)); break;
    case 'bam': not(a, 720, t, 0.05, 'sine', 0.08); break;
    case 'loi': not(a, 220, t, 0.18, 'sawtooth', 0.05, 160); break;
    case 'xe': not(a, 160, t, 0.35, 'sawtooth', 0.035, 110); not(a, 660, t + 0.05, 0.08, 'square', 0.04); not(a, 660, t + 0.18, 0.08, 'square', 0.04); break;
    case 'xay': for (let i = 0; i < 3; i++) not(a, 300 + i * 40, t + i * 0.12, 0.07, 'square', 0.05, 200); break;
  }
}
function doiTat() { tat = !tat; try { localStorage.setItem('nt_tat_tieng', tat ? '1' : '0'); } catch (e) {} if (!tat) on('bam'); return tat; }
window.NT_AM = { on, doiTat, get tat() { return tat; } };
})();
