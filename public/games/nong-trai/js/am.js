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
/* ===== NHẠC NỀN — tự soạn, phát bằng WebAudio (không file). Nhiều bài, hết bài này sang bài kế, lặp vô hạn.
   Mỗi bài: tempo (nhịp/phút) · dich (dịch giọng, nửa cung) · dem ('bum' = trầm phách 1·3 + hợp âm phách 2·4 | 'rai' = rải hợp âm) ·
   khuc {tên: [8 ô nhịp giai điệu, 8 hợp âm]} · thuTu (thứ tự các khúc). Giai điệu ghi theo nốt móc đơn (số MIDI viết ở giọng Đô, 0 = nghỉ).
   THÊM BÀI = thêm 1 mục vào DS_BAI. */
const HA = { C: [48, 64, 67, 72], Am: [45, 64, 69, 72], F: [41, 65, 69, 72], G: [43, 62, 67, 71], Dm: [50, 62, 65, 69], Em: [40, 64, 67, 71] }; // [trầm, 3 nốt hợp âm]
const DS_BAI = [
  { ten: 'Ra đồng', tempo: 104, dich: 0, dem: 'bum', thuTu: 'AABA', khuc: {
    A: [[[76,0,79,0,76,74,72,0], [69,0,72,0,76,0,74,72], [69,0,72,0,77,76,74,0], [74,0,71,0,67,0,0,0],
         [76,0,79,0,84,0,79,0], [81,79,76,0,72,0,76,0], [77,0,76,74,72,0,74,0], [76,74,0,72,0,0,0,0]], ['C','Am','F','G','C','Am','F','C']],
    B: [[[72,0,77,0,81,0,79,77], [76,0,79,0,76,0,72,0], [69,72,77,0,81,0,77,0], [79,0,74,0,71,0,74,0],
         [76,0,81,0,76,0,72,0], [77,0,81,0,77,76,74,0], [74,0,77,0,81,0,77,0], [79,0,0,0,71,74,79,0]], ['F','C','F','G','Am','F','Dm','G']] } },
  { ten: 'Chiều êm', tempo: 84, dich: -3, dem: 'rai', thuTu: 'AABA', khuc: {
    A: [[[72,0,0,76,79,0,0,0], [74,0,0,79,74,0,71,0], [72,0,0,76,81,0,0,0], [81,0,77,0,72,0,0,0],
         [76,0,0,79,84,0,0,0], [83,0,79,0,74,0,79,0], [81,0,79,77,76,0,74,0], [72,0,0,0,0,0,0,0]], ['C','G','Am','F','C','G','F','C']],
    B: [[[76,0,81,0,84,0,81,0], [79,0,76,0,71,0,76,0], [77,0,81,0,84,0,81,0], [79,0,0,76,72,0,0,0],
         [81,0,77,0,81,0,84,0], [79,0,76,0,79,0,84,0], [86,0,84,81,77,0,81,0], [79,0,0,0,74,0,71,0]], ['Am','Em','F','C','F','C','Dm','G']] } },
  { ten: 'Gà con chạy', tempo: 120, dich: 2, dem: 'bum', thuTu: 'ABA', khuc: {
    A: [[[72,76,79,76,72,76,79,0], [77,81,84,81,77,0,81,0], [79,0,76,0,72,0,76,79], [74,0,71,74,79,0,0,0],
         [72,76,79,76,84,0,79,0], [81,0,84,81,77,0,81,0], [79,77,74,71,74,0,77,0], [72,0,76,0,72,0,0,0]], ['C','F','C','G','C','F','G','C']],
    B: [[[81,0,76,0,72,76,81,0], [77,0,74,0,69,74,77,0], [79,0,74,0,71,74,79,0], [76,0,79,0,84,0,0,0],
         [81,84,81,0,76,0,72,0], [77,81,77,0,74,0,69,0], [74,0,79,0,83,0,79,0], [86,0,83,0,79,0,74,0]], ['Am','Dm','G','C','Am','Dm','G','G']] } },
  { ten: 'Lúa chín', tempo: 96, dich: 5, dem: 'rai', thuTu: 'AABA', khuc: {
    A: [[[67,0,69,72,0,74,76,0], [79,0,76,74,72,0,0,0], [69,0,72,74,0,76,81,0], [79,0,76,0,72,0,69,0],
         [72,0,69,72,0,74,72,0], [74,0,79,0,74,0,67,0], [72,0,74,76,0,79,81,0], [84,0,0,0,79,0,0,0]], ['C','C','Am','Am','F','G','C','C']],
    B: [[[74,0,69,0,74,76,74,0], [79,0,74,0,67,0,74,0], [76,0,79,0,84,0,79,76], [81,0,0,76,72,0,69,0],
         [74,0,76,0,81,0,76,0], [74,0,79,0,86,0,79,0], [84,0,81,79,76,0,74,0], [72,0,0,0,0,0,0,0]], ['Dm','G','C','Am','Dm','G','C','C']] } },
];
DS_BAI.forEach(b => { // trải các khúc thành 1 dãy nốt + 1 dãy hợp âm theo ô nhịp
  b.not = []; b.ha = []; b.moc = 60 / b.tempo / 2;
  for (const k of b.thuTu) { b.khuc[k][0].forEach(o => b.not.push(...o)); b.ha.push(...b.khuc[k][1]); }
});
let iBai = Math.floor(Math.random() * DS_BAI.length); // mỗi lần mở game bắt đầu ở 1 bài khác
let tatNhac = false, nhacTong = null, nhacHen = null, buoc = 0, tKe = 0;
try { tatNhac = localStorage.getItem('nt_tat_nhac') === '1'; } catch (e) {}
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function notNhac(a, m, t0, dai, kieu, am) {
  const o = a.createOscillator(), g = a.createGain();
  o.type = kieu; o.frequency.setValueAtTime(hz(m), t0);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(am, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dai);
  o.connect(g).connect(nhacTong); o.start(t0); o.stop(t0 + dai + 0.03);
}
function xepNhac() {
  const a = ctx; if (!a || !nhacTong) return;
  if (tKe < a.currentTime) tKe = a.currentTime + 0.08; // vừa quay lại tab / máy khựng ⇒ chơi tiếp từ bây giờ, không dồn nốt
  while (tKe < a.currentTime + 0.5) {
    const b = DS_BAI[iBai], MOC = b.moc, i = buoc, trongO = i % 8, h = HA[b.ha[i >> 3]], m = b.not[i], d = b.dich;
    if (m) { let k = 1; while (k < 4 && i + k < b.not.length && !b.not[i + k]) k++; notNhac(a, m + d, tKe, MOC * k * 0.95 + 0.12, 'triangle', 0.075); }
    if (trongO === 0) notNhac(a, h[0] + d, tKe, MOC * 2.2, 'sine', 0.11);
    if (trongO === 4) notNhac(a, h[0] + 7 + d, tKe, MOC * 2.2, 'sine', 0.085);
    if (b.dem === 'rai') notNhac(a, h[[1, 2, 3, 2][trongO % 4]] + d, tKe, MOC * 1.8, 'sine', 0.04);
    else if (trongO === 2 || trongO === 6) for (let j = 1; j < 4; j++) notNhac(a, h[j] + d, tKe, MOC * 1.3, 'sine', 0.028);
    buoc++; tKe += MOC;
    if (buoc >= b.not.length) { buoc = 0; iBai = (iBai + 1) % DS_BAI.length; tKe += 1.6; } // hết bài ⇒ nghỉ 1 nhịp rồi sang bài kế
  }
}
function batNhac() {
  if (tatNhac || nhacHen || document.hidden) return;
  const a = c(); if (!a) return;
  if (!nhacTong) { // nhạc đi qua 1 nút âm lượng riêng + lọc bớt tiếng chói ⇒ êm, không lấn tiếng bấm
    nhacTong = a.createGain(); const loc = a.createBiquadFilter(); loc.type = 'lowpass'; loc.frequency.value = 2600;
    nhacTong.connect(loc).connect(a.destination);
  }
  nhacTong.gain.cancelScheduledValues(a.currentTime); nhacTong.gain.setValueAtTime(0.0001, a.currentTime); nhacTong.gain.exponentialRampToValueAtTime(0.6, a.currentTime + 0.8);
  tKe = 0; xepNhac(); nhacHen = setInterval(xepNhac, 120);
}
function dungNhac() {
  if (nhacHen) { clearInterval(nhacHen); nhacHen = null; }
  if (ctx && nhacTong) { nhacTong.gain.cancelScheduledValues(ctx.currentTime); nhacTong.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08); }
}
function doiTatNhac() { tatNhac = !tatNhac; try { localStorage.setItem('nt_tat_nhac', tatNhac ? '1' : '0'); } catch (e) {} if (tatNhac) dungNhac(); else batNhac(); return tatNhac; }
// Trình duyệt chỉ cho phát tiếng sau lần chạm đầu tiên ⇒ nhạc bắt đầu ở lần chạm/bấm phím đầu; rời tab thì ngừng, quay lại thì chơi tiếp.
function chamDau() { removeEventListener('pointerdown', chamDau, true); removeEventListener('keydown', chamDau, true); batNhac(); }
addEventListener('pointerdown', chamDau, true); addEventListener('keydown', chamDau, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) dungNhac(); else batNhac(); });
window.NT_AM = { on, doiTat, doiTatNhac, get baiNhac() { return DS_BAI[iBai].ten; }, get tat() { return tat; }, get tatNhac() { return tatNhac; } };
})();
