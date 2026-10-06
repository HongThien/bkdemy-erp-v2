/* Nông Trại BK — NHỊP NGÀY: HƯỚNG DẪN TÂN THỦ + MẸO LẦN ĐẦU (luật thuần, không đồ hoạ).
   Dắt HS đi trọn 1 vòng chơi ngày: gieo → tưới → (phép cho chín) → thu → bán ở chợ → sang vườn bạn: giúp + hái → về nhà → xoa đầu chó.
   Sổ nhiệm vụ + thành tích: làm sau khi vòng chơi chính đúng cảm giác (spec §5.11). */
(function () {
'use strict';
const D = NT_DATA, E = NT_ENGINE, { RUONG } = D;

const NGUOI_HD = { ten: 'Bác Hai', mat: '👨‍🌾' };   // tạm — sau này thay bằng thầy cô BK (CEO 29/09)
const moi = (s, k) => (s.dem[k] || 0) - (s.hd.base[k] || 0);
const ban = s => s.hd.ban == null ? 0 : s.hd.ban;
const HD = [
  { id: 'chao', kieu: 'noi', loi: 'Chào cháu! Bác là Bác Hai. Nông trại này là của cháu. Mỗi ngày cháu ghé 1 lần: thu hoạch, chăm cây, sang vườn bạn, rồi gieo hạt cho ngày mai.' },
  { id: 'gieo', kieu: 'lam', loi: 'Gieo cà rốt nhé! Chạm ô đất trống, chọn trả bằng 📘 ĐIỂM CHĂM CHỈ, rồi GIỮ bịch cà rốt và KÉO qua các ô. Mỗi ô 1 bịch hạt giống.',
    muc: s => ({ loai: 'ruong', i: Math.max(0, s.ruong.findIndex((r, i) => i < s.oMo && !r.cay)) }),
    batDau: s => { const can = s.oMo * D.RUONG.ca_rot.diem; if (s.diem < can) s.diem = can; }, dem: ['gieo'], xong: s => moi(s, 'gieo') >= s.oMo || s.ruong.slice(0, s.oMo).every(r => r.cay) },
  { id: 'tuoi', kieu: 'lam', loi: 'Cây khát nước rồi! Chạm vào ô có 💧 để TƯỚI (hoặc vuốt qua cả 3 ô). Tưới đủ thì được thêm ' + Math.round(D.LUAT.tuoiThem * 100) + '% sản lượng.',
    muc: s => { const i = s.ruong.findIndex((r, i) => { const t = E.oTT(s, i); return t.tt === 'lon' && !t.tuoiHom; }); return i >= 0 ? { loai: 'ruong', i } : null; },
    xong: s => s.ruong.every((r, i) => { const t = E.oTT(s, i); return t.tt !== 'lon' || t.tuoiHom; }) },
  { id: 'phep', kieu: 'noi', loi: 'Cà rốt cần 1 ngày mới chín — thường thì sáng mai cháu quay lại là thu được. Lần đầu bác làm phép cho chín luôn nè!',
    khiTiep: s => { s.ruong.forEach(r => { if (!r.cay) return; const n = RUONG[r.cay].ngay; r.d0 -= n; r.tuoi = r.tuoi.map(d => d - n); r.bat = []; for (let d = r.d0 + 1; d <= r.d0 + n; d++) r.bat.push(d); }); } },
  { id: 'thu', kieu: 'lam', loi: 'Chín rồi! Chạm vào ô chín rồi VUỐT qua các ô để thu hoạch.',
    muc: s => ({ loai: 'ruong', i: Math.max(0, s.ruong.findIndex((r, i) => E.oTT(s, i).tt === 'chin')) }), dem: ['thu'],
    xong: s => moi(s, 'thu') >= s.oMo || !s.ruong.some((r, i) => E.oTT(s, i).tt === 'chin') },
  { id: 'ban', kieu: 'lam', loi: 'Mang cà rốt ra CHỢ bán nhé! Chạm vào sạp chợ (hoặc nút Chợ). Bán được EXP — đủ 100 EXP là thành 1 xu thật trong ví.',
    muc: () => [{ loai: 'sap' }, '#btnShop'], dem: ['ban'], xong: s => moi(s, 'ban') >= 1 },
  { id: 'sang', kieu: 'lam', loi: 'Giờ sang vườn bạn chơi! Chạm BẢNG TIN LỚP (hoặc nút Bạn bè) rồi chọn bạn có dấu 🤝 hoặc 🧺.',
    muc: () => [{ loai: 'bang' }, '#btnBan'],
    batDau: s => { let tot = 0, k0 = 0; D.BAN_AO.forEach((_, k) => { const t = E.tomTatBan(s, k), d = t.hai * 2 + t.giup; if (d > tot) { tot = d; k0 = k; } }); s.hd.ban = k0; },
    dem: ['tham'], xong: s => moi(s, 'tham') >= 1 },
  { id: 'giup', kieu: 'lam', loi: 'Ô có 💧 là bạn chưa tưới, 🐛 là có sâu. Chạm để GIÚP bạn — mỗi ngày giúp được 5 lượt, giúp nhiều thì lên cấp nhanh.',
    dem: ['giup'], xong: s => moi(s, 'giup') >= 1 || E.tomTatBan(s, ban(s)).giup === 0 },
  { id: 'trom', kieu: 'lam', loi: 'Ô có 🧺 là cây chín từ HÔM QUA mà bạn chưa hái — cháu hái được 1–2 quả (mỗi ngày 3 lượt). Cẩn thận chó nhà bạn đuổi đó!',
    dem: ['trom', 'biDuoi'], xong: s => moi(s, 'trom') + moi(s, 'biDuoi') >= 1 || E.tomTatBan(s, ban(s)).hai === 0 },
  { id: 've', kieu: 'lam', loi: 'Về nhà thôi! Bấm nút "⬅ Về nhà".', muc: () => '#nutVe', dem: ['veNha'], xong: s => moi(s, 'veNha') >= 1 },
  { id: 'cho', kieu: 'lam', loi: 'Xoa đầu chó của cháu nào! Mỗi ngày 1 lần. Chó quý cháu thì sẽ đuổi bạn đến hái trộm giúp cháu.',
    muc: () => ({ loai: 'thu', id: 'cho' }), dem: ['thuCung'], xong: s => moi(s, 'thuCung') >= 1 },
  { id: 'ket', kieu: 'noi', loi: 'Giỏi lắm! Mỗi ngày cháu ghé 1 lần: thu hoạch, chăm cây, giúp bạn, rồi gieo cho ngày mai. Muốn có nhiều bịch hạt giống thì làm bài để có ĐIỂM CHĂM CHỈ nhé. Bác tặng cháu ít quà!',
    thuong: D.PHA >= 2 ? { phan_bon: 2, tt_hoa: 1 } : { phan_bon: 3 } },
];
function hdKhoi(s) { if (!s.hd) s.hd = { b: 0, base: {}, xong: s.cap > 1 }; return s.hd; }
function hdBuoc(s) { const h = hdKhoi(s); return h.xong ? null : HD[h.b] || null; }
function vaoBuoc(s, su) {
  const h = s.hd, B = HD[h.b]; if (!B) { h.xong = true; return; }
  h.base = {}; for (const k of B.dem || []) h.base[k] = s.dem[k] || 0;
  if (B.batDau) B.batDau(s);
  su.push({ loai: 'hdBuoc', b: h.b });
}
function hetBuoc(s, su) {
  const h = s.hd, B = HD[h.b];
  if (B.thuong) for (const id in B.thuong) { E.them(s, id, B.thuong[id]); su.push({ loai: 'mon', id, n: B.thuong[id] }); }
  h.b++;
  if (h.b >= HD.length) { h.xong = true; if (s.nn < D.NN_MOC[2]) E.themNn(s, D.NN_MOC[2] - s.nn, su, true); su.push({ loai: 'hdXong' }); }
  else vaoBuoc(s, su);
}
function hdTiep(s) {
  const B = hdBuoc(s), su = []; if (!B || B.kieu !== 'noi') return { ok: false, su };
  if (B.khiTiep) B.khiTiep(s);
  hetBuoc(s, su); return { ok: true, su };
}
function hdBoQua(s) { hdKhoi(s).xong = true; return { ok: true, su: [] }; }
function hdKiem(s, su) { const B = hdBuoc(s); if (B && B.kieu === 'lam' && B.xong(s)) hetBuoc(s, su); }
function hdMuc(s) { const B = hdBuoc(s); return B && B.muc ? B.muc(s) : null; }

// mẹo lần đầu khi mở tính năng mới — cấp lấy từ bảng số liệu (tính năng pha sau có cấp SAU nên không bao giờ hiện)
const MEO = [
  { id: 'mo_o', cap: D.LUAT.oMo[0].cap, muc: s => ({ loai: 'ruong', i: s.oMo }), loi: 'Cháu mở được Ô RUỘNG MỚI rồi! Chạm vào ô đất có biển, trả bằng điểm chăm chỉ. Điểm có được khi làm bài trên app.' },
  { id: 'ga', cap: D.VAT.ga.cap, muc: () => ({ loai: 'chuong', id: 'ga' }), loi: 'Có CHUỒNG GÀ rồi! Mua gà ở chuồng, cho gà ăn lúa mì hoặc ngô, sáng mai gà đẻ trứng — thỉnh thoảng có cả phân bón.' },
  { id: 'lo', cap: D.LO_CAP, muc: () => ({ loai: 'lo' }), loi: 'LÒ BÁNH mở rồi! Mỗi ngày nướng 1 mẻ, sáng mai lấy bánh. Bánh bán được giá hơn nông sản.' },
  { id: 'meo', cap: D.THU.meo.cap, muc: () => ({ loai: 'thu', id: 'meo' }), loi: 'Một bé MÈO đến ở nhà cháu! Vuốt ve mỗi ngày — mèo quý cháu thì thỉnh thoảng tha quà về.' },
  { id: 'bo', cap: D.VAT.bo.cap, muc: () => ({ loai: 'chuong', id: 'bo' }), loi: 'Có BÃI CỎ BÒ rồi! Bò ăn ngô hoặc bí, sáng mai cho sữa. Sữa bán được giá cao.' },
  { id: 'chim', cap: D.THU.chim.cap, muc: () => ({ loai: 'thu', id: 'chim' }), loi: 'CHIM đến cột ăn rồi! Cho chim ăn 1 lúa mì mỗi ngày — chim quý cháu thì sáng nào cũng bắt sâu giúp.' },
];
function meoKe(s) { if (hdBuoc(s)) return null; s.meo = s.meo || {}; const m = MEO.find(m => m.cap <= s.cap && !s.meo[m.id]); return m ? Object.assign({}, m, { muc: m.muc(s) }) : null; }
function meoXong(s, id) { s.meo = s.meo || {}; s.meo[id] = 1; }

function tick(s) { const su = []; hdKhoi(s); hdKiem(s, su); return su; }
const soNhan = () => 0;

window.NT_NV = { NGUOI_HD, HD, MEO, hdBuoc, hdTiep, hdBoQua, hdMuc, meoKe, meoXong, tick, soNhan };
})();
