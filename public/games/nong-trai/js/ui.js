/* Nông Trại BK — NHỊP NGÀY: GIAO DIỆN. HUD (cấp · ví xu + EXP · điểm chăm chỉ · mùa · lượt giúp/hái), bong bóng bám vật 3D,
   các bảng (chợ, kho, bạn cùng lớp, hộp thư, lò bánh, lên cấp), sang vườn bạn, hướng dẫn.
   Mọi thay đổi state đi qua NT_ENGINE (hàm lam()). UI chỉ hiển thị & gọi hàm. */
(function () {
'use strict';
const D = NT_DATA, E = NT_ENGINE, S = NT_SCENE, M = NT_MODELS, AM = NT_AM, NV = NT_NV, L = D.LUAT;
const $ = id => document.getElementById(id);
let s = null, xem = null, neo = null, quet = null, bangMo = null, tDongBo = 0, tLuu = 0, tKiem = 0, tGiay = 9, ngayCu = null;
let cachTra = 'diem';                                    // gieo trả bằng 'diem' | 'exp' — nhớ lựa chọn gần nhất
// THANH DỤNG CỤ (kiểu Nông trại vui vẻ, CEO 30/09): cầm 1 dụng cụ rồi chạm / vuốt qua các ô. Tay = tự đoán việc cần làm.
let dung = 'tay', hatChon = null, keyCu = '';
const DUNG = [['tay', '👆', 'Tay'], ['gieo', '🌱', 'Gieo'], ['tuoi', '💧', 'Tưới'], ['sau', '🐛', 'Bắt sâu'], ['bon', null, 'Bón'], ['thu', '🧺', 'Thu']];
const ten = id => E.ten(id);
const img = (id, cls) => `<img src="${M.icon(id)}" alt="${ten(id)}"${cls ? ` class="${cls}"` : ''}>`;
const stXem = () => xem == null ? s : E.banTT(s, xem);
function dongBo() { const st = stXem(); S.dongBo(st, s); return st; }
const TEN_CHUONG = { ga: 'Chuồng gà', bo: 'Bãi cỏ bò' };

// ---------- hành động ----------
function lam(kq, chon) {
  if (!kq.ok) { if (kq.loi) { thongBao(kq.loi); AM.on('loi'); } return false; }
  hieuUng(kq.su, chon);
  dongBo(); capHud(); E.luu(s);
  if (bangMo) veBang(true);
  if (neo) veBong(true);
  return true;
}
function diemGoc(chon) { const p = chon && S.viTri(chon); return p ? S.manHinh(p) : { x: innerWidth / 2, y: innerHeight / 2 }; }
function hieuUng(su, chon) {
  const g = diemGoc(chon); let tre = 0;
  const bayDi = (id, chu, den) => { bay(id, chu, g, den, tre); tre += 90; };
  for (const e of su) {
    const c = e.i != null ? { loai: 'ruong', i: e.i } : chon;
    if (e.loai === 'mon' && e.n > 0) { bayDi(e.id, '+' + e.n, $('btnKho')); if (e.roi) thongBao('🎁 Nhặt được ' + ten(e.id) + '!'); }
    else if (e.loai === 'exp') bayDi('xp', '+' + e.n, $('viBox'));
    else if (e.loai === 'doiXu') { bayDi('xu', '+' + e.n, $('viBox')); }
    else if (e.loai === 'expTru' || e.loai === 'diemTru') nay(e.loai === 'expTru' ? $('viBox') : $('diemBox'));
    else if (e.loai === 'diem') { bay('diem', '+' + e.n, { x: innerWidth / 2, y: innerHeight / 2 }, $('diemBox'), 0); AM.on('sao'); }
    else if (e.loai === 'gieo') { S.hat(c, 'dat', 4); S.nay(c, 0.1); AM.on('pop'); }
    else if (e.loai === 'thu') { S.hat(c, ['lua_mi', 'ngo', 'lua_nuoc', 'mia'].includes(e.cay) ? 'lua' : 'la'); S.nay(c, 0.12); AM.on('soat'); if (e.trom) thongBao('Ô này bị bạn hái mất ' + e.trom + ' ' + ten(e.cay).toLowerCase()); }
    else if (e.loai === 'tuoi' || e.loai === 'giupTuoi') { S.hat(e.j != null ? { loai: 'ruong', i: e.j } : c, 'nuoc'); AM.on('pop'); }
    else if (e.loai === 'bon') { S.hat(c, 'dat', 8); S.hat(c, 'sao', 4); AM.on('pop'); }
    else if (e.loai === 'batSau' || e.loai === 'giupBat') { S.hat(e.j != null ? { loai: 'ruong', i: e.j } : c, 'la', 6); AM.on('pop'); }
    else if (e.loai === 'thuVat' || e.loai === 'layBanh') { S.hat(chon, 'sao'); S.nay(chon); AM.on('sao'); }
    else if (e.loai === 'choAn' || e.loai === 'muaVat') { S.hat(chon, 'tim'); S.nay(chon, 0.1); AM.on('tim'); }
    else if (e.loai === 'nuong') { S.hat(chon, 'khoi', 3); S.nay(chon, 0.12); AM.on('pop'); }
    else if (e.loai === 'moO') { const o = { loai: 'ruong', i: e.i }; S.hat(o, 'dat', 12); S.hat(o, 'sao', 8); AM.on('xay'); }
    else if (e.loai === 'thuCung') { S.hat(chon, 'tim', 6); S.nay(chon, 0.2); AM.on('tim'); }
    else if (e.loai === 'tcMoc') { const T = D.THU[e.thu], loi = { cho: ['chó bắt đầu đuổi trộm giúp cháu', 'chó đuổi trộm giỏi hơn', 'chó thành vệ sĩ số 1'], meo: ['mèo bắt đầu tha quà về', 'mèo tha quà nhiều hơn', 'mèo tha quà nhiều nhất'], chim: ['chim quen cháu rồi', 'chim bắt sâu giúp mỗi sáng', 'chim là bạn thân'] }[e.thu]; thongBao('💗 ' + T.ten + ' quý cháu hơn rồi — ' + loi[e.moc - 1]); hoaGiay(); }
    else if (e.loai === 'trangTri') { S.hat({ loai: 'tt', o: e.o }, 'sao', 8); AM.on('pop'); }
    else if (e.loai === 'trom') { S.hat({ loai: 'ruong', i: e.j }, 'la', 6); AM.on('soat'); }
    else if (e.loai === 'choDuoi') { thongBao('🐶 Gâu gâu! Chó nhà bạn đuổi em chạy mất rồi — mất 1 lượt'); AM.on('loi'); }
    else if (e.loai === 'ban') AM.on('xu');
    else if (e.loai === 'hdXong') { thongBao('🎉 Cháu đã học xong! Mai nhớ ghé thăm nông trại nhé'); hoaGiay(); }
    else if (e.loai === 'lenCap') { setTimeout(() => { AM.on('lenCap'); hoaGiay(); }, 700); hangLenCap.push(e); if (hangLenCap.length === 1) setTimeout(() => moLenCap(hangLenCap[0]), 900); }
  }
}
function bay(id, chu, tu, den, tre) {
  const el = document.createElement('div'); el.className = 'bay'; el.innerHTML = img(id) + '<span>' + chu + '</span>';
  $('lopBay').appendChild(el);
  const r = den.getBoundingClientRect(), x1 = r.left + r.width / 2 - 20, y1 = r.top + r.height / 2 - 20;
  const x0 = tu.x - 20 + (Math.random() - 0.5) * 30, y0 = tu.y - 20;
  const a = el.animate([
    { transform: `translate(${x0}px,${y0}px) scale(.6)`, opacity: 0 },
    { transform: `translate(${x0}px,${y0 - 50}px) scale(1.1)`, opacity: 1, offset: 0.35 },
    { transform: `translate(${x1}px,${y1}px) scale(.7)`, opacity: 0.9 },
  ], { duration: 1000, delay: tre || 0, easing: 'ease-in', fill: 'both' });
  a.onfinish = () => { el.remove(); nay(den); if (id === 'xu') AM.on('xu'); };
}
function hoaGiay() {
  const box = $('hoaGiay'), MAU = ['#ff5c8a', '#ffd23f', '#5cc8f2', '#7fd64a', '#b58cff', '#ff9f1c'];
  for (let i = 0; i < 60; i++) {
    const g = document.createElement('i'); g.className = 'giay';
    g.style.left = Math.random() * 100 + 'vw'; g.style.background = MAU[i % MAU.length];
    g.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px'); g.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
    g.style.animationDuration = (1.6 + Math.random() * 1.4) + 's'; g.style.animationDelay = Math.random() * 0.4 + 's';
    box.appendChild(g); setTimeout(() => g.remove(), 3600);
  }
}
function nay(el) { el.classList.remove('nay'); void el.offsetWidth; el.classList.add('nay'); }
function thongBao(msg) {
  const box = $('thongBao'); if ([...box.children].some(c => c.textContent === msg)) return;
  const el = document.createElement('div'); el.className = 'tb'; el.textContent = msg; box.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// ---------- HUD ----------
function capHud() {
  E.lamMoi(s);
  $('capSo').textContent = s.cap;
  const x = E.nnCap(s); $('xpDay').style.width = (x.can ? Math.min(100, x.co / x.can * 100) : 100) + '%';
  $('xpChu').textContent = x.can ? x.co + ' / ' + x.can : 'cấp cao nhất';
  const nnHom = s.hom.nn || 0, duHom = L.tranNnNgay && nnHom >= L.tranNnNgay;
  $('capBox').classList.toggle('duHom', !!duHom);
  $('capBox').title = 'Cấp nông trại — hôm nay +' + nnHom + (L.tranNnNgay ? '/' + L.tranNnNgay : '') + ' điểm nhà nông' + (duHom ? ' (đủ rồi, mai chăm vườn tiếp để lên cấp)' : ' — thu hoạch, giúp bạn, nhặt trứng sữa để lên cấp');
  $('xuSo').textContent = s.vi.xu.toLocaleString('vi-VN');
  $('expSo').textContent = s.vi.exp; $('expDay').style.width = Math.min(100, s.vi.exp) + '%'; $('viBox').classList.toggle('tran', s.vi.exp >= 100);
  $('diemSo').textContent = s.diem;
  const m = E.muaHom(s);
  $('muaChu').textContent = '🍂 ' + m.M.ten + ' · còn ' + m.conNgay + ' ngày' + (m.bonus ? ' · +' + Math.round(m.bonus * 100) + '%' : '');
  $('luotChu').textContent = '🌱 ' + (s.oMo - (s.hom.mua || 0)) + ' · 🤝 ' + (L.giup - s.hom.giup) + ' · 🧺 ' + (L.trom - s.hom.trom);
  $('ngayChu').textContent = 'Ngày ' + E.ngayVN(E.homNay(s)) + ' · ' + String(Math.floor(E.gioVN(E.gio(s)))).padStart(2, '0') + 'h';
  const ch = $('chamThu'); ch.textContent = s.thuMoi; ch.classList.toggle('an', !s.thuMoi);
  veViec();
}
function goiY() {
  if (NV.hdBuoc(s) || NV.meoKe(s) || bangMo) return '';
  if (xem != null) { const t = E.tomTatBan(s, xem); return t.giup || t.hai ? '👆 Chạm ô có 💧 🐛 để giúp · ô có 🧺 để hái' : '🏡 Vườn bạn gọn gàng rồi — về nhà hoặc sang bạn khác'; }
  const tts = s.ruong.map((_, i) => E.oTT(s, i));
  if (tts.some(t => t.tt === 'chin')) return '🌾 Có ô chín — chạm rồi vuốt qua các ô để thu hoạch';
  if (tts.some(t => t.sau)) return '🐛 Có sâu — chạm vào ô để bắt';
  if (tts.some(t => t.tt === 'lon' && !t.tuoiHom)) return '💧 Ô có giọt nước là chưa tưới — chạm hoặc vuốt để tưới';
  for (const k in D.VAT) if (s.vat[k].con.some(c => E.vatTT(s, k, c) === 'xong')) return '🥚 Chuồng có đồ — chạm để nhặt';
  if (E.loTT(s).tt === 'xong') return '🍞 Bánh chín rồi — chạm lò bánh để lấy';
  if (tts.some(t => t.tt === 'trong') && (s.diem >= 2 || s.vi.xu + s.vi.exp / 100 >= 0.05)) return '🌱 Ô trống — chạm để gieo 1 bịch hạt giống cho ngày mai';
  if (s.hom.giup < L.giup || s.hom.trom < L.trom) { let co = 0; D.BAN_AO.forEach((_, k) => { const t = E.tomTatBan(s, k); co += (s.hom.giup < L.giup ? t.giup : 0) + (s.hom.trom < L.trom ? t.hai : 0); }); if (co) return '👫 Sang vườn bạn: còn ' + (L.giup - s.hom.giup) + ' lượt giúp, ' + (L.trom - s.hom.trom) + ' lượt hái'; }
  return '🌙 Xong việc hôm nay rồi! Mai ghé lại nhé';
}

// ---------- VIỆC HÔM NAY (ghim góc trái dưới HUD, kiểu ô nhiệm vụ của Zoo Pet) — chỉ đường, không thưởng ----------
// Danh sách suy từ state (E.viecHom). Chạm 1 dòng ⇒ cầm đúng dụng cụ / kéo khung tới chỗ / mũi tên chỉ 3 giây.
// điện thoại xoay ngang (màn thấp): thanh việc mặc định thu gọn để không che ruộng — chạm là mở
const viecGon = () => matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
let viecMo = !viecGon(), viecKey = '', viecHet = null, chiDen = null;
const VIEC_TON = { thu: 'ô', sau: 'con' };                 // việc tồn: hiện số còn lại, không hiện x/y
const oDau = f => { for (let i = 0; i < s.oMo; i++) if (f(E.oTT(s, i))) return { loai: 'ruong', i }; return null; };
function denCho(chon, loi) {
  if (loi) thongBao(loi);
  if (!chon) return;
  const p = S.viTri(chon), m = p && S.manHinh(p), duoi = $('thanhCu').getBoundingClientRect().top, tren = $('hud').getBoundingClientRect().bottom;
  if (!m || m.sau || m.x < 40 || m.x > innerWidth - 70 || m.y < tren + 30 || m.y > duoi - 20) S.nhinVe(chon);   // khuất thì mới kéo khung
  S.nay(chon, 0.12); chiDen = { muc: chon, het: performance.now() + 3000 };
}
function diViec(id) {
  AM.on('bam'); dongBong();
  if (id === 'giup' || id === 'hai') return moBanBe();
  if (id === 'gieo') {
    const C = hatChon && E.hatHom(s).find(C => C.id === hatChon && C.cap <= s.cap);
    if (!C) return moHat();
    camCu('gieo', '🌱 Chạm hoặc vuốt qua ô trống để gieo ' + ten(hatChon).toLowerCase() + ' · đổi hạt: bấm 🌱 ở thanh dưới');
    return denCho(oDau(t => t.tt === 'trong'));
  }
  if (id === 'thu') { camCu('thu'); return denCho(oDau(t => t.tt === 'chin')); }
  if (id === 'tuoi') { camCu('tuoi'); return denCho(oDau(t => t.tt === 'lon' && !t.tuoiHom)); }
  if (id === 'sau') { camCu('sau'); return denCho(oDau(t => t.tt === 'lon' && t.sau)); }
  const k = id.slice(3);
  if (id.startsWith('an_')) return denCho({ loai: 'chuong', id: k }, '👆 Chạm ' + TEN_CHUONG[k].toLowerCase() + ' để cho ' + D.VAT[k].ten.toLowerCase() + ' ăn');
  if (id.startsWith('tc_')) return denCho({ loai: 'thu', id: k }, '👆 Chạm vào ' + D.THU[k].ten.toLowerCase() + ' nhé');
}
function veViec() {
  const box = $('viecBox');
  if (!L.viecHom || xem != null || NV.hdBuoc(s)) { box.classList.add('an'); viecKey = ''; return; }   // không chen hướng dẫn tân thủ, không hiện ở vườn bạn
  const ds = E.viecHom(s), con = ds.filter(x => !x.xong).length, het = !con;
  if (het && !viecHet) { viecMo = true; setTimeout(() => { if (viecHet) { viecMo = false; veViec(); } }, 3500); }   // vừa xong hết: khen 1 dòng rồi tự thu gọn
  else if (!het && viecHet) viecMo = !viecGon();                                                                           // có việc mới (sang ngày…) ⇒ mở lại
  viecHet = het;
  const tren = Math.round($('hud').getBoundingClientRect().bottom + 6), day = Math.round($('thanhCu').getBoundingClientRect().top - 60);
  box.style.top = tren + 'px'; box.style.maxHeight = Math.max(90, day - tren) + 'px';
  const key = JSON.stringify(ds) + viecMo; if (key === viecKey) return; viecKey = key;
  box.classList.remove('an'); box.classList.toggle('thuGon', !viecMo); box.classList.toggle('het', het);
  box.innerHTML = `<button class="vDau" data-v=""><span class="vTieu">${het ? '✅' : '📋'} Việc hôm nay</span>${con ? `<i class="vDem">${con}</i>` : ''}<span class="vMui">▾</span></button>`
    + (!viecMo ? '' : '<div class="vDs">' + (het ? '<div class="vXong">✅ Xong việc hôm nay — mai quay lại nhé!</div>'
      : ds.map(x => `<button class="vDong${x.xong ? ' xong' : ''}" data-v="${x.id}"><span class="vIc">${x.icon}</span><span class="vTen">${x.ten}</span><span class="vSo">${x.xong ? '✓' : VIEC_TON[x.id] ? x.can + ' ' + VIEC_TON[x.id] : x.lam + '/' + x.can}</span></button>`).join('')) + '</div>');
  box.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { if (b.dataset.v) return diViec(b.dataset.v); viecMo = !viecMo; AM.on('bam'); veViec(); });
}

// ---------- BONG BÓNG (bám vật 3D) ----------
function moBong(chon, ve) { neo = { chon, ve, key: '' }; $('bongMenu').classList.remove('an'); veBong(true); datViTriBong(); }
function dongBong() { neo = null; $('bongMenu').classList.add('an'); }
function veBong(ep) {
  if (!neo) return;
  const r = neo.ve(); if (!r) return dongBong();
  if (!ep && r.key === neo.key) return;
  neo.key = r.key; const el = $('bongMenu'); el.innerHTML = r.html; r.gan && r.gan(el);
}
function datViTriBong() {
  if (!neo) return; const p = S.viTri(neo.chon); if (!p) return;
  const m = S.manHinh(p), el = $('bongMenu');
  el.style.left = Math.max(110, Math.min(innerWidth - 110, m.x)) + 'px'; el.style.top = Math.max(el.offsetHeight + 30, m.y) + 'px';
}

// ---------- RUỘNG (vườn mình) ----------
function bongGieo(i) {
  return () => {
    const hs = E.hatHom(s);
    const key = ['g', cachTra, s.diem, s.vi.xu, s.vi.exp, s.cap, s.tuan.xu].join('|');
    const gia = C => cachTra === 'diem' ? '📘' + C.diem : img('xp', 'mini') + C.hat;
    const html = `<h4>Gieo (1 bịch = 1 ô)</h4>
      <div class="traBang"><button data-c="diem" class="${cachTra === 'diem' ? 'chon' : ''}">📘 Điểm chăm chỉ (${s.diem})</button><button data-c="exp" class="${cachTra === 'exp' ? 'chon' : ''}">${img('xu', 'mini')} Xu · EXP</button></div>
      <div class="phu">Giữ 1 bịch rồi kéo qua các ô trống · số góc trên = ngày chín · hôm nay còn mua ${s.oMo - (s.hom.mua || 0)} bịch</div>
      <div class="hatHang">${hs.map(C => C.cap > s.cap
        ? `<div class="hat het" title="${C.ten}">${img(C.id)}<span class="so">🔒${C.cap}</span></div>`
        : `<div class="hat" data-cay="${C.id}" title="${C.ten}">${img(C.id)}<span class="ngay">${C.ngay}</span><span class="so">${gia(C)}</span></div>`).join('')}</div>`;
    return { key, html, gan: el => {
      el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { cachTra = b.dataset.c; veBong(true); });
      el.querySelectorAll('[data-cay]').forEach(h => h.addEventListener('pointerdown', e => {
        e.preventDefault(); quet = { kieu: 'trong', cay: h.dataset.cay, baoLoi: false }; vuotTrong(i); S.batQuet(e.clientX, e.clientY);
      }));
    } };
  };
}
function bongO(i) {
  const chon = { loai: 'ruong', i };
  return () => {
    const tt = E.oTT(s, i);
    if (tt.tt === 'khoa') {
      if (!tt.ke) return null; const c = tt.cfg, du = s.cap >= c.cap && s.diem >= c.diem;
      return { key: 'k' + s.cap + '|' + s.diem, html: `<h4>Mở ô ruộng mới</h4><div class="phu">Cần <b>cấp ${c.cap}</b> và <b>${c.diem} điểm chăm chỉ</b><br>Cháu đang có cấp ${s.cap} · ${s.diem} 📘${s.diem < c.diem ? '<br>Làm bài trên app để có thêm điểm nhé' : ''}</div>
        <div class="dongNut"><button class="nut ${du ? 'vang' : 'xam'}" data-l="mo">📘 ${c.diem} · Mở ô</button></div>`,
        gan: el => el.querySelector('[data-l=mo]').onclick = () => { if (lam(E.moO(s), chon)) dongBong(); } };
    }
    if (tt.tt === 'trong') return bongGieo(i)();
    if (tt.tt !== 'lon') return null;
    const C = D.RUONG[tt.cay], sl = tt.sl, ps = [];
    ps.push('gốc ' + C.goc);
    if (sl.bon) ps.push('bón +25%');
    if (sl.bonus) ps.push('mùa +' + sl.bonus * 100 + '%');
    if (tt.sau) ps.push('🐛 −20%/con');
    const key = ['l', tt.tuoiHom, tt.bon, tt.sau, E.so(s, 'phan_bon'), tt.duKien].join('|');
    const html = `<h4>${img(tt.cay, 'nho')} ${C.ten}</h4><div class="phu">Chín sáng ${E.ngayVN(tt.dr)} · còn ${tt.conNgay} ngày<br>Dự kiến <b>${tt.duKien} quả</b> nếu tưới đủ mỗi ngày (${ps.join(' · ')})<br>Bán ${C.gia} EXP/quả</div><div class="dongNut">`
      + (tt.sau ? '<button class="nut do" data-l="sau">🐛 Bắt sâu</button>' : '')
      + (!tt.tuoiHom ? '<button class="nut" data-l="tuoi">💧 Tưới (+' + Math.round(D.LUAT.tuoiThem * 100) + '%)</button>' : '<span class="nho">💧 Hôm nay tưới rồi</span>')
      + (!tt.bon ? `<button class="nut ${E.so(s, 'phan_bon') ? 'vang' : 'xam'}" data-l="bon">${img('phan_bon')} Bón +25% (có ${E.so(s, 'phan_bon')})</button>` : '<span class="nho">🌱 Đã bón</span>')
      + '</div>';
    return { key, html, gan: el => {
      const b = l => el.querySelector(`[data-l=${l}]`);
      if (b('sau')) b('sau').onclick = () => lam(E.batSau(s, i), chon);
      if (b('tuoi')) b('tuoi').onclick = () => lam(E.tuoi(s, i), chon);
      if (b('bon')) b('bon').onclick = () => lam(E.bon(s, i), chon);
    } };
  };
}
function vuotThu(i) {
  const tt = E.oTT(s, i); if (tt.tt !== 'chin') return;
  if (tt.sau) { const k = E.batSau(s, i); if (k.ok) hieuUng(k.su, { loai: 'ruong', i }); }
  const kq = E.thu(s, i);
  if (!kq.ok) { if (!quet.baoLoi) { thongBao(kq.loi); quet.baoLoi = true; } return; }
  hieuUng(kq.su, { loai: 'ruong', i }); dongBo(); capHud();
}
function vuotTuoi(i) {
  const tt = E.oTT(s, i); if (tt.tt !== 'lon' || tt.tuoiHom) return;
  const kq = E.tuoi(s, i); if (kq.ok) { hieuUng(kq.su, { loai: 'ruong', i }); dongBo(); }
}
function vuotTrong(i) {
  if (E.oTT(s, i).tt !== 'trong') return;
  const kq = E.gieo(s, i, quet.cay, cachTra);
  if (!kq.ok) { if (!quet.baoLoi) { thongBao(kq.loi); AM.on('loi'); quet.baoLoi = true; } return; }
  hieuUng(kq.su, { loai: 'ruong', i }); dongBo(); capHud(); veBong();
}

// ---------- THANH DỤNG CỤ ----------
function veThanhCu() {
  const key = [dung, hatChon, cachTra, E.so(s, 'phan_bon'), xem].join('|'); if (key === keyCu) return; keyCu = key;
  $('thanhCu').innerHTML = DUNG.map(([id, ic, t]) => {
    const nhan = id === 'gieo' && hatChon ? ten(hatChon) : t, hinh = id === 'gieo' && hatChon ? img(hatChon) : id === 'bon' ? img('phan_bon') : ic;
    const goc = id === 'bon' ? E.so(s, 'phan_bon') : id === 'gieo' ? (cachTra === 'diem' ? '📘' : '💰') : '';
    return `<button class="cu ${dung === id ? 'chon' : ''}" data-cu="${id}"><span class="ic">${hinh}</span><span>${nhan}</span>${goc !== '' ? `<i class="con">${goc}</i>` : ''}</button>`;
  }).join('');
  $('thanhCu').querySelectorAll('[data-cu]').forEach(b => b.onclick = () => chonCu(b.dataset.cu));
}
const GOI_CU = { tuoi: '💧 Chạm hoặc vuốt qua các ô để tưới', sau: '🐛 Chạm ô có sâu để bắt', bon: '🌱 Chạm ô đang lớn để bón phân (+25%)', thu: '🧺 Chạm hoặc vuốt qua ô chín để thu hoạch' };
function chonCu(id) {
  dongBong(); AM.on('bam');
  if (id === 'gieo') { if (xem != null) return thongBao('Về vườn mình rồi gieo nhé'); return moHat(); }
  if (id === 'bon' && xem != null) return thongBao('Chỉ bón được vườn mình');
  dung = dung === id ? 'tay' : id; veThanhCu();
  if (GOI_CU[dung]) thongBao(GOI_CU[dung]);
}
function camCu(id, loi) { dongBong(); if (dung !== id) { dung = id; veThanhCu(); } if (loi || GOI_CU[id]) thongBao(loi || GOI_CU[id]); }   // cầm hẳn (không bật/tắt như chonCu)
function moHat() { moBang('Chọn bịch hạt giống', veHat); }
function veHat() {
  const ds = E.bangLai(s), key = [cachTra, s.diem, s.vi.xu, s.vi.exp, s.cap, hatChon].join('|');
  const html = `<div class="traBang"><button data-c="diem" class="${cachTra === 'diem' ? 'chon' : ''}">📘 Trả bằng điểm chăm chỉ (có ${s.diem})</button><button data-c="exp" class="${cachTra === 'exp' ? 'chon' : ''}">${img('xu', 'mini')} Trả bằng xu · EXP</button></div>
    <p class="nho" style="margin:4px 0 8px">Hôm nay còn mua được <b>${s.oMo - (s.hom.mua || 0)}/${s.oMo}</b> bịch (1 bịch = 1 ô). Chọn 1 loại rồi chạm (hoặc vuốt) qua các ô trống. Số thu là khi tưới đủ mỗi ngày${E.muaHom(s).bonus ? ', đã tính bonus mùa' : ''}.</p>
    <div class="luoi">${ds.map(r => r.cap > s.cap ? `<div class="the khoa">${img(r.id)}<b>${r.ten}</b><span class="nho">🔒 cấp ${r.cap}</span></div>`
      : `<div class="the duoc theHat ${hatChon === r.id ? 'chon' : ''}" data-hat="${r.id}">${img(r.id)}<b>${r.ten}</b><span class="nho">⏱ ${r.ngay} ngày · bịch <b>${cachTra === 'diem' ? r.diem + ' 📘' : r.hat + ' EXP'}</b></span><span class="nho">thu ~${r.tuoi % 1 ? Math.floor(r.tuoi) + '–' + Math.ceil(r.tuoi) : r.tuoi} quả × ${r.gia} EXP</span><span class="nho">${cachTra === 'diem' ? 'được <b>' + r.thuNgay + '</b> EXP/ngày' : 'lãi <b>' + r.laiNgay + '</b> EXP/ngày'}</span></div>`).join('')}</div>`;
  return { key, html, gan: el => {
    el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { cachTra = b.dataset.c; veBang(true); veThanhCu(); });
    el.querySelectorAll('[data-hat]').forEach(b => b.onclick = () => { hatChon = b.dataset.hat; dung = 'gieo'; dongBang(); veThanhCu(); thongBao('🌱 Chạm hoặc vuốt qua ô trống để gieo ' + ten(hatChon).toLowerCase()); });
  } };
}
function vuotSau(i) { if (!E.oTT(s, i).sau) return; const kq = E.batSau(s, i); if (kq.ok) { hieuUng(kq.su, { loai: 'ruong', i }); dongBo(); } }
function vuotBon(i) {
  const tt = E.oTT(s, i); if (tt.tt !== 'lon' || tt.bon) return;
  const kq = E.bon(s, i); if (!kq.ok) { if (!quet.baoLoi) { thongBao(kq.loi); AM.on('loi'); quet.baoLoi = true; } return; }
  hieuUng(kq.su, { loai: 'ruong', i }); dongBo(); veThanhCu();
}

// ---------- CHUỒNG GÀ, BÒ ----------
function chamChuong(k) {
  const V = D.VAT[k], chon = { loai: 'chuong', id: k };
  if (s.cap < V.cap) return thongBao(TEN_CHUONG[k] + ' mở ở cấp ' + V.cap);
  if (s.vat[k].con.some(c => E.vatTT(s, k, c) === 'xong')) lam(E.thuVat(s, k), chon);
  moBong(chon, bongChuong(k));
}
function bongChuong(k) {
  const chon = { loai: 'chuong', id: k };
  return () => {
    const V = D.VAT[k], con = s.vat[k].con, max = E.toiDaVat(s, k), doi = con.filter(c => c.an == null).length, dang = con.filter(c => E.vatTT(s, k, c) === 'an').length;
    const key = [con.length, doi, dang, max, JSON.stringify(s.kho), s.vi.xu, s.vi.exp].join('|');
    let html = `<h4>${TEN_CHUONG[k]} · ${con.length}/${max} con</h4><div class="phu">`;
    if (!con.length) html += 'Chưa có con nào — mua 1 con nhé';
    else if (doi) html += doi + ' con đang đói · mỗi con ăn 1 bữa/ngày';
    else html += 'Các bé no rồi · sáng mai có ' + ten(V.ra).toLowerCase();
    if (dang && doi) html += '<br>' + dang + ' con ăn rồi · sáng mai có ' + ten(V.ra).toLowerCase();
    html += '</div><div class="dongNut">';
    if (doi) for (const m of Object.keys(V.an)) html += `<button class="nut ${E.so(s, m) >= V.an[m] ? '' : 'xam'}" data-an="${m}">${img(m)} ${V.an[m]}/con (có ${E.so(s, m)})</button>`;
    if (con.length < max) html += `<button class="nut vang" data-l="mua">+1 ${V.ten} · ${img('xp', 'mini')}${V.gia}</button>`;
    html += '</div>';
    return { key, html, gan: el => {
      el.querySelectorAll('[data-an]').forEach(b => b.onclick = () => lam(E.choAn(s, k, b.dataset.an), chon));
      const b = el.querySelector('[data-l=mua]'); if (b) b.onclick = () => lam(E.muaVat(s, k), chon);
    } };
  };
}

// ---------- LÒ BÁNH ----------
function chamLo() {
  if (D.LO_CAP > 30) return;
  const tt = E.loTT(s); if (tt.tt === 'khoa') return thongBao('Lò bánh mở ở cấp ' + D.LO_CAP);
  dongBong(); if (tt.tt === 'xong') lam(E.layBanh(s), { loai: 'lo' });
  moBang('Lò bánh', veLo);
}
function veLo() {
  const tt = E.loTT(s), key = tt.tt + JSON.stringify(s.kho) + s.cap;
  let html = tt.tt === 'dang' ? `<div class="muc">Đang nướng ${ten(tt.mon).toLowerCase()} — sáng mai lấy nhé</div>` : '<div class="muc">Mỗi ngày nướng 1 mẻ · sáng mai xong</div>';
  html += '<div class="luoi">';
  for (const id in D.BANH) {
    const B = D.BANH[id];
    if (B.cap > s.cap) { html += `<div class="the khoa">${img(id)}<b>${B.ten}</b><span class="nho">🔒 cấp ${B.cap}</span></div>`; continue; }
    const thieu = Object.keys(B.can).some(k => E.so(s, k) < B.can[k]), von = Object.keys(B.can).reduce((a, k) => a + D.I[k].gia * B.can[k], 0);
    html += `<div class="the ${tt.tt === 'trong' ? 'duoc' : ''} ${thieu ? 'thieu' : ''}" data-banh="${id}">${img(id)}<b>${B.ten}</b><span class="nho">bán ${B.gia} EXP · nguyên liệu nếu bán ${von} EXP</span><div class="canList">${Object.keys(B.can).map(k => `<span class="can ${E.so(s, k) < B.can[k] ? 'thieu' : ''}">${img(k)}${E.so(s, k)}/${B.can[k]}</span>`).join('')}</div></div>`;
  }
  html += '</div>';
  return { key, html, gan: el => el.querySelectorAll('[data-banh]').forEach(c => c.onclick = () => { if (lam(E.nuong(s, c.dataset.banh), { loai: 'lo' })) dongBang(); }) };
}

// ---------- THÚ CƯNG ----------
const LOI_TC = { cho: tc => 'Đuổi trộm ' + Math.round(L.choDuoi[E.mocTc(tc)] * 100) + '%', meo: tc => 'Tha quà mỗi ngày ' + Math.round(L.meoQua(tc) * 100) + '%', chim: tc => tc >= L.chimBatSau ? 'Mỗi sáng bắt 1 con sâu' : 'Tới ' + L.chimBatSau + ' thiện cảm thì bắt sâu giúp' };
function chamThu(k) {
  const T = D.THU[k], chon = { loai: 'thu', id: k };
  if (T.cap > 30) return;
  if (s.cap < T.cap) return thongBao(T.ten + ' đến ở cấp ' + T.cap);
  const kq = E.choiThu(s, k);
  if (kq.ok) lam(kq, chon); else if (!/rồi/.test(kq.loi)) { thongBao(kq.loi); AM.on('loi'); }
  moBong(chon, () => { const x = E.thuTT(s, k); return { key: 'tc' + x.tc + x.roi, html: `<h4>${T.ten} · 💗 ${x.tc}/100</h4><div class="thanhNho"><i style="width:${x.tc}%"></i></div><div class="phu">${LOI_TC[k](x.tc)}<br>${x.roi ? 'Hôm nay ' + T.viec.toLowerCase() + ' rồi — mai nhé' : T.viec + ' mỗi ngày 1 lần'}${T.an ? ' · tốn 1 ' + ten(T.an).toLowerCase() : ''}</div>` }; });
}

// ---------- CHỖ TRANG TRÍ ----------
function chamTT(o) {
  const ds = Object.keys(D.TRANG_TRI).filter(x => E.so(s, x) > 0);
  if (!s.trangTri[o] && !ds.length) return thongBao('Chưa có đồ trang trí — đồ rơi khi thu hoạch, giúp bạn, hoặc mèo tha về');
  const chon = { loai: 'tt', o };
  moBong(chon, () => {
    const id = s.trangTri[o], ds2 = Object.keys(D.TRANG_TRI).filter(x => E.so(s, x) > 0);
    return { key: id + JSON.stringify(s.kho), html: `<h4>Chỗ trang trí</h4>${id ? `<div class="phu">Đang đặt: ${ten(id)}</div>` : ''}${ds2.length ? `<div class="phu">Chạm 1 món để đặt</div><div class="hatHang">${ds2.map(x => `<div class="hat" data-tt="${x}">${img(x)}<span class="so">${E.so(s, x)}</span></div>`).join('')}</div>` : ''}${id ? '<div class="dongNut"><button class="nut xam" data-l="go">Cất vào kho</button></div>' : ''}`,
      gan: el => { el.querySelectorAll('[data-tt]').forEach(b => b.onclick = () => { if (lam(E.datTT(s, o, b.dataset.tt), chon)) dongBong(); }); const g = el.querySelector('[data-l=go]'); if (g) g.onclick = () => { lam(E.goTT(s, o), chon); dongBong(); }; } };
  });
}

// ---------- BẢNG (panel) ----------
function moBang(tieuDe, ve) { dongBong(); bangMo = { ve, key: '' }; $('bangTen').textContent = tieuDe; $('tam').classList.remove('an'); veBang(true); $('bangThan').scrollTop = 0; }
function dongBang() { bangMo = null; hangLenCap.length = 0; $('tam').classList.add('an'); }
function veBang(ep) {
  if (!bangMo) return;
  const r = bangMo.ve(); if (!r) return dongBang();
  if (!ep && r.key === bangMo.key) return;
  bangMo.key = r.key; const el = $('bangThan'), cuon = el.scrollTop; el.innerHTML = r.html; r.gan && r.gan(el); el.scrollTop = cuon;
}

// ---------- CHỢ: bán · mua · bảng tính lãi ----------
let choTab = 'ban';
function moCho(tab) { if (typeof tab === 'string') choTab = tab; moBang('Chợ', veCho); }
function viHtml() {
  const tran = E.tranThang(s), da = s.thang.ra - s.thang.vao;
  return `<div class="viDong">${img('xu')}<b>${s.vi.xu}</b> xu · ${img('xp')}<b>${s.vi.exp}</b> EXP <span class="nho">· 100 EXP = 1 xu</span></div>
    <div class="nho viPhu">Tháng này nông trại đã trả <b>${Math.max(0, da)}/${tran}</b> xu${E.chamTran(s) ? ' — đã chạm trần, EXP dồn sang tháng sau' : ''} · hôm nay đã mua <b>${s.hom.mua || 0}/${s.oMo}</b> bịch hạt giống (mỗi ngày tối đa bằng số ô) · tháng này đã chi <b>${s.thang.chi || 0}/${L.tranXuTieuThang * 100}</b> EXP (= ${L.tranXuTieuThang} xu) để mua</div>`;
}
function veCho() {
  E.lamMoi(s);
  const key = [choTab, JSON.stringify(s.kho), s.vi.xu, s.vi.exp, s.cap, s.tuan.xu, JSON.stringify(s.vat.ga.con.length), s.vat.bo.con.length].join('|');
  let html = viHtml() + `<div class="tab"><button data-t="ban" class="${choTab === 'ban' ? 'chon' : ''}">💰 Bán</button><button data-t="mua" class="${choTab === 'mua' ? 'chon' : ''}">🛒 Mua</button><button data-t="lai" class="${choTab === 'lai' ? 'chon' : ''}">🧮 Bảng tính lãi</button></div>`;
  if (choTab === 'ban') {
    const ds = Object.keys(s.kho).filter(id => D.I[id] && D.I[id].gia > 0 && s.kho[id] > 0);
    if (!ds.length) html += '<p class="nho">Kho chưa có gì để bán — thu hoạch đã nhé.</p>';
    for (const id of ds) {
      const P = D.I[id], n = s.kho[id], anVat = Object.values(D.VAT).some(V => V.an[id]) || Object.values(D.BANH).some(B => B.can[id]);
      html += `<div class="dongBan">${img(id)}<div class="giua"><b>${P.ten}</b> <span class="nho">có ${n} · ${P.gia} EXP/cái${anVat ? ' · giữ lại vài cái cho gà bò / lò bánh' : ''}</span></div>
        <button class="nut xam" data-ban="${id}" data-n="1">Bán 1</button><button class="nut vang" data-ban="${id}" data-n="${n}">Bán hết +${P.gia * n}</button></div>`;
    }
  }
  if (choTab === 'mua') {
    html += `<div class="dongBan">${img('phan_bon')}<div class="giua"><b>Phân bón</b> <span class="nho">+25% sản lượng · ×3 cơ hội rơi đồ · ${L.giaPhan} EXP · có ${E.so(s, 'phan_bon')}</span></div><button class="nut vang" data-mua="phan" data-n="1">Mua 1</button><button class="nut vang" data-mua="phan" data-n="5">Mua 5</button></div>`;
    for (const k in D.VAT) {
      const V = D.VAT[k], max = E.toiDaVat(s, k), co = s.vat[k].con.length;
      html += `<div class="dongBan">${img('vat_' + k)}<div class="giua"><b>${V.ten}</b> <span class="nho">${s.cap < V.cap ? '🔒 cấp ' + V.cap : 'có ' + co + '/' + max + ' · ' + V.gia + ' EXP · cho ' + ten(V.ra).toLowerCase() + ' mỗi sáng'}</span></div>${s.cap >= V.cap && co < max ? `<button class="nut vang" data-mua="${k}">Mua</button>` : ''}</div>`;
    }
    html += '<p class="nho">Hạt giống mua ngay lúc gieo: chạm vào ô đất trống.</p>';
  }
  if (choTab === 'lai') {
    const ds = E.bangLai(s), m = E.muaHom(s);
    html += `<p class="nho">Cây mùa ${m.M.ten} + cây quanh năm. Giả sử cháu tưới đủ mỗi ngày${m.bonus ? ', có bonus mùa +' + Math.round(m.bonus * 100) + '%' : ''}. Lãi = tiền bán − tiền bịch (− tiền phân nếu bón), chia cho số ngày.</p>
      <div class="cuonNgang"><table class="bangLai"><tr><th>Cây</th><th>Ngày</th><th>Bịch</th><th>Thu (quả)</th><th>Giá/quả</th><th>Lãi/ngày</th><th>Có bón</th></tr>
      ${ds.map(r => `<tr class="${r.cap > s.cap ? 'khoa' : ''}"><td>${img(r.id, 'nho')} ${r.ten}${r.cap > s.cap ? ' 🔒' + r.cap : ''}</td><td>${r.ngay}</td><td>${r.hat} EXP<br><span class="nho">hoặc ${r.diem}📘</span></td><td>${r.tuoi}<br><span class="nho">bón: ${r.bon}</span></td><td>${r.gia}</td><td><b>${r.laiNgay}</b></td><td>${r.laiNgayBon}</td></tr>`).join('')}</table></div>
      <p class="nho">Mẹo: cây càng lâu ngày thì lãi mỗi ngày càng cao, nhưng phải ghé tưới đều. Trả bằng 📘 điểm chăm chỉ thì không tốn xu.</p>`;
  }
  return { key, html, gan: el => {
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { choTab = b.dataset.t; veBang(true); });
    el.querySelectorAll('[data-ban]').forEach(b => b.onclick = () => lam(E.ban(s, b.dataset.ban, +b.dataset.n), { loai: 'sap' }));
    el.querySelectorAll('[data-mua]').forEach(b => b.onclick = () => { const x = b.dataset.mua; lam(x === 'phan' ? E.muaPhan(s, +b.dataset.n) : E.muaVat(s, x), x === 'phan' ? { loai: 'sap' } : { loai: 'chuong', id: x }); });
  } };
}

// ---------- KHO ----------
const NHOM_KHO = [['cay', '🌾 Nông sản'], ['vat', '🥚 Trứng, sữa'], ['banh', '🍞 Bánh'], ['phan', '🌱 Phân bón'], ['trangtri', '🏮 Đồ trang trí'], ['quy', '💎 Đồ quý']];
function moKho() { moBang('Kho', veKho); }
function veKho() {
  const key = JSON.stringify(s.kho);
  let html = '';
  for (const [loai, tieu] of NHOM_KHO) {
    const ds = Object.keys(s.kho).filter(id => D.I[id] && D.I[id].loai === loai && s.kho[id] > 0);
    if (!ds.length) continue;
    html += `<div class="muc">${tieu}</div><div class="luoiKho">${ds.map(id => `<div class="oKho" title="${ten(id)}">${img(id)}<span class="so">${s.kho[id]}</span></div>`).join('')}</div>`;
  }
  if (!html) html = '<p class="nho">Kho trống.</p>';
  html += `<div class="dongNut"><button class="nut vang" data-l="cho">💰 Ra chợ bán</button></div><p class="nho">Đồ trang trí: chạm vào vòng tròn sáng trên sân để đặt.</p>`;
  return { key, html, gan: el => el.querySelector('[data-l=cho]').onclick = () => moCho('ban') };
}

// ---------- BẠN CÙNG LỚP ----------
function moBanBe() { moBang('Bạn cùng lớp', veBanBe); }
function veBanBe() {
  E.lamMoi(s);
  const ds = D.BAN_AO.map((B, k) => ({ B, k, t: E.tomTatBan(s, k) }));
  const key = JSON.stringify(ds.map(x => x.t)) + s.hom.giup + s.hom.trom;
  const html = `<p class="nho" style="margin-top:0">Hôm nay còn <b>${L.giup - s.hom.giup}</b> lượt giúp · <b>${L.trom - s.hom.trom}</b> lượt hái. Chỉ hái được cây chín từ hôm trước mà bạn chưa hái — mỗi ô 1–2 quả.</p>`
    + ds.map(x => `<div class="banThe"><div class="banMat">${x.B.ten[0]}</div><div class="giua"><b>${x.B.ten}</b> <span class="nho">cấp ${x.B.cap}</span><div class="nho">${[x.t.giup ? '🤝 ' + x.t.giup + ' ô cần giúp' : '', x.t.hai ? '🧺 ' + x.t.hai + ' ô hái được' : ''].filter(Boolean).join(' · ') || 'Vườn gọn gàng'}</div></div><button class="nut vang" data-k="${x.k}">Sang chơi</button></div>`).join('')
    + '<p class="nho">Bản thử: 6 bạn ảo. Bản online: bạn cùng lớp thật.</p>';
  return { key, html, gan: el => el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => sangBan(+b.dataset.k)) };
}
function sangBan(k) {
  xem = k; dongBang(); dongBong(); E.dem(s, 'tham');
  $('banTen').textContent = D.BAN_AO[k].ten; $('banCap').textContent = D.BAN_AO[k].cap; $('banBanner').classList.remove('an'); document.body.classList.add('dangTham');
  dongBo(); capHud(); AM.on('pop'); E.luu(s);
}
function veNha() {
  if (xem == null) return; xem = null; E.dem(s, 'veNha');
  $('banBanner').classList.add('an'); document.body.classList.remove('dangTham');
  dongBo(); capHud(); E.luu(s);
}
function chamVuonBan(chon) {
  const st = E.banTT(s, xem);
  if (chon.loai === 'ruong') {
    if (chon.i >= st.oMo) return;
    const tt = E.oBanTT(s, st, chon.i), r = st.ruong[chon.i];
    // tay: giúp trước (việc tốt), hái sau · cầm giỏ 🧺 thì hái ngay
    const coHai = tt.tt === 'chin' && tt.quaHan && tt.tromDuoc > 0 && !r.daHai, coGiup = tt.sau || (tt.tt === 'lon' && !tt.tuoiHom);
    if (coHai && (dung === 'thu' || !coGiup)) return lam(E.tromBan(s, xem, chon.i), chon);
    if (coGiup) return lam(E.giupBan(s, xem, chon.i), chon);
    if (tt.tt === 'chin' && !tt.quaHan) return thongBao('Hôm nay cây mới chín — là ngày của ' + st.ten + '. Mai bạn chưa hái thì mới hái được');
    if (tt.tt === 'chin') return thongBao(r.daHai ? 'Em hái ô này rồi' : tt.trom ? 'Ô này bị hái nhiều rồi — để phần cho bạn nhé' : 'Ô này ít quả quá — để phần cho bạn nhé');
    if (tt.tt === 'lon') return thongBao(st.ten + ' chăm ô này rồi — chín sau ' + tt.conNgay + ' ngày');
    return;
  }
  if (chon.loai === 'thu' && chon.id === 'cho') { S.nay(chon, 0.2); AM.on('bam'); return thongBao('🐶 Gâu! Chó nhà ' + st.ten + ' đang canh vườn'); }
  thongBao('Đây là vườn của ' + st.ten + ' — bấm ⬅ Về nhà để về');
}

// ---------- HỘP THƯ ----------
function moThu() { moBang('Hộp thư', veThu); }
function dongThu(t) {
  const o = t.o != null ? ' ô ' + (t.o + 1) : '';
  if (t.viec === 'tuoi') return `💧 <b>${t.ai}</b> tưới hộ${o}`;
  if (t.viec === 'trom') return `🧺 <b>${t.ai}</b> hái ${t.n} ${ten(t.mon).toLowerCase()} ở${o}`;
  if (t.viec === 'choDuoi') return `🐶 Chó đuổi <b>${t.ai}</b> chạy mất khi bạn định hái${o}`;
  if (t.viec === 'batSau') return `🐦 Chim bắt 1 con sâu ở${o}`;
  if (t.viec === 'qua') return `🐱 Mèo tha về 1 ${ten(t.mon).toLowerCase()}`;
  return t.viec;
}
function veThu() {
  s.thuMoi = 0; capHud();
  const key = s.thuTu.length + '|' + (s.thuTu[0] ? s.thuTu[0].d : '');
  const html = s.thuTu.length ? s.thuTu.map(t => `<div class="thuDong"><span class="nho">Ngày ${E.ngayVN(t.d)}</span> · ${dongThu(t)}</div>`).join('')
    : '<p class="nho">Chưa có tin nào. Bạn bè ghé tưới hộ, hái trộm, chó đuổi trộm… đều ghi ở đây.</p>';
  return { key, html };
}

// ---------- ĐIỂM CHĂM CHỈ (bản thử: giả lập 1 lượt 10 câu) ----------
function moDiem() { moBang('Điểm chăm chỉ', veDiem); }
function veDiem() {
  E.lamMoi(s);
  const key = s.diem + '|' + s.hom.diem;
  const html = `<p>Mỗi lượt <b>10 câu</b> (Tự luyện hoặc Thử thách) đúng <b>từ ${L.nguongDat} câu</b> ⇒ được điểm = số câu đúng. Hôm nay: <b>${s.hom.diem}/${L.tranDiemNgay}</b> điểm.</p>
    <p class="nho">Bản thử chưa nối app học — bấm để giả lập 1 lượt. Bản thật: tự cộng khi em làm bài trên app.</p>
    <div class="dongNut">${[6, 7, 8, 9, 10].map(n => `<button class="nut ${n < L.nguongDat ? 'xam' : 'vang'}" data-n="${n}">Đúng ${n}/10</button>`).join('')}</div>
    <p style="text-align:center;font-size:18px">📘 Đang có <b>${s.diem}</b> điểm</p>`;
  return { key, html, gan: el => el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => lam(E.lamLuot(s, +b.dataset.n), null)) };
}

// ---------- LÊN CẤP ----------
const hangLenCap = [];
function moLenCap(e) {
  const N = e.cap, q = e.qua || {}, moi = [];
  for (const C of Object.values(D.RUONG)) if (C.cap === N) moi.push([C.id, 'Hạt ' + C.ten.toLowerCase() + (C.mua ? ' (mùa ' + D.MUA[C.mua - 1].ten + ')' : '')]);
  const o = L.oMo.findIndex(x => x.cap === N); if (o >= 0) moi.push(['ruong', 'Ô ruộng thứ ' + (o + L.oDau + 1) + ' · ' + L.oMo[o].diem + ' 📘']);
  for (const k in D.VAT) { const V = D.VAT[k], t = V.toiDa.find(x => x[0] === N); if (t) moi.push(['vat_' + k, (V.cap === N ? TEN_CHUONG[k] : 'Nuôi tới ' + t[1] + ' ' + V.ten.toLowerCase())]); }
  if (N === D.LO_CAP) moi.push(['lo_banh', 'Lò bánh']);
  for (const id in D.BANH) if (D.BANH[id].cap === N && N !== D.LO_CAP) moi.push([id, D.BANH[id].ten]);
  for (const k in D.THU) if (D.THU[k].cap === N && k !== 'cho') moi.push(['thu_' + k, D.THU[k].ten]);
  const qua = Object.keys(q).map(id => `<span class="can" style="font-size:16px">${img(id)}+${q[id]}</span>`).join('');
  moBang('Lên cấp!', () => ({ key: 'lc' + N, html: `<div class="lenCap"><div class="sao">★ ${N}</div><h2>Nông trại lên cấp ${N}!</h2>
    ${qua ? `<div class="muc">Quà</div><div class="canList" style="gap:14px">${qua}</div>` : ''}
    ${moi.length ? `<div class="muc">Mở khoá</div><div class="moKhoa">${moi.map(([id, t]) => `<div class="the">${img(id)}<b>${t}</b></div>`).join('')}</div>` : ''}
    <button class="nut vang" data-l="ok" style="font-size:18px;padding:10px 28px">Tuyệt!</button></div>`,
    gan: el => el.querySelector('[data-l=ok]').onclick = () => { hangLenCap.shift(); if (hangLenCap.length) moLenCap(hangLenCap[0]); else dongBang(); } }));
}

// ---------- TUỲ CHỌN ----------
function moMenu() {
  let hoi = false;
  moBang('Tuỳ chọn', () => ({ key: 'm' + hoi, html: `<p><b>Bản thử NHỊP NGÀY.</b> Mỗi ngày ghé 1 lần: thu hoạch, chăm cây, sang vườn bạn, gieo cho ngày mai. Tiến độ lưu trên máy này; ví xu, điểm chăm chỉ và bạn bè đều là giả lập.</p>
    <p>⏭ = sang ngày hôm sau (18 giờ) để thử nhanh · 📘 = giả lập làm 1 lượt bài.</p>
    ${dangApp() ? '' : '<div class="dongNut" style="justify-content:flex-start"><button class="nut vang" data-l="cai">📲 Cài như app</button><span class="nho">mở bằng 1 chạm, chơi toàn màn hình</span></div>'}
    <div class="dongNut" style="justify-content:flex-start"><button class="nut do" data-l="xoa">${hoi ? 'Chắc chắn? Bấm lần nữa để xoá hết' : 'Chơi lại từ đầu'}</button></div>`,
    gan: el => {
      el.querySelector('[data-l=xoa]').onclick = () => { if (!hoi) { hoi = true; veBang(true); } else { s = E.moi(); E.luu(s); location.reload(); } };
      const c = el.querySelector('[data-l=cai]'); if (c) c.onclick = moCai;
    } }));
}

// ---------- CÀI NHƯ APP (PWA, kiểu Zoo Pet: ra màn hình chính, chơi toàn màn hình) ----------
// Chưa làm service worker: đang dev, cache dễ làm thấy bản cũ — làm khi lên bản online.
// iOS không có nút cài tự động ⇒ hướng dẫn tay. Chrome Android có beforeinstallprompt thì bấm là cài.
let hoiCai = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); hoiCai = e; });
addEventListener('appinstalled', () => { hoiCai = null; });
const dangApp = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
const laIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
function moCai() {
  moBang('Cài như app', () => {
    const ios = laIOS();
    const hdIOS = `<div class="caiThe${ios ? ' chon' : ''}"><b>📱 iPhone / iPad</b><ol><li>Mở trang này bằng <b>Safari</b></li><li>Bấm nút <b>Chia sẻ</b> <span class="caiIc">⬆</span> (ô vuông có mũi tên lên)</li><li>Chọn <b>“Thêm vào MH chính”</b> rồi bấm <b>Thêm</b></li></ol>
      <div class="nho">Lưu ý: app cài trên iPhone/iPad có bộ nhớ riêng — nông trại trong app bắt đầu lại từ đầu, không mang tiến độ từ Safari sang (bản online sẽ lưu theo tài khoản).</div></div>`;
    const hdAD = `<div class="caiThe${ios ? '' : ' chon'}"><b>🤖 Android (Chrome)</b>${hoiCai ? '<div class="dongNut" style="justify-content:flex-start"><button class="nut vang" data-l="cai">📲 Cài ngay</button></div>' : ''}
      <ol><li>Bấm nút menu <b>⋮</b> ở góc trên phải Chrome</li><li>Chọn <b>“Cài đặt ứng dụng”</b> hoặc <b>“Thêm vào màn hình chính”</b></li></ol></div>`;
    return { key: 'cai' + !!hoiCai, html: `<p style="margin-top:0">Đưa Nông Trại ra <b>màn hình chính</b>: mở bằng 1 chạm, chơi <b>toàn màn hình</b> như app thật.</p>${ios ? hdIOS + hdAD : hdAD + hdIOS}`,
      gan: el => { const b = el.querySelector('[data-l=cai]'); if (b) b.onclick = () => { const e = hoiCai; if (!e) return; e.prompt(); e.userChoice.then(() => { hoiCai = null; veBang(true); }).catch(() => {}); }; } };
  });
}

// ---------- HƯỚNG DẪN (Bác Hai nói + mũi tên chỉ chỗ bấm) ----------
let hdKey = '', hdMuc = null;
function veHuongDan() {
  const B = NV.hdBuoc(s), m = !B && NV.meoKe(s), hop = $('hdHop');
  if (!B && !m) { if (hdKey) { hop.classList.add('an'); hdKey = ''; } hdMuc = null; return; }
  hdMuc = B ? NV.hdMuc(s) : m.muc;
  const key = B ? 'b' + s.hd.b : 'm' + m.id; if (key === hdKey) return; hdKey = key;
  const NH = NV.NGUOI_HD;
  hop.innerHTML = `<div class="hdMat">${NH.mat}</div><div class="hdNoi"><b>${NH.ten}</b><p>${B ? B.loi : m.loi}</p><div class="hdNut">`
    + (B ? '<button class="boQua" data-l="bo">Bỏ qua hướng dẫn</button>' : '')
    + (B && B.kieu === 'noi' ? '<button class="nut vang" data-l="tiep">Tiếp ›</button>' : '')
    + (!B ? '<button class="nut vang" data-l="hieu">Hiểu rồi!</button>' : '') + '</div></div>';
  hop.classList.remove('an'); AM.on('bam');
  const b = l => hop.querySelector(`[data-l=${l}]`);
  if (b('tiep')) b('tiep').onclick = () => lam(NV.hdTiep(s), null);
  if (b('bo')) b('bo').onclick = () => { if (b('bo').dataset.hoi) { NV.hdBoQua(s); E.luu(s); veHuongDan(); } else { b('bo').dataset.hoi = 1; b('bo').textContent = 'Chắc chưa? Bấm lần nữa'; } };
  if (b('hieu')) b('hieu').onclick = () => { NV.meoXong(s, m.id); E.luu(s); veHuongDan(); };
}
function datMuiTen() {
  const el = $('muiTen'); let p = null;
  const muc = hdMuc || (chiDen && xem == null && performance.now() < chiDen.het ? chiDen.muc : null);   // hướng dẫn trước, rồi mới tới chỉ đường "Việc hôm nay"
  if (muc) {
    for (const x of [].concat(muc)) {
      if (!x) continue;
      if (typeof x === 'string') { const d = document.querySelector(x); if (d && d.offsetParent !== null) { const r = d.getBoundingClientRect(); p = { x: r.left + r.width / 2, y: r.top - 6 }; break; } }
      else if (bangMo == null) { const v = S.viTri(x); if (v) { const m = S.manHinh(v); if (!m.sau && m.x > 20 && m.x < innerWidth - 20 && m.y > 60 && m.y < innerHeight - 90) { p = { x: m.x, y: m.y - 10 }; break; } } } // bỏ đích nằm ngoài màn
    }
  }
  if (!p) { el.classList.add('an'); return; }
  el.classList.remove('an'); el.style.transform = `translate(${p.x - 23}px,${p.y - 58}px)`;
}

// ---------- CHẠM TỪ CẢNH 3D ----------
const cb = {
  cham(chon) {
    chiDen = null;
    if (!chon) return dongBong();
    if (xem != null) return chamVuonBan(chon);
    if (chon.loai !== 'ruong') { S.nay(chon, 0.1); AM.on('bam'); }
    if (chon.loai === 'ruong') {
      const tt = E.oTT(s, chon.i);
      if (tt.tt === 'khoa' && !tt.ke) return thongBao('Mở lần lượt từng ô — ô sáng biển là ô kế tiếp');
      if (tt.tt === 'lon' && tt.sau) lam(E.batSau(s, chon.i), chon);
      return moBong(chon, bongO(chon.i));
    }
    if (chon.loai === 'chuong') return chamChuong(chon.id);
    if (chon.loai === 'lo') return chamLo();
    if (chon.loai === 'thu') return chamThu(chon.id);
    if (chon.loai === 'tt') return chamTT(chon.o);
    if (chon.loai === 'bang') { dongBong(); return moBanBe(); }
    if (chon.loai === 'sap') { dongBong(); return moCho(); }
    if (chon.loai === 'hopThu') { dongBong(); return moThu(); }
    if (chon.loai === 'kho') { dongBong(); return moKho(); }
    if (chon.loai === 'nha') { dongBong(); return thongBao('🏡 Nhà của cháu'); }
  },
  batDauVuot(i) {
    if (xem != null) return false;
    const tt = E.oTT(s, i), bat = (kieu, fn) => { dongBong(); quet = { kieu, baoLoi: false }; fn(i); return true; };
    if (dung === 'gieo' && hatChon && tt.tt === 'trong') { dongBong(); quet = { kieu: 'trong', cay: hatChon, baoLoi: false }; vuotTrong(i); return true; }
    if (dung === 'sau' && tt.sau) return bat('sau', vuotSau);
    if (dung === 'bon' && tt.tt === 'lon' && !tt.bon) return bat('bon', vuotBon);
    if (dung === 'tuoi' && tt.tt === 'lon' && !tt.tuoiHom) return bat('tuoi', vuotTuoi);
    // tay, hoặc dụng cụ không hợp ô này ⇒ tự đoán việc cần làm (không để trẻ bị kẹt vì cầm nhầm)
    if (tt.tt === 'chin') return bat('thu', vuotThu);
    if (tt.tt === 'lon' && !tt.tuoiHom && !tt.sau) return bat('tuoi', vuotTuoi);
    return false;
  },
  vuot(i) { if (!quet) return; ({ thu: vuotThu, tuoi: vuotTuoi, sau: vuotSau, bon: vuotBon, trong: vuotTrong })[quet.kieu](i); },
  hetVuot() { if (quet && quet.kieu === 'trong' && dung !== 'gieo') dongBong(); quet = null; capHud(); veThanhCu(); E.luu(s); },
  boChon() { dongBong(); },
  khung(dt) {
    datViTriBong(); datMuiTen();
    tDongBo += dt; tLuu += dt; tKiem += dt; tGiay += dt;
    if (tDongBo >= 0.25) {
      tDongBo = 0;
      const d = E.homNay(s);
      if (d !== ngayCu) { const moi = ngayCu != null; ngayCu = d; E.capNhat(s); E.luu(s); if (moi) { thongBao('☀️ Sáng ' + E.ngayVN(d) + ' — ngày mới!'); AM.on('sao'); } if (s.thuMoi) thongBao('✉️ Có ' + s.thuMoi + ' tin trong hộp thư'); }
      const suNv = NV.tick(s); if (suNv.length) { hieuUng(suNv, null); E.luu(s); if (bangMo) veBang(true); }
      veHuongDan();
      dongBo(); capHud(); veThanhCu();
      veBong(); veBang();
      if (tGiay >= 2) { tGiay = 0; let n = 0; if (xem == null) D.BAN_AO.forEach((_, k) => { const t = E.tomTatBan(s, k); if (t.giup + t.hai) n++; }); S.datGiay(n); const g = goiY(); if ($('goiY').textContent !== g) $('goiY').textContent = g; }
    }
    if (tLuu >= 5) { tLuu = 0; E.luu(s); }
  },
};

function batDau(state) {
  s = state;
  $('icXp').src = M.icon('xp'); $('icXu').src = M.icon('xu'); $('icDiem').src = M.icon('diem');
  $('icKho').src = M.icon('kho_barn'); $('icShop').src = M.icon('sap');
  S.init($('c3d'), $('lopNhan'), cb);
  E.capNhat(s); ngayCu = E.homNay(s); dongBo(); capHud(); veThanhCu();
  const doLe = () => S.datLe($('hud').getBoundingClientRect().bottom + 6, innerHeight - $('thanhCu').getBoundingClientRect().top + 6);
  doLe(); addEventListener('resize', () => setTimeout(doLe, 50));
  const B = NV.hdBuoc(s); if (B && (B.id === 'giup' || B.id === 'trom')) sangBan(s.hd.ban || 0); // tải lại giữa bước hướng dẫn ở vườn bạn ⇒ quay lại vườn bạn
  $('btnKho').onclick = moKho;
  $('btnShop').onclick = () => { if (xem != null) return thongBao('Về nhà rồi ra chợ nhé'); moCho(); };
  $('btnBan').onclick = moBanBe;
  $('btnThu').onclick = () => { if (xem != null) return; moThu(); };
  $('nutVe').onclick = veNha;
  $('btnMenu').onclick = moMenu;
  $('btnDiem').onclick = moDiem;
  $('btnAm').textContent = AM.tat ? '🔇' : '🔊';
  $('btnAm').onclick = () => { $('btnAm').textContent = AM.doiTat() ? '🔇' : '🔊'; };
  $('btnTua').onclick = () => { E.sangNgayMoi(s); capHud(); E.luu(s); };
  $('bangDong').onclick = dongBang;
  $('tam').addEventListener('pointerdown', e => { if (e.target === $('tam')) dongBang(); });
  addEventListener('beforeunload', () => E.luu(s));
  document.addEventListener('visibilitychange', () => { if (document.hidden) E.luu(s); });
}

window.NT_UI = { batDau, get s() { return s; }, get xem() { return xem; }, lam, thongBao, sangBan, veNha, _cb: cb, _moKho: moKho, _moCho: moCho, _moBanBe: moBanBe, _moThu: moThu };
})();
