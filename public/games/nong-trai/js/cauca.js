/* Nông Trại BK — CÂU CÁ (Thùy 14/11). Chạm cầu gỗ / ghế / biển "Câu cá" bên hồ ⇒ NT_CAUCA.mo().
   Bảng: lượt còn hôm nay · nút Thả câu · bảng bậc cá · SỔ TAY CÁ (20 loài, loài chưa câu được hiện bóng "???").
   Trò chơi 2 pha (vẽ bằng canvas 2D):
     1. VÒNG TRÒN — 1 vòng cố định + 1 vòng co giãn; bấm lúc 2 vòng sát nhau thì cá dính câu. Được hụt 1 lần.
     2. THANH NGANG — cá chạy qua lại trên thanh; bấm lúc cá ở vùng giữa thì kéo được cá. Bấm 1 lần.
   Chuẩn tâm cả 2 pha ⇒ "Tuyệt!" (cá nặng hơn, chỉ để ghi kỷ lục). Độ khó theo bậc cá (NT_DATA.CAU.bac).
   KHÔNG chứa luật: lượt, con cá nào cắn, cân nặng, kho đều ở engine (cauTT / cauNem / cauXong). File này chỉ vẽ và báo kết quả 0 / 1 / 2. */
(function () {
'use strict';
const D = NT_DATA, E = NT_ENGINE, S = NT_SCENE, AM = NT_AM, CA = D.CA, CAU = D.CAU;
const BAC = {}; for (const b of CAU.bac) BAC[b.id] = b;
const kgChu = kg => kg.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' kg';

// ---------- HÌNH CON CÁ (vẽ bằng code — 1 hàm, mỗi loài 1 dòng màu) ----------
// c1 lưng · c2 bụng · c3 vây, đuôi · cao = dày thân / dài · kieu: soc (sọc đứng) | dom (đốm) · rau: độ dài râu · sang: viền sáng · sung: sừng rồng · vay: độ cao vây lưng
const VE = {
  ca_ro:        { c1: '#7d8f52', c2: '#dedba6', c3: '#6b7a40', cao: 0.52, kieu: 'soc', m2: '#55663a' },
  ca_diec:      { c1: '#aab4bc', c2: '#f3f6f8', c3: '#8e99a3', cao: 0.56 },
  ca_bong:      { c1: '#a58a62', c2: '#eadbb8', c3: '#8a7048', cao: 0.32, kieu: 'dom', m2: '#6e5636' },
  ca_ro_phi:    { c1: '#6f8a94', c2: '#e2ecef', c3: '#b0546a', cao: 0.52, kieu: 'soc', m2: '#4f6770' },
  ca_troi:      { c1: '#8aa0a8', c2: '#f0f5f6', c3: '#d9785c', cao: 0.4 },
  ca_me:        { c1: '#c3ced5', c2: '#ffffff', c3: '#9aa7b0', cao: 0.5 },
  ca_chep:      { c1: '#b58a3c', c2: '#f3e2ac', c3: '#d9703c', cao: 0.48, rau: 0.12 },
  ca_tre:       { c1: '#4b4a52', c2: '#a3a1ac', c3: '#3a3940', cao: 0.3, rau: 0.34, vay: 0.5 },
  ca_loc:       { c1: '#4f5a3a', c2: '#cdcda4', c3: '#3d4630', cao: 0.28, kieu: 'dom', m2: '#2f3822', vay: 0.6 },
  ca_tram:      { c1: '#6f8f6a', c2: '#e6eedb', c3: '#5a7a55', cao: 0.36 },
  ca_that_lat:  { c1: '#aeb9c4', c2: '#f6f9fb', c3: '#8794a2', cao: 0.46, vay: 0.4 },
  ca_lang:      { c1: '#7a6f8f', c2: '#e8e2f0', c3: '#5e5475', cao: 0.3, rau: 0.3 },
  ca_chep_vang: { c1: '#ffb81f', c2: '#fff2ae', c3: '#ff8a1f', cao: 0.48, rau: 0.12, sang: '#ffe27a' },
  ca_koi:       { c1: '#ffffff', c2: '#fff5ee', c3: '#ff5a3c', cao: 0.42, kieu: 'dom', m2: '#ff5a3c', domTo: 1, rau: 0.1 },
  ca_hoi:       { c1: '#8f9dab', c2: '#ffd9d0', c3: '#e87a8a', cao: 0.36, kieu: 'dom', m2: '#4a5560' },
  ca_tam:       { c1: '#5a6672', c2: '#d2d9de', c3: '#48525c', cao: 0.24, kieu: 'soc', m2: '#8b97a3', rau: 0.1, vay: 0.5 },
  ca_anh_vu:    { c1: '#7a5fb0', c2: '#ebe1fb', c3: '#e85a9a', cao: 0.42, sang: '#d9c2ff' },
  ca_rong:      { c1: '#e83a3a', c2: '#ffb98a', c3: '#c41f2f', cao: 0.3, rau: 0.28, vay: 1.25, sang: '#ffb0a0' },
  ca_hoa_rong:  { c1: '#ffcf3a', c2: '#fff4b6', c3: '#e8553d', cao: 0.4, rau: 0.36, vay: 1.3, sung: 1, sang: '#fff0a0' },
  ca_than:      { c1: '#3ad6e8', c2: '#e3fcff', c3: '#7a6fff', cao: 0.45, vay: 1.2, sang: '#b8f6ff', sao: 1 },
};
// vẽ con cá dài L, tâm (cx, cy), huong = 1 quay phải / −1 quay trái; bong = chỉ vẽ bóng đen (chưa biết loài)
function veCa(g, id, cx, cy, L, huong, bong, vay) {
  const V = VE[id] || VE.ca_ro, a = L / 2, b = L * V.cao / 2, to = c => bong ? bong : c, lac = Math.sin(vay || 0) * 0.25;
  g.save(); g.translate(cx, cy); g.scale(huong || 1, 1);
  if (V.sang && !bong) { g.shadowColor = V.sang; g.shadowBlur = L * 0.22; }
  // đuôi (lắc theo vay) + vây lưng + vây bụng
  g.fillStyle = to(V.c3);
  g.save(); g.translate(-a * 0.7, 0); g.rotate(lac); g.beginPath(); g.moveTo(0, 0); g.lineTo(-a * 0.42, -Math.max(b, a * 0.3) * 0.95); g.quadraticCurveTo(-a * 0.2, 0, -a * 0.42, Math.max(b, a * 0.3) * 0.95); g.closePath(); g.fill(); g.restore();
  g.beginPath(); g.moveTo(-a * 0.3, -b * 0.8); g.quadraticCurveTo(-a * 0.05, -b * 0.9 - a * 0.3 * (V.vay || 1), a * 0.35, -b * 0.78); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-a * 0.1, b * 0.82); g.lineTo(a * 0.02, b * 0.9 + a * 0.16); g.lineTo(a * 0.25, b * 0.8); g.closePath(); g.fill();
  if (V.sung && !bong) { g.strokeStyle = V.c3; g.lineWidth = L * 0.035; g.lineCap = 'round'; for (const k of [0.45, 0.6]) { g.beginPath(); g.moveTo(a * k, -b * 0.75); g.quadraticCurveTo(a * (k - 0.05), -b - a * 0.22, a * (k - 0.22), -b - a * 0.26); g.stroke(); } }
  // thân
  let mau = bong;
  if (!bong) { mau = g.createLinearGradient(0, -b, 0, b); mau.addColorStop(0, V.c1); mau.addColorStop(0.55, V.c1); mau.addColorStop(1, V.c2); }
  g.fillStyle = mau; g.beginPath(); g.ellipse(0, 0, a * 0.86, b, 0, 0, 6.2832); g.fill();
  g.shadowBlur = 0;
  if (!bong) {
    g.save(); g.beginPath(); g.ellipse(0, 0, a * 0.86, b, 0, 0, 6.2832); g.clip();
    if (V.kieu === 'soc') { g.fillStyle = V.m2; g.globalAlpha = 0.55; for (let i = -2; i <= 2; i++) g.fillRect(i * a * 0.24 - a * 0.045, -b, a * 0.09, b * 1.25); }
    if (V.kieu === 'dom') { g.fillStyle = V.m2; g.globalAlpha = V.domTo ? 0.95 : 0.6; const n = V.domTo ? 4 : 9; for (let i = 0; i < n; i++) { const x = -a * 0.6 + (i / (n - 1)) * a * 1.1, y = -b * 0.45 + ((i * 37) % 10) / 10 * b * 0.7; g.beginPath(); g.ellipse(x, y, V.domTo ? a * 0.17 : a * 0.05, V.domTo ? b * 0.42 : a * 0.045, i, 0, 6.2832); g.fill(); } }
    if (V.sao) { g.fillStyle = '#ffffff'; g.globalAlpha = 0.9; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-a * 0.55 + i * a * 0.2, -b * 0.3 + ((i * 53) % 10) / 10 * b * 0.7, a * 0.03, 0, 6.2832); g.fill(); } }
    g.globalAlpha = 0.28; g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(-a * 0.05, -b * 0.5, a * 0.5, b * 0.2, 0, 0, 6.2832); g.fill();   // ánh sáng trên lưng
    g.restore();
    g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = Math.max(1, L * 0.018); g.beginPath(); g.arc(a * 0.42, 0, b * 0.72, -1.05, 1.05); g.stroke();   // mang
    g.fillStyle = V.c3; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(a * 0.22, b * 0.1); g.lineTo(a * 0.02, b * 0.55); g.lineTo(a * 0.3, b * 0.38); g.closePath(); g.fill(); g.globalAlpha = 1;   // vây ngực
    const rm = Math.max(L * 0.045, 2.2); g.fillStyle = '#fff'; g.beginPath(); g.arc(a * 0.6, -b * 0.22, rm, 0, 6.2832); g.fill(); g.fillStyle = '#1c1c22'; g.beginPath(); g.arc(a * 0.62, -b * 0.22, rm * 0.58, 0, 6.2832); g.fill();
    if (V.rau) { g.strokeStyle = V.c3; g.lineWidth = Math.max(1, L * 0.02); g.lineCap = 'round'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(a * 0.8, b * 0.15); g.quadraticCurveTo(a * (0.85 + V.rau), b * 0.15 + s * b * 0.5, a * (0.8 + V.rau * 0.5), b * 0.3 + s * a * V.rau); g.stroke(); } }
  }
  g.restore();
}
const ICON = {};
function icon(id, bong) {
  if (!CA[id]) return '';
  const k = id + (bong ? '|b' : '');
  if (!ICON[k]) { const c = document.createElement('canvas'); c.width = c.height = 96; veCa(c.getContext('2d'), id, 52, 48, 70, 1, bong ? '#b8a88a' : null); ICON[k] = c.toDataURL(); }
  return ICON[k];
}

// ---------- KHUNG ----------
let lop = null, G = null, raf = 0, tTruoc = 0;
const st = () => NT_UI.s;
function khung() {
  if (lop) return lop;
  lop = document.createElement('div'); lop.id = 'cauCa'; lop.className = 'an'; document.body.appendChild(lop);
  return lop;
}
function dong() { dung(); if (lop) { lop.className = 'an'; lop.innerHTML = ''; } S.phao && S.phao(0); }
function dung() { if (raf) cancelAnimationFrame(raf); raf = 0; G = null; }

// ---------- BẢNG CÂU CÁ + SỔ TAY ----------
function mo() {
  if (NT_UI.xem != null) return NT_UI.thongBao('Về nhà mình rồi mới câu cá được nhé');
  dung(); const s = st(), tt = E.cauTT(s), so = s.ca || {}, tong = Object.keys(CA).length, co = Object.keys(CA).filter(id => so[id]).length;
  const moi = Array.from({ length: tt.luot }, (_, i) => `<i class="${i < tt.con ? 'con' : ''}">🪱</i>`).join('');
  let html = `<div class="ccBang"><div class="ccDau"><b>🎣 Câu cá</b><button class="ccDong" aria-label="Đóng">✕</button></div><div class="ccThan">
    <div class="ccTren"><div class="ccLuot"><div class="ccMoi">${moi}</div><span>${tt.con > 0 ? `Hôm nay còn <b>${tt.con}/${tt.luot}</b> lượt câu` : 'Hôm nay hết lượt rồi — mai câu tiếp nhé'}</span></div>
      <button class="nut ccTha${tt.con > 0 ? '' : ' xam'}" ${tt.con > 0 ? '' : 'disabled'}>🎣 Thả câu</button></div>
    <div class="ccBacDs">${CAU.bac.map(b => `<span class="ccBac" style="--m:${b.mau}"><b>${b.ten}</b> ${Math.round(b.p * 100)}% · bán ${b.gia} EXP</span>`).join('')}</div>
    <div class="muc">📖 Sổ tay cá <span class="nho">· đã câu được ${co}/${tong} loài</span></div>`;
  for (const b of CAU.bac) {
    const ds = Object.values(CA).filter(c => c.bac === b.id);
    html += `<div class="ccNhom" style="--m:${b.mau}"><span>${b.ten}</span><i>${ds.filter(c => so[c.id]).length}/${ds.length}</i></div><div class="ccLuoi">` + ds.map(c => {
      const x = so[c.id];
      return x ? `<div class="ccThe co" style="--m:${b.mau}"><img src="${icon(c.id)}" alt=""><b>${c.ten}</b><span>×${x.n} · to nhất ${kgChu(x.kg)}</span></div>`
        : `<div class="ccThe" style="--m:${b.mau}"><img src="${icon(c.id, true)}" alt=""><b>???</b><span>chưa câu được</span></div>`;
    }).join('') + '</div>';
  }
  html += `<p class="nho">Cá câu được vào Kho, mang ra Chợ bán lấy EXP. Bấm chuẩn tâm cả 2 lần thì được con to hơn.</p></div></div>`;
  const el = khung(); el.className = ''; el.innerHTML = html;
  el.querySelector('.ccDong').onclick = dong;
  el.querySelector('.ccTha').onclick = thaCau;
  el.onpointerdown = e => { if (e.target === el) dong(); };
}

// ---------- TRÒ CHƠI ----------
function thaCau() {
  const s = st(), kq = E.cauNem(s);
  if (!kq.ok) { NT_UI.thongBao(kq.loi); AM.on('loi'); return mo(); }
  E.luu(s); AM.on('bam');
  const el = khung(); el.className = ''; el.onpointerdown = null;
  el.innerHTML = `<div class="ccChoi"><canvas></canvas><button class="ccBo">Bỏ câu</button><div class="ccKet an"></div></div>`;
  const cv = el.querySelector('canvas'), hop = el.querySelector('.ccChoi'), W = hop.clientWidth, H = hop.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext('2d'); g.scale(dpr, dpr);
  G = { g, W, H, pha: 'cho', t: 0, tg: 0, ca: kq.ca, bac: kq.bac, cho: 0.9 + Math.random() * 1.3, hut: 0, c1: false, c2: false, loi: '', tLoi: 0, pha0: Math.random() * 6.28 };
  S.phao && S.phao(1);
  cv.onpointerdown = e => { e.preventDefault(); bam(); };
  el.querySelector('.ccBo').onclick = () => ket(false, 'Em đã thu cần');
  tTruoc = performance.now(); raf = requestAnimationFrame(vong);
}
function vong(now) { if (!G) return; const dt = Math.min(0.05, (now - tTruoc) / 1000); tTruoc = now; buoc(dt); if (G) raf = requestAnimationFrame(vong); }
const bkVong = () => 1.12 + 0.78 * Math.sin(G.t * G.bac.vong + G.pha0);          // bán kính vòng động ÷ vòng cố định: 0,34 … 1,9
const viTriCa = () => { const u = (G.t / G.bac.chay) % 2; return u < 1 ? u : 2 - u; };   // 0 … 1 dọc thanh, chạy qua lại
function noi(chu) { G.loi = chu; G.tLoi = 1.1; }
function buoc(dt) {
  G.t += dt; G.tg += dt; if (G.tLoi > 0) G.tLoi -= dt;
  if (G.pha === 'cho' && G.t >= G.cho) { G.pha = 'vong'; G.t = 0; S.phao && S.phao(2); AM.on('pop'); noi('❗ Cá cắn câu!'); }
  else if (G.pha === 'vong' && G.t > 12) return ket(false, 'Cá ăn hết mồi rồi bơi mất');
  else if (G.pha === 'noi' && G.t > 0.7) { G.pha = 'thanh'; G.t = 0; }
  else if (G.pha === 'thanh' && G.t > G.bac.chay * 9) return ket(false, 'Cá giật đứt dây rồi');
  ve();
}
function bam() {
  if (!G) return;
  if (G.pha === 'vong') {
    const d = Math.abs(bkVong() - 1);
    if (d <= G.bac.sai) { G.c1 = d <= G.bac.sai * 0.4; G.pha = 'noi'; G.t = 0; AM.on('soat'); noi(G.c1 ? '⭐ Tuyệt! Cá dính câu' : '👍 Cá dính câu rồi'); }
    else if (++G.hut >= 2) ket(false, 'Giật hụt 2 lần — cá sổng mất');
    else { AM.on('loi'); noi('Hụt! Còn 1 lần nữa'); }
  } else if (G.pha === 'thanh') {
    const d = Math.abs(viTriCa() - 0.5);
    if (d <= G.bac.vung / 2) { G.c2 = d <= G.bac.vung * 0.18; ket(true); }
    else ket(false, 'Kéo lệch — cá thoát mất');
  }
}
function ve() {
  const { g, W, H } = G, cx = W / 2, cy = H * 0.52;
  // mặt nước
  const nen = g.createLinearGradient(0, 0, 0, H); nen.addColorStop(0, '#8fdcf5'); nen.addColorStop(1, '#2e8fc4'); g.fillStyle = nen; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 2;
  for (let i = 0; i < 4; i++) { const k = (G.tg * 0.25 + i / 4) % 1; g.globalAlpha = 1 - k; g.beginPath(); g.ellipse(cx, cy, 40 + k * W * 0.5, (40 + k * W * 0.5) * 0.42, 0, 0, 6.2832); g.stroke(); }
  g.globalAlpha = 1; g.textAlign = 'center'; g.textBaseline = 'middle';
  const chu = (t, y, co, mau) => { g.font = `800 ${co}px "Baloo 2", system-ui, sans-serif`; g.lineJoin = 'round'; g.lineWidth = co * 0.28; g.strokeStyle = 'rgba(20,60,90,.55)'; g.strokeText(t, cx, y); g.fillStyle = mau || '#fff'; g.fillText(t, cx, y); };
  if (G.pha === 'cho') {
    const y = cy + Math.sin(G.tg * 3) * 5;   // phao nhấp nhô
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, y + 6, 15, 0, 3.1416); g.fill(); g.fillStyle = '#ff4a3c'; g.beginPath(); g.arc(cx, y + 6, 15, 3.1416, 6.2832); g.fill();
    g.strokeStyle = '#333'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, y - 9); g.lineTo(cx, y - 30); g.stroke();
    chu('Chờ cá cắn câu…', H * 0.16, 24);
  } else if (G.pha === 'vong' || G.pha === 'noi') {
    const R0 = Math.min(H * 0.25, 84), k = G.pha === 'noi' ? 1 : bkVong(), trung = Math.abs(k - 1) <= G.bac.sai;
    veCa(g, G.ca, cx, cy, R0 * 1.15, 1, 'rgba(16,58,84,.55)', G.tg * 7);
    g.lineWidth = 7; g.strokeStyle = '#ffffff'; g.beginPath(); g.arc(cx, cy, R0, 0, 6.2832); g.stroke();
    g.lineWidth = 6; g.strokeStyle = trung ? '#8dff6e' : '#ffd23f'; g.beginPath(); g.arc(cx, cy, R0 * k, 0, 6.2832); g.stroke();
    chu(G.pha === 'noi' ? 'Chuẩn bị kéo…' : 'Bấm khi 2 vòng tròn chạm nhau!', H * 0.1, 22);
    if (G.hut) chu('Còn 1 lần hụt', H * 0.93, 16, '#ffe9a8');
  } else if (G.pha === 'thanh') {
    const BW = W * 0.8, x0 = (W - BW) / 2, y = cy + 6, h = 40, zw = BW * G.bac.vung, p = viTriCa(), u = (G.t / G.bac.chay) % 2;
    g.fillStyle = 'rgba(12,52,80,.5)'; rr(g, x0 - 6, y - h / 2 - 6, BW + 12, h + 12, 26); g.fill();
    g.fillStyle = '#e9f7ff'; rr(g, x0, y - h / 2, BW, h, 20); g.fill();
    g.fillStyle = '#7fe060'; rr(g, cx - zw / 2, y - h / 2, zw, h, 8); g.fill();
    g.fillStyle = '#ffd23f'; rr(g, cx - zw * 0.18, y - h / 2, zw * 0.36, h, 6); g.fill();
    veCa(g, G.ca, x0 + p * BW, y, 62, u < 1 ? 1 : -1, '#1f5c7c', G.tg * 16);
    g.fillStyle = '#ff4a3c'; g.beginPath(); g.moveTo(x0 + p * BW, y - h / 2 - 4); g.lineTo(x0 + p * BW - 9, y - h / 2 - 20); g.lineTo(x0 + p * BW + 9, y - h / 2 - 20); g.closePath(); g.fill();
    chu('Bấm khi cá bơi vào GIỮA!', H * 0.14, 24);
  }
  if (G.tLoi > 0) { g.globalAlpha = Math.min(1, G.tLoi * 2.5); chu(G.loi, H * 0.82, 26, '#fff7c2'); g.globalAlpha = 1; }
}
function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------- KẾT QUẢ ----------
function ket(duoc, lyDo) {
  if (!G) return;
  const s = st(), diem = duoc ? (G.c1 && G.c2 ? 2 : 1) : 0;
  if (raf) cancelAnimationFrame(raf); raf = 0; G = null;
  const kq = E.cauXong(s, diem); NT_UI.lam(kq);
  S.phao && S.phao(duoc ? 3 : 0);
  const su = kq.ok && kq.su.find(e => e.loai === 'ca'), tt = E.cauTT(s), hop = lop && lop.querySelector('.ccKet'); if (!hop) return;
  let html;
  if (su) {
    const C = CA[su.id], b = BAC[C.bac]; AM.on(b.p <= 0.05 ? 'lenCap' : 'sao');
    html = `<div class="ccQua" style="--m:${b.mau}">${diem === 2 ? '<div class="ccTuyet">⭐ Tuyệt!</div>' : ''}<img src="${icon(su.id)}" alt=""><b>${C.ten}</b><span class="ccBac">${b.ten}</span>
      <div class="ccSo">${kgChu(su.kg)}${su.kyLuc && !su.moi ? ' · 🏆 kỷ lục mới' : ''}</div>${su.moi ? '<div class="ccMoiLoai">✨ Loài mới — đã ghi vào Sổ tay cá</div>' : ''}
      <div class="nho">Đã cất vào Kho · bán ở Chợ được ${b.gia} EXP</div>`;
  } else { AM.on('loi'); html = `<div class="ccQua hut"><div class="ccHut">💨</div><b>${lyDo || 'Cá sổng mất rồi'}</b><div class="nho">Không sao — lượt sau bấm đúng nhịp là được</div>`; }
  html += `<div class="dongNut">${tt.con > 0 ? `<button class="nut" data-l="tiep">🎣 Câu tiếp (còn ${tt.con})</button>` : ''}<button class="nut vang" data-l="so">📖 Sổ tay cá</button><button class="nut xam" data-l="xong">Xong</button></div></div>`;
  hop.innerHTML = html; hop.classList.remove('an'); const bo = lop.querySelector('.ccBo'); if (bo) bo.remove();
  const nut = l => hop.querySelector(`[data-l=${l}]`);
  if (nut('tiep')) nut('tiep').onclick = thaCau;
  nut('so').onclick = mo; nut('xong').onclick = dong;
}

window.NT_CAUCA = { mo, dong, icon, veCa, _G: () => G, _buoc: dt => G && buoc(dt), _bam: bam };
})();
