/* Nông Trại BK — NHỊP NGÀY: LÕI LUẬT (thuần logic, không đồ hoạ, không DOM). Thiết kế: spec-nong-trai-nhip-ngay.md (repo ERP).
   Mọi hành động = hàm (state, ...) → { ok, loi?, su: [sự kiện] }. Sự kiện chỉ để vẽ hiệu ứng, không mang luật.
   Mọi thứ tính theo NGÀY NÔNG TRẠI (đổi lúc 5 giờ sáng VN). Ngẫu nhiên (sâu, rơi đồ, bạn ảo) = hàm băm CỐ ĐỊNH theo khoá
   ⇒ bản online (hàm Postgres fn_nt_*, giờ server) suy lại được y hệt, không phải lưu dòng "chờ xử lý" (CLAUDE.md §1.5 / §4). */
(function () {
'use strict';
const D = window.NT_DATA, { RUONG, MUA, VAT, LO_CAP, BANH, TRANG_TRI, I, THU, NN_MOC, QUA_CAP, BAN_AO, LUAT } = D;
const NGAY = 86400e3, GIO = 3600e3, LECH = (7 - LUAT.gioDoiNgay) * GIO;
const KHOA_LUU = 'nongtrai_ngay_v1';

// ---------- ngẫu nhiên cố định theo khoá ----------
function bam(k) {
  let h = 2166136261;
  for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

// ---------- đồng hồ & ngày nông trại ----------
function gio(s) { const d = s.dongHo; return d.game + (Date.now() - d.thuc) * d.tocDo; }
function datTocDo(s, v) { const g = gio(s); s.dongHo = { tocDo: v, thuc: Date.now(), game: g }; }
const ngayCua = t => Math.floor((t + LECH) / NGAY);          // ngày nông trại chứa mốc t
const dauNgay = d => d * NGAY - LECH;                          // 5 giờ sáng VN của ngày nông trại d
const homNay = s => ngayCua(gio(s));
const gioVN = t => ((((t + 7 * GIO) % NGAY) + NGAY) % NGAY) / GIO;
const tuanCua = d => Math.floor((d + 3) / 7);                  // tuần bắt đầu thứ Hai
const thangCua = d => { const x = new Date(d * NGAY); return x.getUTCFullYear() * 12 + x.getUTCMonth(); };
const ngayVN = d => { const x = new Date(d * NGAY); return x.getUTCDate() + '/' + (x.getUTCMonth() + 1); };
// DEV: nhảy sang 18 giờ ngày nông trại hôm sau (giờ HS đi học về)
function sangNgayMoi(s) { s.dongHo = { tocDo: s.dongHo.tocDo, thuc: Date.now(), game: dauNgay(homNay(s) + 1) + 13 * GIO }; }

// ---------- mùa (mùa đầu 1 lần, sau đó xoay vòng các mùa còn lại) ----------
// bonus: M.bonus là số (cả mùa) hoặc mảng theo từng 30 ngày của mùa (mùa đầu: tháng 1 cao nhất, tháng sau giảm dần)
const bonusMua = (M, off) => Array.isArray(M.bonus) ? M.bonus[Math.min(M.bonus.length - 1, Math.floor(off / 30))] : (M.bonus || 0);
function muaCua(s, d) {
  let off = Math.max(0, d - s.ngay0);
  if (off < MUA[0].ngay) return { M: MUA[0], conNgay: MUA[0].ngay - off, dau: true, bonus: bonusMua(MUA[0], off) };
  off -= MUA[0].ngay;
  const vong = MUA.slice(1); let j = 0;
  while (off >= vong[j % vong.length].ngay) { off -= vong[j % vong.length].ngay; j++; }
  const M = vong[j % vong.length]; return { M, conNgay: M.ngay - off, dau: false, bonus: bonusMua(M, off) };
}
const muaHom = s => muaCua(s, homNay(s));
const bonusCua = (s, d0) => muaCua(s, d0).bonus;             // bonus mùa tính theo NGÀY GIEO

// ---------- tạo / lưu ----------
function moi() {
  const t = Date.now(), b = LUAT.batDau, d = ngayCua(t);
  const s = {
    v: 2, taoLuc: t, hat: String(Math.floor(Math.random() * 1e9)), dongHo: { tocDo: 1, thuc: t, game: t }, ngay0: d,
    vi: { xu: b.xu, exp: 0 }, diem: b.diem, nn: 0, cap: 1, kho: Object.assign({}, b.kho), oMo: LUAT.oDau, ruong: [], lo: null,
    vat: {}, thu: {}, trangTri: [], hom: null, tuan: null, thang: null, thuTu: [], thuMoi: 0, ban: {}, xuLy: d, dem: {},
  };
  return chuanHoa(s);
}
function chuanHoa(s) {
  while (s.ruong.length < LUAT.oToiDa) s.ruong.push({ cay: null });
  if (!(s.oMo >= LUAT.oDau)) s.oMo = LUAT.oDau;   // bản lưu từ thời bắt đầu 3 ô ⇒ nâng lên số ô đầu hiện hành
  if (NN_MOC[s.cap] != null && s.nn < NN_MOC[s.cap]) s.nn = NN_MOC[s.cap];   // bảng mốc cấp đổi ⇒ giữ cấp, điểm nhà nông về đầu cấp
  for (const k in VAT) if (!s.vat[k]) s.vat[k] = { con: [] };
  for (const k in THU) if (!s.thu[k]) s.thu[k] = { tc: 0, d: -1 };
  while (s.trangTri.length < LUAT.soChoTrangTri) s.trangTri.push(null);
  if (!s.dem) s.dem = {};
  return s;
}
function luu(s) { try { localStorage.setItem(KHOA_LUU, JSON.stringify(s)) } catch (e) { /* bộ nhớ bị chặn — chơi tiếp, không lưu */ } }
function nap() {
  try { const j = localStorage.getItem(KHOA_LUU); if (j) { const s = JSON.parse(j); if (s && s.v === 2) return chuanHoa(s) } } catch (e) {}
  return null;
}
function xoaLuu() { try { localStorage.removeItem(KHOA_LUU) } catch (e) {} }

// bộ đếm theo ngày / tuần / tháng — tự làm mới khi sang kỳ mới
function lamMoi(s) {
  const d = homNay(s);
  if (!s.hom || s.hom.d !== d) s.hom = { d, trom: 0, giup: 0, diem: 0, mua: 0, nn: 0 };
  if (s.hom.mua == null) s.hom.mua = 0;
  if (s.hom.nn == null) s.hom.nn = 0;
  if (!s.tuan || s.tuan.k !== tuanCua(d)) s.tuan = { k: tuanCua(d), xu: 0 };
  if (!s.thang || s.thang.k !== thangCua(d)) s.thang = { k: thangCua(d), ra: 0, vao: 0, chi: 0 };
  if (s.thang.chi == null) s.thang.chi = 0;
}

// ---------- tiện ích ----------
const so = (s, id) => s.kho[id] || 0;
function them(s, id, n) { s.kho[id] = (s.kho[id] || 0) + n; if (s.kho[id] <= 0) delete s.kho[id]; }
function dem(s, k, n) { s.dem[k] = (s.dem[k] || 0) + (n == null ? 1 : n); }
const loi = msg => ({ ok: false, loi: msg, su: [] });
const xong = su => ({ ok: true, su });
const ten = id => (I[id] || RUONG[id] || VAT[id] || THU[id] || { ten: id }).ten;
const nnCap = s => { const a = NN_MOC[s.cap], b = NN_MOC[s.cap + 1]; return b == null ? { co: s.nn - a, can: 0 } : { co: s.nn - a, can: b - a }; };
// điểm nhà nông có TRẦN MỖI NGÀY (LUAT.tranNnNgay) ⇒ cấp đi theo số ngày chăm vườn. boTran: quà hướng dẫn tân thủ (không tính trần)
function themNn(s, n, su, boTran) {
  if (!boTran && LUAT.tranNnNgay) { lamMoi(s); n = Math.min(n, Math.max(0, LUAT.tranNnNgay - s.hom.nn)); s.hom.nn += n; }
  if (n <= 0) return;
  s.nn += n; dem(s, 'nn', n);
  while (NN_MOC[s.cap + 1] != null && s.nn >= NN_MOC[s.cap + 1]) {
    s.cap++; const q = QUA_CAP[s.cap] || {};
    for (const id in q) them(s, id, q[id]);
    su.push({ loai: 'lenCap', cap: s.cap, qua: q });
  }
}
function roiDo(s, k, tiLe, su) { // vật phẩm bất ngờ
  if (bam(k + '|roi') >= tiLe) return;
  let x = bam(k + '|roiLoai'), id = null;
  for (const [loai, p] of LUAT.roiLoai) { if (x < p) { id = loai; break; } x -= p; }
  if (!id) id = 'phan_bon';
  if (id === 'trangtri') { const ds = Object.keys(TRANG_TRI); id = ds[Math.floor(bam(k + '|tt') * ds.length)]; }
  them(s, id, 1); dem(s, 'roi'); su.push({ loai: 'mon', id, n: 1, roi: true });
}

// ---------- TIỀN: xu + EXP lẻ (100 EXP = 1 xu) ----------
const tranThang = s => muaHom(s).dau ? LUAT.tranXuThangMuaDau : LUAT.tranXuThang;
// kiểm trả được không (không đổi state) → null = được, chuỗi = lý do
function kiemTra(s, gia) {
  lamMoi(s);
  // trần chi mỗi tháng tính MỌI khoản mua bằng tiền (EXP lẻ lẫn xu chẵn) — không thì tiền lẻ bán hàng quay vòng mua mãi
  if (LUAT.tranXuTieuThang && s.thang.chi + gia > LUAT.tranXuTieuThang * 100) return 'Tháng này đã dùng đủ ' + LUAT.tranXuTieuThang + ' xu (' + LUAT.tranXuTieuThang * 100 + ' EXP) để mua — trả bằng điểm chăm chỉ hoặc chờ tháng sau';
  const v = s.vi; if (v.exp >= gia) return null;
  const can = Math.ceil((gia - v.exp) / 100);
  if (v.xu < can) return 'Không đủ tiền — cần ' + gia + ' EXP';
  if (LUAT.tranXuTuan && s.tuan.xu + can > LUAT.tranXuTuan) return 'Tuần này đã tiêu ' + s.tuan.xu + '/' + LUAT.tranXuTuan + ' xu — trả bằng điểm chăm chỉ hoặc chờ tuần sau';
  return null;
}
// trả gia EXP: trừ phần lẻ trước, thiếu thì đổi xu ra EXP (tính vào trần xu tiêu mỗi tuần)
function tra(s, gia) {
  const e = kiemTra(s, gia); if (e) return e;
  const v = s.vi; s.thang.chi += gia; dem(s, 'chiExp', gia);
  if (v.exp >= gia) { v.exp -= gia; return null; }
  const can = Math.ceil((gia - v.exp) / 100);
  v.xu -= can; v.exp += can * 100 - gia; s.tuan.xu += can; s.thang.vao += can; dem(s, 'xuTieu', can);
  return null;
}
// đủ 100 EXP thì thành 1 xu — trần tính theo xu MỚI ròng trong tháng (ra − vào); chạm trần thì EXP dồn lại, sang tháng mới đổi tiếp
function doiXu(s, su) {
  lamMoi(s); const tran = tranThang(s); let k = 0;
  while (s.vi.exp >= 100 && s.thang.ra - s.thang.vao < tran) { s.vi.exp -= 100; s.vi.xu++; s.thang.ra++; k++; }
  if (k) { dem(s, 'xuRa', k); if (su) su.push({ loai: 'doiXu', n: k }); }
  return k;
}
function nhanExp(s, n, su) { s.vi.exp += n; dem(s, 'expBan', n); su.push({ loai: 'exp', n }); doiXu(s, su); }
const chamTran = s => { lamMoi(s); return s.thang.ra - s.thang.vao >= tranThang(s); };

// ---------- RUỘNG: trạng thái 1 ô (dùng chung cho vườn mình và vườn bạn) ----------
// r = { cay, d0: ngày gieo, tuoi: [ngày đã tưới], bat: [ngày sâu đã bị bắt], bon, trom: số quả đã mất }
function sauCua(r, k, Dn) { // các ngày sâu xuất hiện mà chưa ai bắt (sâu bò tới lúc 5 giờ sáng, từ hôm sau ngày gieo tới ngày chín)
  const dr = r.d0 + RUONG[r.cay].ngay, ds = [];
  for (let d = r.d0 + 1; d <= Math.min(Dn, dr); d++) if (bam(k + '|' + r.d0 + '|s' + d) < LUAT.sauTiLe && !(r.bat || []).includes(d)) ds.push(d);
  return ds;
}
function sanLuong(r, k, soSau, bonus, tuoiThem) {
  const C = RUONG[r.cay], dr = r.d0 + C.ngay;
  const soTuoi = Math.min(C.ngay, new Set((r.tuoi || []).filter(d => d >= r.d0 && d < dr)).size + (tuoiThem || 0));
  const heTuoi = LUAT.tuoiThem * soTuoi / C.ngay, heBon = r.bon ? LUAT.bonThem : 0, heSau = Math.max(0, 1 - LUAT.sauTru * soSau);
  const y = C.goc * (1 + heTuoi) * (1 + heBon) * heSau * (1 + bonus);
  const n = Math.floor(y + 1e-9) + (bam(k + '|' + r.d0 + '|le') < y - Math.floor(y + 1e-9) ? 1 : 0);
  return { n, y, goc: C.goc, soTuoi, ngay: C.ngay, tuoi: heTuoi, bon: heBon, sau: soSau, bonus };
}
function ttO(r, k, Dn, bonus) {
  if (!r || !r.cay) return { tt: 'trong' };
  const C = RUONG[r.cay], dr = r.d0 + C.ngay, sau = sauCua(r, k, Dn).length, sl = sanLuong(r, k, sau, bonus);
  const trom = r.trom || 0, chung = { cay: r.cay, dr, sau, sl, bon: !!r.bon, trom, con: Math.max(0, sl.n - trom) };
  if (Dn < dr) {
    const tuoiHom = (r.tuoi || []).includes(Dn);
    const du = sanLuong(r, k, sau, bonus, (dr - Dn) - (tuoiHom ? 1 : 0)); // dự kiến nếu từ giờ tưới đủ mỗi ngày
    return Object.assign({ tt: 'lon', conNgay: dr - Dn, tuoiHom, duKien: du.n }, chung);
  }
  return Object.assign({ tt: 'chin', quaHan: Dn > dr, tromDuoc: Math.max(0, tranTrom(sl.n) - trom) }, chung);
}
const khoaO = (s, i) => s.hat + '|o' + i;
// trần bị hái trộm của 1 ô: 30% sản lượng, ô từ 3 quả trở lên luôn hái được ít nhất 1 quả (ô ít quả hơn thì không ai hái được)
const tranTrom = n => n >= 3 ? Math.max(1, Math.floor(n * LUAT.tromToiDa)) : 0;
function oTT(s, i) {
  if (i >= s.oMo) return { tt: 'khoa', cfg: LUAT.oMo[i - LUAT.oDau], ke: i === s.oMo };
  const r = s.ruong[i];
  return ttO(r, khoaO(s, i), homNay(s), r.cay ? bonusCua(s, r.d0) : 0);
}
// giống bán ở cửa hàng hôm nay (quanh năm + đúng mùa), kể cả giống chưa tới cấp (UI hiện khoá)
function hatHom(s) { const m = muaHom(s).M.so; return Object.values(RUONG).filter(C => C.mua === 0 || C.mua === m).sort((a, b) => a.cap - b.cap); }

// bảng tính lãi cho HS tự so sánh (giả định tưới đủ mọi ngày; có bón thì trừ tiền phân) — số nhà nông tự tính được bằng tay
function bangLai(s) {
  const b = muaHom(s).bonus, r1 = x => Math.round(x * 10) / 10;
  return hatHom(s).map(C => {
    const tuoi = C.goc * (1 + LUAT.tuoiThem) * (1 + b), bon = tuoi * (1 + LUAT.bonThem);
    return { id: C.id, ten: C.ten, ngay: C.ngay, cap: C.cap, hat: C.hat, diem: C.diem, goc: C.goc, gia: C.gia, tuoi: r1(tuoi), bon: r1(bon),
      thuNgay: r1(tuoi * C.gia / C.ngay), laiNgay: r1((tuoi * C.gia - C.hat) / C.ngay), laiNgayBon: r1((bon * C.gia - C.hat - LUAT.giaPhan) / C.ngay) };
  });
}

// ---------- HÀNH ĐỘNG: RUỘNG ----------
function moO(s) {
  const i = s.oMo; if (i >= LUAT.oToiDa) return loi('Đã mở hết ô ruộng');
  const c = LUAT.oMo[i - LUAT.oDau];
  if (s.cap < c.cap) return loi('Ô tiếp theo mở ở cấp ' + c.cap);
  if (s.diem < c.diem) return loi('Cần ' + c.diem + ' điểm chăm chỉ (đang có ' + s.diem + ') — làm bài để có điểm');
  s.diem -= c.diem; s.oMo++; dem(s, 'moO'); dem(s, 'diemTieu', c.diem);
  return xong([{ loai: 'diemTru', n: c.diem }, { loai: 'moO', i }]);
}
function gieo(s, i, cay, cach) { // cach: 'diem' | 'exp'
  const tt = oTT(s, i); if (tt.tt === 'khoa') return loi('Ô này chưa mở'); if (tt.tt !== 'trong') return loi('Ô này đang có cây');
  const C = RUONG[cay]; if (!C) return loi('');
  if (s.cap < C.cap) return loi(C.ten + ' mở ở cấp ' + C.cap);
  const m = muaHom(s); if (C.mua && C.mua !== m.M.so) return loi(C.ten + ' không phải cây mùa ' + m.M.ten);
  lamMoi(s); if (s.hom.mua >= s.oMo) return loi('Hôm nay đã mua đủ ' + s.oMo + ' bịch hạt giống (bằng số ô) — mai mua tiếp nhé');
  const su = [];
  if (cach === 'diem') {
    if (s.diem < C.diem) return loi('Không đủ điểm chăm chỉ — làm thêm 1 lượt bài để có điểm');
    s.diem -= C.diem; dem(s, 'diemTieu', C.diem); su.push({ loai: 'diemTru', n: C.diem });
  } else { const e = tra(s, C.hat); if (e) return loi(e); su.push({ loai: 'expTru', n: C.hat }); }
  s.ruong[i] = { cay, d0: homNay(s), tuoi: [], bat: [], bon: false, trom: 0, cach }; s.hom.mua++;
  dem(s, 'gieo'); dem(s, 'gieo:' + cay); dem(s, 'gieoBang:' + cach);
  su.push({ loai: 'gieo', i, cay });
  return xong(su);
}
function tuoi(s, i) {
  const tt = oTT(s, i);
  if (tt.tt !== 'lon') return loi(tt.tt === 'chin' ? 'Cây chín rồi — thu hoạch thôi' : '');
  if (tt.tuoiHom) return loi('Hôm nay tưới rồi');
  s.ruong[i].tuoi.push(homNay(s)); dem(s, 'tuoi');
  const su = [{ loai: 'tuoi', i }]; if (LUAT.nnTuoi) themNn(s, LUAT.nnTuoi, su);   // chăm vườn mỗi ngày cũng lên cấp
  return xong(su);
}
function bon(s, i) {
  const tt = oTT(s, i);
  if (tt.tt !== 'lon') return loi('Chỉ bón cho cây đang lớn');
  if (tt.bon) return loi('Vụ này bón rồi');
  if (so(s, 'phan_bon') < 1) return loi('Hết phân bón — mua ở chợ (' + LUAT.giaPhan + ' EXP) hoặc nhặt ở chuồng gà, bò');
  them(s, 'phan_bon', -1); s.ruong[i].bon = true; dem(s, 'bon');
  return xong([{ loai: 'bon', i }]);
}
function batSau(s, i) {
  const tt = oTT(s, i); if (!tt.sau) return loi('Không có sâu');
  const ds = sauCua(s.ruong[i], khoaO(s, i), homNay(s)); s.ruong[i].bat.push(...ds); dem(s, 'batSau', ds.length);
  return xong([{ loai: 'batSau', i, n: ds.length }]);
}
function thu(s, i) {
  const tt = oTT(s, i);
  if (tt.tt !== 'chin') return loi(tt.tt === 'lon' ? 'Chưa chín — còn ' + tt.conNgay + ' ngày' : '');
  const r = s.ruong[i], su = [{ loai: 'thu', i, cay: r.cay, n: tt.con, sl: tt.sl, trom: tt.trom }];
  if (tt.con > 0) { them(s, r.cay, tt.con); su.push({ loai: 'mon', id: r.cay, n: tt.con }); }
  roiDo(s, khoaO(s, i) + '|' + r.d0, r.bon ? LUAT.roiBon : LUAT.roiGoc, su);
  themNn(s, LUAT.nnThu * RUONG[r.cay].ngay, su); dem(s, 'thu'); dem(s, 'thuQua', tt.con); dem(s, 'thu:' + r.cay, tt.con);   // cây n ngày = nnThu × n điểm nhà nông
  s.ruong[i] = { cay: null };
  return xong(su);
}

// ---------- CON VẬT: gà, bò ----------
function toiDaVat(s, k) { let n = 0; for (const [c, m] of VAT[k].toiDa) if (s.cap >= c) n = m; return n; }
const vatTT = (s, k, c) => c.an == null ? 'doi' : homNay(s) > c.an ? 'xong' : 'an';
function muaVat(s, k) {
  const V = VAT[k];
  if (s.cap < V.cap) return loi(V.ten + ' mở ở cấp ' + V.cap);
  if (s.vat[k].con.length >= toiDaVat(s, k)) return loi('Chuồng đầy — lên cấp để nuôi thêm');
  const e = tra(s, V.gia); if (e) return loi(e);
  s.vat[k].con.push({ an: null }); dem(s, 'muaVat');
  return xong([{ loai: 'expTru', n: V.gia }, { loai: 'muaVat', vat: k }]);
}
function choAn(s, k, mon) {
  const V = VAT[k], can = V.an[mon]; if (!can) return loi('');
  const doi = s.vat[k].con.filter(c => c.an == null);
  if (!doi.length) return loi('Các bé no cả rồi');
  if (so(s, mon) < can) return loi('Cần ' + can + ' ' + ten(mon).toLowerCase() + ' cho 1 con');
  let n = 0; const d = homNay(s);
  for (const c of doi) { if (so(s, mon) < can) break; them(s, mon, -can); c.an = d; n++; }
  dem(s, 'choAn', n);
  return xong([{ loai: 'choAn', vat: k, n, mon }]);
}
function thuVat(s, k) {
  const V = VAT[k], su = []; let n = 0, phan = 0;
  s.vat[k].con.forEach((c, j) => {
    if (vatTT(s, k, c) !== 'xong') return;
    them(s, V.ra, 1); n++;
    if (bam(s.hat + '|v' + k + j + '|' + c.an) < V.phan) { them(s, 'phan_bon', 1); phan++; }
    c.an = null;
  });
  if (!n) return loi('Chưa có gì để nhặt');
  su.push({ loai: 'thuVat', vat: k, n }, { loai: 'mon', id: V.ra, n });
  if (phan) su.push({ loai: 'mon', id: 'phan_bon', n: phan });
  themNn(s, n, su); dem(s, 'nhat:' + V.ra, n);
  return xong(su);
}

// ---------- LÒ BÁNH (1 mẻ, sáng hôm sau xong) ----------
function loTT(s) { if (s.cap < LO_CAP) return { tt: 'khoa' }; if (!s.lo) return { tt: 'trong' }; return { tt: homNay(s) > s.lo.d ? 'xong' : 'dang', mon: s.lo.mon }; }
function nuong(s, id) {
  const B = BANH[id], tt = loTT(s);
  if (!B) return loi('');
  if (tt.tt === 'khoa') return loi('Lò bánh mở ở cấp ' + LO_CAP);
  if (tt.tt !== 'trong') return loi(tt.tt === 'xong' ? 'Lấy mẻ bánh cũ ra trước' : 'Lò đang nướng — sáng mai xong');
  if (s.cap < B.cap) return loi(B.ten + ' mở ở cấp ' + B.cap);
  for (const k in B.can) if (so(s, k) < B.can[k]) return loi('Thiếu ' + ten(k).toLowerCase() + ' (cần ' + B.can[k] + ', có ' + so(s, k) + ')');
  for (const k in B.can) them(s, k, -B.can[k]);
  s.lo = { mon: id, d: homNay(s) }; dem(s, 'nuong');
  return xong([{ loai: 'nuong', mon: id }]);
}
function layBanh(s) {
  const tt = loTT(s); if (tt.tt !== 'xong') return loi('Bánh chưa xong — sáng mai nhé');
  const id = s.lo.mon, su = [{ loai: 'layBanh', mon: id }, { loai: 'mon', id, n: 1 }];
  them(s, id, 1); s.lo = null; themNn(s, 2, su); dem(s, 'banh');
  return xong(su);
}

// ---------- CHỢ ----------
function ban(s, id, n) {
  const P = I[id]; if (!P || !P.gia) return loi('Món này không bán được');
  n = Math.min(Math.floor(n), so(s, id)); if (n < 1) return loi('Hết ' + P.ten.toLowerCase());
  them(s, id, -n); const su = [{ loai: 'ban', id, n }];
  nhanExp(s, P.gia * n, su); dem(s, 'ban', n);
  return xong(su);
}
function muaPhan(s, n) {
  n = n || 1; const e = tra(s, LUAT.giaPhan * n); if (e) return loi(e);
  them(s, 'phan_bon', n); dem(s, 'muaPhan', n);
  return xong([{ loai: 'expTru', n: LUAT.giaPhan * n }, { loai: 'mon', id: 'phan_bon', n }]);
}

// ---------- ĐIỂM CHĂM CHỈ (demo: giả lập 1 lượt 10 câu; bản online: hàm đọc lịch sử lượt Tự luyện/Thử thách) ----------
function lamLuot(s, dung) {
  lamMoi(s);
  if (dung < LUAT.nguongDat) return loi('Đúng ' + dung + '/10 — cần từ ' + LUAT.nguongDat + ' câu mới được điểm. Làm lại nhé!');
  const con = LUAT.tranDiemNgay - s.hom.diem;
  if (con <= 0) return loi('Hôm nay đã đủ ' + LUAT.tranDiemNgay + ' điểm chăm chỉ — mai làm tiếp nhé');
  const n = Math.min(dung, con); s.diem += n; s.hom.diem += n; dem(s, 'diem', n);
  return xong([{ loai: 'diem', n }]);
}

// ---------- THÚ CƯNG (thiện cảm) ----------
const mocTc = tc => LUAT.tcMoc.filter(m => tc >= m).length;
function thuTT(s, k) { const x = s.thu[k]; return { mo: s.cap >= THU[k].cap, tc: x.tc, moc: mocTc(x.tc), roi: x.d === homNay(s) }; }
function choiThu(s, k) {
  const T = THU[k], x = s.thu[k];
  if (s.cap < T.cap) return loi(T.ten + ' đến ở cấp ' + T.cap);
  if (x.d === homNay(s)) return loi('Hôm nay chơi với ' + T.ten.toLowerCase() + ' rồi — mai nhé');
  if (T.an) { if (so(s, T.an) < 1) return loi('Cần 1 ' + ten(T.an).toLowerCase() + ' để cho chim ăn'); them(s, T.an, -1); }
  const m0 = mocTc(x.tc); x.tc = Math.min(100, x.tc + LUAT.tcMoi); x.d = homNay(s); dem(s, 'thuCung');
  const su = [{ loai: 'thuCung', thu: k, tc: x.tc }];
  if (mocTc(x.tc) > m0) su.push({ loai: 'tcMoc', thu: k, moc: mocTc(x.tc) });
  return xong(su);
}

// ---------- TRANG TRÍ ----------
function datTT(s, o, id) {
  if (o < 0 || o >= s.trangTri.length) return loi('');
  if (!TRANG_TRI[id] || so(s, id) < 1) return loi('Không có món này');
  const cu = s.trangTri[o]; them(s, id, -1); if (cu) them(s, cu, 1); s.trangTri[o] = id; dem(s, 'trangTri');
  return xong([{ loai: 'trangTri', o, id }]);
}
function goTT(s, o) { const cu = s.trangTri[o]; if (!cu) return loi(''); them(s, cu, 1); s.trangTri[o] = null; return xong([{ loai: 'goTT', o }]); }

// ---------- VƯỜN BẠN (ảo ở demo) ----------
// Suy vườn bạn k lúc này từ lịch vào vườn của bạn (chuky/lech/gio) + những gì MÌNH đã làm ở đó (s.ban[k]). Không lưu vườn bạn.
function daVaoCua(B, Dn, g) { return v => (v + B.lech) % B.chuky === 0 && (v < Dn || g >= B.gio); }
function banTT(s, k) {
  const B = BAN_AO[k], t = gio(s), Dn = ngayCua(t), vao = daVaoCua(B, Dn, gioVN(t)), my = s.ban[k] || {}, hat = 'b' + k;
  const ruong = B.cay.map(() => ({ cay: null }));
  let lanCuoi = null;
  for (let v = Dn - 30; v <= Dn; v++) {
    if (!vao(v)) continue; lanCuoi = v;
    ruong.forEach((r, j) => {
      if (r.cay && v >= r.d0 + RUONG[r.cay].ngay) r.cay = null;                                   // bạn thu hoạch
      if (!r.cay) Object.assign(r, { cay: B.cay[j], d0: v, tuoi: [], bat: [], bon: bam(hat + j + '|' + v + '|bon') < 0.4, trom: 0 });
      if (v < r.d0 + RUONG[r.cay].ngay) r.tuoi.push(v);                                             // bạn tưới
      for (let d = r.d0 + 1; d <= v; d++) if (!r.bat.includes(d)) r.bat.push(d);                  // bạn bắt sâu
    });
  }
  ruong.forEach((r, j) => {
    if (!r.cay) return;
    const key = j + ':' + r.d0, dr = r.d0 + RUONG[r.cay].ngay;
    if (my.tuoi && my.tuoi[key]) r.tuoi.push(...my.tuoi[key]);
    if (my.bat && my.bat[key]) r.bat.push(...my.bat[key]);
    const tt0 = ttO(r, hat + '|' + j, Dn, bonusCua(s, r.d0)), tran = tranTrom(tt0.sl.n);
    const khac = Dn > dr ? Math.max(0, Math.min(Dn - dr - 1, tran - 1)) : 0;                     // các bạn khác trong lớp cũng ghé
    r.trom = khac + (my.trom && my.trom[key] || 0);
    r.daHai = !!(my.trom && key in my.trom);
  });
  const vat = { ga: { con: Array.from({ length: B.ga }, () => ({ an: lanCuoi })) }, bo: { con: Array.from({ length: B.bo }, () => ({ an: lanCuoi })) } };
  const tts = Object.keys(TRANG_TRI), trangTri = Array.from({ length: LUAT.soChoTrangTri }, (_, o) => bam(hat + '|tt' + o) < 0.4 ? tts[Math.floor(bam(hat + '|ttl' + o) * tts.length)] : null);
  return { k, ten: B.ten, cap: B.cap, hat, oMo: ruong.length, ruong, vat, lo: null, trangTri, thu: { cho: { tc: [0, 20, 50, 100][B.cho], d: -1 }, meo: { tc: 0, d: -1 }, chim: { tc: 0, d: -1 } }, laBan: true };
}
function oBanTT(s, st, j) { const r = st.ruong[j]; return ttO(r, st.hat + '|' + j, homNay(s), r.cay ? bonusCua(s, r.d0) : 0); }
function tomTatBan(s, k) { // cho bảng tin lớp: số ô giúp được / hái được
  const st = banTT(s, k); let giup = 0, hai = 0;
  st.ruong.forEach((r, j) => { const tt = oBanTT(s, st, j); if (tt.tt === 'lon' && (!tt.tuoiHom || tt.sau)) giup++; else if (tt.tt === 'chin' && tt.sau) giup++; if (tt.tt === 'chin' && tt.quaHan && tt.tromDuoc > 0 && !r.daHai) hai++; });
  return { giup, hai };
}
function tromBan(s, k, j) {
  lamMoi(s);
  if (s.hom.trom >= LUAT.trom) return loi('Hôm nay đã hái trộm đủ ' + LUAT.trom + ' lượt');
  const st = banTT(s, k), r = st.ruong[j]; if (!r || !r.cay) return loi('');
  const tt = oBanTT(s, st, j);
  if (tt.tt !== 'chin') return loi('Cây chưa chín');
  if (!tt.quaHan) return loi('Hôm nay cây mới chín — là ngày của ' + st.ten + '. Mai bạn chưa hái thì mới hái được');
  if (r.daHai) return loi('Em hái ô này rồi');
  if (tt.tromDuoc < 1) return loi(tt.trom ? 'Ô này bị hái nhiều rồi — để phần cho bạn nhé' : 'Ô này ít quả quá — để phần cho bạn nhé');
  const key = j + ':' + r.d0, my = s.ban[k] = s.ban[k] || {}, kk = s.hat + '|trom|' + k + '|' + key;
  my.trom = my.trom || {}; s.hom.trom++;
  if (bam(kk + '|cho') < LUAT.choDuoi[BAN_AO[k].cho]) { my.trom[key] = 0; dem(s, 'biDuoi'); return xong([{ loai: 'choDuoi', ban: k, j }]); }
  const n = Math.min(tt.tromDuoc, LUAT.tromMoiLan || (bam(kk + '|n') < 0.5 ? 1 : 2));
  my.trom[key] = n; them(s, r.cay, n); dem(s, 'trom'); dem(s, 'tromQua', n); dem(s, 'tromExp', n * (I[r.cay] ? I[r.cay].gia : 0));
  return xong([{ loai: 'trom', ban: k, j, n, cay: r.cay }, { loai: 'mon', id: r.cay, n }]);
}
function giupBan(s, k, j) {
  lamMoi(s);
  if (s.hom.giup >= LUAT.giup) return loi('Hôm nay đã giúp đủ ' + LUAT.giup + ' lượt');
  const st = banTT(s, k), r = st.ruong[j]; if (!r || !r.cay) return loi('Ô này không cần giúp');
  const Dn = homNay(s), tt = oBanTT(s, st, j), key = j + ':' + r.d0, my = s.ban[k] = s.ban[k] || {}, su = [];
  if (tt.tt === 'lon' && !tt.tuoiHom) { my.tuoi = my.tuoi || {}; (my.tuoi[key] = my.tuoi[key] || []).push(Dn); su.push({ loai: 'giupTuoi', ban: k, j }); }
  else if (tt.sau) { my.bat = my.bat || {}; (my.bat[key] = my.bat[key] || []).push(...sauCua(r, st.hat + '|' + j, Dn)); su.push({ loai: 'giupBat', ban: k, j }); }
  else return loi('Ô này không cần giúp');
  s.hom.giup++; dem(s, 'giup');
  themNn(s, 1, su); roiDo(s, s.hat + '|giup|' + k + '|' + key + '|' + Dn + '|' + s.hom.giup, LUAT.roiGiup, su);
  return xong(su);
}

// ---------- VIỆC HÔM NAY (thanh chỉ đường — SUY từ state, không lưu gì thêm, không thưởng) ----------
// → [{ id, ten, icon, lam, can, xong }], chỉ những việc ĐANG ÁP DỤNG (đã mở theo cấp/PHA, có việc thật).
// thu, sau = việc TỒN (lam luôn 0, làm hết thì biến mất — không suy được "đã thu mấy ô hôm nay" mà không lưu thêm)
// còn lại = đã làm / cần làm hôm nay (xong thì vẫn hiện, gạch đi).
const TEN_THU = { cho: 'Xoa đầu chó', meo: 'Vuốt ve mèo', chim: 'Cho chim ăn' }, IC_VIEC = { ga: '🐔', bo: '🐄', cho: '🐶', meo: '🐱', chim: '🐦' };
function viecHom(s) {
  lamMoi(s);
  const Dn = homNay(s), ds = [], tts = [];
  const viec = (id, ten, icon, lam, can) => { if (can > 0) ds.push({ id, ten, icon, lam: Math.min(lam, can), can, xong: lam >= can }); };
  for (let i = 0; i < s.oMo; i++) tts.push(oTT(s, i));
  const lon = tts.filter(t => t.tt === 'lon');
  viec('thu', 'Thu hoạch', '🧺', 0, tts.filter(t => t.tt === 'chin').length);
  // gieo: ô đã gieo hôm nay + ô trống còn gieo được (trần bịch/ngày = số ô, và trả nổi ít nhất 1 bịch bằng điểm hoặc tiền)
  const daGieo = s.ruong.slice(0, s.oMo).filter(r => r.cay && r.d0 === Dn).length, trong = tts.filter(t => t.tt === 'trong').length;
  const traNoi = hatHom(s).some(C => C.cap <= s.cap && (s.diem >= C.diem || !kiemTra(s, C.hat)));
  viec('gieo', 'Gieo hạt', '🌱', daGieo, daGieo + (traNoi ? Math.min(trong, Math.max(0, s.oMo - (s.hom.mua || 0))) : 0));
  viec('tuoi', 'Tưới', '💧', lon.filter(t => t.tuoiHom).length, lon.length);
  viec('sau', 'Bắt sâu', '🐛', 0, lon.reduce((a, t) => a + t.sau, 0));   // sâu trên ô chín: thu hoạch tự bắt luôn
  for (const k in VAT) { const con = s.vat[k].con; if (s.cap >= VAT[k].cap) viec('an_' + k, 'Cho ' + VAT[k].ten.toLowerCase() + ' ăn', IC_VIEC[k], con.filter(c => c.an === Dn).length, con.length); }
  for (const k in THU) { const x = thuTT(s, k); if (x.mo) viec('tc_' + k, TEN_THU[k] || THU[k].viec, IC_VIEC[k] || '💗', x.roi ? 1 : 0, 1); }
  // vườn bạn: cần = đã làm + còn làm được, chặn ở trần lượt/ngày
  let giup = 0, hai = 0;
  BAN_AO.forEach((_, k) => {
    const st = banTT(s, k);
    st.ruong.forEach((r, j) => {
      const t = oBanTT(s, st, j);
      if (t.tt === 'lon' && !t.tuoiHom) giup++;
      if (t.sau) giup++;
      if (t.tt === 'chin' && t.quaHan && t.tromDuoc > 0 && !r.daHai) hai++;
    });
  });
  viec('giup', 'Giúp bạn', '🤝', s.hom.giup, Math.min(LUAT.giup, s.hom.giup + giup));
  viec('hai', 'Hái trộm', '🤫', s.hom.trom, Math.min(LUAT.trom, s.hom.trom + hai));
  return ds;
}

// ---------- NHỊP: xử lý những ngày đã qua (bạn ảo ghé vườn mình, chim bắt sâu, mèo tha quà) ----------
function thuTin(s, d, ai, viec, o, mon, n) { s.thuTu.unshift({ d, ai, viec, o, mon, n }); s.thuMoi++; if (s.thuTu.length > LUAT.thuToiDa) s.thuTu.length = LUAT.thuToiDa; }
function capNhat(s) {
  lamMoi(s); const Dn = homNay(s), su = [];
  if (s.xuLy >= Dn) return su;
  for (let d = s.xuLy + 1; d <= Dn; d++) {
    // chim (thiện cảm ≥ 50): mỗi sáng bắt 1 con sâu
    if (s.cap >= THU.chim.cap && s.thu.chim.tc >= LUAT.chimBatSau) for (let i = 0; i < s.oMo; i++) {
      const r = s.ruong[i]; if (!r.cay) continue; const ds = sauCua(r, khoaO(s, i), d);
      if (ds.length) { r.bat.push(ds[0]); thuTin(s, d, 'chim', 'batSau', i); break; }
    }
    // bạn ghé tưới hộ (chỉ tính những ngày đã qua — hôm nay bạn chưa tới)
    if (d < Dn) BAN_AO.forEach((B, k) => {
      if (bam(s.hat + '|bg|' + k + '|' + d) >= B.giupTiLe) return;
      for (let i = 0; i < s.oMo; i++) {
        const r = s.ruong[i]; if (!r.cay) continue; const dr = r.d0 + RUONG[r.cay].ngay;
        if (d >= r.d0 && d < dr && !r.tuoi.includes(d)) { r.tuoi.push(d); thuTin(s, d, B.ten, 'tuoi', i); return; }
      }
    });
    // bạn ghé hái trộm ô chín từ hôm trước mà mình chưa hái
    BAN_AO.forEach((B, k) => {
      if (bam(s.hat + '|bt|' + k + '|' + d) >= B.tromTiLe) return;
      for (let i = 0; i < s.oMo; i++) {
        const r = s.ruong[i]; if (!r.cay) continue;
        const tt = ttO(r, khoaO(s, i), d, bonusCua(s, r.d0)); if (tt.tt !== 'chin' || !tt.quaHan || tt.tromDuoc < 1) continue;
        const kk = s.hat + '|bt|' + k + '|' + d + '|' + i;
        if (bam(kk + '|cho') < LUAT.choDuoi[mocTc(s.thu.cho.tc)]) { thuTin(s, d, B.ten, 'choDuoi', i); dem(s, 'choDuoiDuoc'); return; }
        const n = Math.min(tt.tromDuoc, LUAT.tromMoiLan || (bam(kk + '|n') < 0.5 ? 1 : 2));
        r.trom = (r.trom || 0) + n; dem(s, 'biTrom', n); thuTin(s, d, B.ten, 'trom', i, r.cay, n); return;
      }
    });
    // mèo tha quà
    if (s.cap >= THU.meo.cap && bam(s.hat + '|meo|' + d) < LUAT.meoQua(s.thu.meo.tc)) {
      const tts = Object.keys(TRANG_TRI), id = bam(s.hat + '|meoL|' + d) < 0.7 ? 'phan_bon' : tts[Math.floor(bam(s.hat + '|meoT|' + d) * tts.length)];
      them(s, id, 1); thuTin(s, d, 'meo', 'qua', null, id, 1);
    }
  }
  s.xuLy = Dn;
  doiXu(s, su); // sang tháng mới: EXP còn dồn đổi tiếp
  return su;
}

window.NT_ENGINE = {
  NGAY, GIO, bam, gio, datTocDo, ngayCua, dauNgay, homNay, gioVN, ngayVN, sangNgayMoi, muaCua, muaHom, tranThang, chamTran,
  moi, chuanHoa, luu, nap, xoaLuu, lamMoi, so, them, dem, ten, nnCap, themNn, kiemTra, doiXu,
  oTT, ttO, sauCua, hatHom, bangLai, toiDaVat, vatTT, loTT, thuTT, mocTc, banTT, oBanTT, tomTatBan, viecHom,
  moO, gieo, tuoi, bon, batSau, thu, muaVat, choAn, thuVat, nuong, layBanh, ban, muaPhan, lamLuot, choiThu, datTT, goTT, tromBan, giupBan, capNhat,
};
})();
