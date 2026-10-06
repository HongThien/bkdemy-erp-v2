/* Nông Trại BK — NHỊP NGÀY: BẢNG SỐ LIỆU (thiết kế: spec-nong-trai-nhip-ngay.md ở repo ERP).
   HS vào 1 lần/ngày, 10–15 phút. Mọi thứ chín / đẻ / nướng theo NGÀY NÔNG TRẠI (đổi lúc 5 giờ sáng VN).
   Ký hiệu: CEO = số CEO đã chốt 30/09 · còn lại TỰ ĐẶT (chỉnh sau khi bot giả lập + chơi thật).
   Tiền: xu = xu ví BK thật · EXP = đơn vị lẻ của xu (100 EXP = 1 xu, quy tắc BK) · điểm chăm chỉ = điểm từ học. */
(function () {
'use strict';
// PHA 1 (CEO 30/09): chỉ trồng cây + cùng lắm nuôi gà, bò. Lò bánh, mèo, chim, đồ trang trí để pha sau — TẮT bằng cờ này, không xoá.
const PHA = 1, SAU = 99;   // SAU = cấp không bao giờ tới (tắt tính năng)

// ---------- CÂY RUỘNG ----------
// ngay: số ngày tới lúc chín · hat: giá hạt (EXP) · diem: giá hạt (điểm chăm chỉ) · goc: số quả khi KHÔNG chăm · gia: giá bán 1 quả (EXP)
// mua: 0 = quanh năm, còn lại = chỉ bán hạt trong mùa có tên cây (xem MUA)
// LUẬT GIÁ (CEO 30/09) — mua theo BỊCH HẠT GIỐNG: 1 bịch = 1 ô.
//   Bịch trả bằng xu = giá trị thu (tưới đủ) ÷ 1,6 (lần 4: giảm xu kiếm được từ đường xu). Mốc CEO: đường xu "bỏ ~5 xu, thu về ~10 xu"/tháng.
//   LẦN 5 — MỞ KHOÁ DẦN: tuần đầu 4 ô + 2 loại cây, mỗi ~tuần mở thêm 1 loại, 8 tuần đủ 8 loại (mùa đầu). CÂY MỞ SAU lãi/ngày
//   nhỉnh hơn cây trước một chút (~6%/bậc) NHƯNG bịch đắt hơn (cả EXP lẫn điểm) ⇒ HS phải cân nhắc tích luỹ để mua bịch xịn.
//   Bậc: thu/ô/ngày khi tưới đủ W = 25 → 38 EXP · 1 điểm chăm chỉ đổi được 5,0 → 6,4 EXP nông sản · thời gian 1 → 2 → 3 ngày.
//   Lần 5 cũng tăng nguồn thu từ trồng cây (CEO: "tháng đầu chơi chăm chỉ phải được tầm 30"): tưới đủ +80% (trước +50%) — tăng qua
//   việc CHĂM mỗi ngày, không tăng qua đường xu (giá bịch trả xu tính lại theo tưới đủ nên lãi đường xu giữ nguyên).
// hat = giá bịch (EXP) · diem = giá bịch (điểm chăm chỉ) · goc = số quả khi không chăm · gia = giá bán 1 quả (EXP) · bac = bậc mở khoá
const RUONG = {
  // mùa đầu (Thu Đông) — 8 loại, mở theo cấp (xem LUAT.moKhoa để biết cấp ↔ tuần)
  // W = thu/ô/ngày khi tưới đủ (EXP, chưa bonus mùa) · e = EXP nông sản / 1 điểm chăm chỉ — cả hai tăng dần theo bậc
  lua_mi:    { ten: 'Lúa mì',    bac: 1, ngay: 1, cap: 1,  hat: 16, diem: 5,  goc: 7,  gia: 2,  mua: 0 },   // W 25,2 · e 5,0
  ca_rot:    { ten: 'Cà rốt',    bac: 2, ngay: 1, cap: 1,  hat: 17, diem: 5,  goc: 5,  gia: 3,  mua: 1 },   // W 27   · e 5,4
  ngo:       { ten: 'Ngô',       bac: 3, ngay: 2, cap: 3,  hat: 36, diem: 10, goc: 8,  gia: 4,  mua: 0 },   // W 28,8 · e 5,8
  khoai_tay: { ten: 'Khoai tây', bac: 4, ngay: 2, cap: 5,  hat: 37, diem: 10, goc: 11, gia: 3,  mua: 1 },   // W 29,7 · e 5,9
  ca_chua:   { ten: 'Cà chua',   bac: 5, ngay: 2, cap: 7,  hat: 39, diem: 10, goc: 7,  gia: 5,  mua: 1 },   // W 31,5 · e 6,3
  bi_ngo:    { ten: 'Bí ngô',    bac: 6, ngay: 3, cap: 9,  hat: 63, diem: 16, goc: 8,  gia: 7,  mua: 1 },   // W 33,6 · e 6,3
  hoa_huong_duong: { ten: 'Hoa hướng dương', bac: 7, ngay: 3, cap: 11, hat: 68, diem: 17, goc: 6, gia: 10, mua: 1 },   // W 36 · e 6,4 — hướng dương Nghệ An nở tháng 11–12
  dau_tay:   { ten: 'Dâu tây',   bac: 8, ngay: 3, cap: 13, hat: 72, diem: 18, goc: 16, gia: 4,  mua: 1 },   // W 38,4 · e 6,4
  // mùa 2 (Tết) · mùa 3 (Xuân) — tới lúc này HS đã qua mùa đầu, cây mùa sau ngang bậc 7–8
  ot:        { ten: 'Ớt',        bac: 7, ngay: 1, cap: 2,  hat: 23, diem: 6,  goc: 10, gia: 2,  mua: 2 },   // W 36 · e 6,0
  dua_hau:   { ten: 'Dưa hấu',   bac: 8, ngay: 3, cap: 4,  hat: 72, diem: 18, goc: 4,  gia: 16, mua: 2 },   // W 38,4 · e 6,4
  dau_nanh:  { ten: 'Đậu nành',  bac: 7, ngay: 1, cap: 2,  hat: 23, diem: 6,  goc: 10, gia: 2,  mua: 3 },   // W 36 · e 6,0
  lua_nuoc:  { ten: 'Lúa nước',  bac: 7, ngay: 2, cap: 3,  hat: 45, diem: 12, goc: 10, gia: 4,  mua: 3 },   // W 36 · e 6,0
  mia:       { ten: 'Mía',       bac: 8, ngay: 3, cap: 5,  hat: 72, diem: 18, goc: 8,  gia: 8,  mua: 3 },   // W 38,4 · e 6,4
};
for (const k in RUONG) RUONG[k].id = k;

// ---------- MÙA (spec §5.3) ----------
// Mùa đầu 2 tháng + bonus sản lượng (CEO) — theo Lally 2010: ~66 ngày mới thành thói quen. Sau đó mỗi mùa 1 tháng, bonus chỉ ở sự kiện.
// bonus là SỐ (cả mùa như nhau) hoặc MẢNG theo từng 30 ngày của mùa. CEO 30/09 lần 5: tháng đầu cao nhất, các tháng sau giảm dần.
const MUA = [
  { so: 1, ten: 'Thu Đông', ngay: 60, bonus: [0.6, 0.3] },   // CEO: mùa đầu 2 tháng — tháng 1 +60%, tháng 2 +30%, sau đó hết
  { so: 2, ten: 'Tết',      ngay: 30, bonus: 0 },
  { so: 3, ten: 'Xuân',     ngay: 30, bonus: 0 },
];

// ---------- CON VẬT NUÔI (spec §5.4) ----------
// an: {món: số cần cho 1 con 1 ngày} · ra: sản phẩm sáng hôm sau · phan: tỉ lệ ra thêm 1 phân bón · toiDa: [[cấp, số con tối đa]]
const VAT = {
  ga: { ten: 'Gà', cap: 4, gia: 30, an: { lua_mi: 1, ngo: 1 }, ra: 'trung', phan: 0.3, toiDa: [[4, 2], [8, 4], [12, 6]] },   // ~tuần 2
  bo: { ten: 'Bò', cap: 10, gia: 80, an: { ngo: 2, bi_ngo: 1 }, ra: 'sua', phan: 0.5, toiDa: [[10, 1], [14, 2], [18, 3]] },  // ~tuần 5
};
for (const k in VAT) VAT[k].id = k;

// ---------- LÒ BÁNH (spec §5.5): 1 mẻ, sáng hôm sau xong ----------
const LO_CAP = PHA >= 2 ? 4 : SAU;
const BANH = {
  banh_mi:     { ten: 'Bánh mì',  cap: 4,  can: { lua_mi: 3 }, gia: 12 },
  banh_ngo:    { ten: 'Bánh ngô', cap: 6,  can: { ngo: 2, trung: 1 }, gia: 18 },
  banh_bi_ngo: { ten: 'Bánh bí',  cap: 10, can: { bi_ngo: 1, trung: 1, sua: 1 }, gia: 40 },
};
for (const k in BANH) BANH[k].id = k;

// ---------- ĐỒ TRANG TRÍ (rơi khi thu hoạch / giúp bạn / mèo tha về / quà lên cấp) — chỉ để đẹp ----------
const TRANG_TRI = {
  tt_hoa:     { ten: 'Chậu hoa' },
  tt_den:     { ten: 'Đèn lồng' },
  tt_bu_nhin: { ten: 'Bù nhìn' },
  tt_xe:      { ten: 'Xe cút kít' },
  tt_ghe:     { ten: 'Ghế gỗ' },
  tt_thung:   { ten: 'Thùng gỗ' },
};

// ---------- HÀNG HOÁ (mọi thứ nằm trong kho) · gia = giá bán ở chợ (EXP) ----------
const I = {};
for (const k in RUONG) I[k] = { id: k, ten: RUONG[k].ten, loai: 'cay', gia: RUONG[k].gia };
I.trung = { id: 'trung', ten: 'Trứng', loai: 'vat', gia: 6 };   // gà: ăn 1 lúa mì (2) ⇒ lãi ~4 EXP/con/ngày
I.sua = { id: 'sua', ten: 'Sữa', loai: 'vat', gia: 14 };      // bò: ăn 2 ngô (6) ⇒ lãi ~8 EXP/con/ngày
for (const k in BANH) I[k] = { id: k, ten: BANH[k].ten, loai: 'banh', gia: BANH[k].gia };
I.phan_bon = { id: 'phan_bon', ten: 'Phân bón', loai: 'phan', gia: 5 };   // bán lại nửa giá mua
for (const k in TRANG_TRI) I[k] = { id: k, ten: TRANG_TRI[k].ten, loai: 'trangtri', gia: 10 };
I.dong_xu_co = { id: 'dong_xu_co', ten: 'Đồng xu cổ', loai: 'quy', gia: 50 };

// ---------- THÚ CƯNG (spec §5.8): mỗi con 1 lần/ngày, +5 thiện cảm, mốc 20/50/100 ----------
const THU = {
  cho:  { ten: 'Chó', cap: 1, viec: 'Xoa đầu' },
  meo:  { ten: 'Mèo', cap: PHA >= 2 ? 5 : SAU, viec: 'Vuốt ve' },
  chim: { ten: 'Chim', cap: PHA >= 2 ? 7 : SAU, viec: 'Cho ăn', an: 'lua_mi' },   // cho chim ăn tốn 1 lúa mì
};

// ---------- CẤP NÔNG TRẠI (điểm nhà nông — KHÔNG gọi EXP để khỏi lẫn với EXP ra xu) ----------
// thu hoạch 1 ô: + 3 × số NGÀY cây đó lớn (cây dài không thiệt) · tưới 1 ô +2 · +1 mỗi lượt giúp / sản phẩm con vật · +2 mỗi mẻ bánh
// TRẦN mỗi ngày LUAT.tranNnNgay (giống trần điểm chăm chỉ) ⇒ cấp đi theo SỐ NGÀY CHĂM VƯỜN, không theo học nhiều/ít hay giúp nhiều/ít:
//   HS vào vườn mỗi ngày (thu 1 ô + tưới vài ô là đủ) chạm trần 8/ngày ⇒ cấp L ở ngày ≈ NN_MOC[L] / 8 + 1. Học nhiều được thưởng bằng thu nhập, không bằng mở khoá sớm.
// CEO 30/09 lần 5 — lịch của HS vào mỗi ngày: tuần 1 = 4 ô + 2 loại cây · cấp 3 (ngày 8) ngô + ô 5 · cấp 4 (11) gà · cấp 5 (15) khoai tây + ô 6
//   · cấp 7 (22) cà chua + ô 7 · cấp 9 (27) bí ngô + ô 8 ⇒ HẾT THÁNG ĐẦU ĐỦ 8 Ô · cấp 10 (33) bò · cấp 11 (37) hướng dương · cấp 12 (43) ô 9
//   · cấp 13 (49) dâu tây ⇒ 8 TUẦN ĐỦ 8 LOẠI CÂY · cấp 14/16/18 (56/70/85) ô 10/11/12.
const NN_MOC = [0, 0, 27, 60, 83, 117, 140, 170, 187, 200, 245, 280, 325, 365, 425, 485, 545, 600, 665, 745, 825];
// quà lên cấp: chỉ đồ (phân bón, trang trí) — KHÔNG phát EXP/xu (không mở thêm vòi tiền)
const QUA_CAP_DU = {
  2: { phan_bon: 1 }, 3: { phan_bon: 2 }, 4: { tt_den: 1 }, 5: { phan_bon: 2 }, 6: { tt_hoa: 1 }, 7: { phan_bon: 3 },
  8: { tt_bu_nhin: 1 }, 9: { phan_bon: 3 }, 10: { tt_xe: 1 }, 11: { phan_bon: 3 }, 12: { tt_ghe: 1 }, 13: { phan_bon: 4 },
  14: { tt_thung: 1 }, 15: { phan_bon: 5 }, 16: { phan_bon: 3 }, 17: { phan_bon: 3 }, 18: { phan_bon: 4 }, 19: { phan_bon: 4 }, 20: { phan_bon: 5 },
};
// pha 1 chưa có đồ trang trí ⇒ quà trang trí đổi thành phân bón
const QUA_CAP = {};
for (const c in QUA_CAP_DU) { const q = QUA_CAP_DU[c]; QUA_CAP[c] = PHA >= 2 || q.phan_bon ? q : { phan_bon: 2 }; }

// ---------- BẠN CÙNG LỚP (ẢO — chỉ có ở bản demo offline; bản online là HS thật cùng lớp) ----------
// chuky: mấy ngày vào 1 lần · lech: lệch pha · gio: giờ VN hay vào · tromTiLe/giupTiLe: xác suất mỗi ngày ghé vườn mình trộm / giúp
// cho: mốc thiện cảm chó của bạn (0–3) · cay: cây trồng ở từng ô
const BAN_AO = [
  { ten: 'Lan',  cap: 6,  chuky: 1, lech: 0, gio: 20, tromTiLe: 0.10, giupTiLe: 0.35, cho: 1, ga: 2, bo: 0, cay: ['ngo', 'ca_rot', 'bi_ngo', 'lua_mi', 'ngo', 'khoai_tay'] },
  { ten: 'Minh', cap: 8,  chuky: 2, lech: 0, gio: 19, tromTiLe: 0.25, giupTiLe: 0.15, cho: 2, ga: 4, bo: 1, cay: ['bi_ngo', 'ngo', 'lua_mi', 'khoai_tay', 'ca_rot', 'bi_ngo', 'ngo', 'lua_mi'] },
  { ten: 'An',   cap: 4,  chuky: 3, lech: 1, gio: 21, tromTiLe: 0.15, giupTiLe: 0.10, cho: 0, ga: 2, bo: 0, cay: ['lua_mi', 'ca_rot', 'ngo', 'lua_mi', 'bi_ngo'] },
  { ten: 'Khoa', cap: 10, chuky: 1, lech: 0, gio: 7,  tromTiLe: 0.05, giupTiLe: 0.40, cho: 3, ga: 4, bo: 2, cay: ['ca_chua', 'bi_ngo', 'ngo', 'khoai_tay', 'lua_mi', 'ca_rot', 'bi_ngo', 'ngo', 'ca_chua', 'lua_mi'] },
  { ten: 'Vy',   cap: 5,  chuky: 2, lech: 1, gio: 18, tromTiLe: 0.20, giupTiLe: 0.25, cho: 1, ga: 2, bo: 0, cay: ['ca_rot', 'lua_mi', 'ngo', 'bi_ngo', 'ca_rot', 'khoai_tay'] },
  { ten: 'Bảo',  cap: 7,  chuky: 4, lech: 2, gio: 20, tromTiLe: 0.30, giupTiLe: 0.05, cho: 0, ga: 2, bo: 1, cay: ['bi_ngo', 'ngo', 'khoai_tay', 'lua_mi', 'bi_ngo', 'ngo', 'ca_rot'] },
];

// ---------- LUẬT CHUNG ----------
const LUAT = {
  gioDoiNgay: 5,                 // ngày nông trại đổi lúc 5 giờ sáng VN (CEO: giờ nào cũng được)
  nnThu: 3, nnTuoi: 2, tranNnNgay: 8,    // điểm nhà nông: thu 1 ô được nnThu × số ngày cây lớn · tưới 1 ô +nnTuoi · trần mỗi ngày (xem NN_MOC)
  batDau: { xu: 20, diem: 10, kho: {} },   // bản demo: ví giả 20 xu, tặng 10 điểm để học gieo
  // ô ruộng (spec §5.1 — CEO: bắt đầu ít ô, mở dần bằng cấp + điểm chăm chỉ)
  // CEO 30/09: bắt đầu 4 ô, ít ô thì trân trọng, hiểu sâu hơn. Lần 5: tuần đầu 4 ô, HẾT THÁNG ĐẦU ĐỦ 8 Ô là được; ô 9–12 rải tháng 2–3.
  oDau: 4, oToiDa: 12,
  oMo: [{ cap: 3, diem: 10 }, { cap: 5, diem: 15 }, { cap: 7, diem: 20 }, { cap: 9, diem: 20 }, { cap: 12, diem: 30 },
        { cap: 14, diem: 40 }, { cap: 16, diem: 50 }, { cap: 18, diem: 60 }],   // ô thứ 5 → 12
  // CEO 30/09: 1 ô = 1 hạt, mỗi ngày mua tối đa SỐ HẠT = SỐ Ô đang có (tính cả trả xu lẫn trả điểm) — đây là cái chặn "dùng xu mua mãi"
  // chăm sóc (spec §5.2 — CEO: mọi cây đều tưới + bón được)
  tuoiThem: 0.8,                 // tưới đủ mọi ngày cây đang lớn: +80% sản lượng (thiếu thì theo tỉ lệ ngày) — lần 5: 50% → 80%
  bonThem: 0.25,                 // bón phân 1 lần/vụ: +25% sản lượng
  sauTiLe: 0.25, sauTru: 0.2,    // mỗi ngày cây đang lớn có 25% bị sâu; sâu còn lúc thu: −20%/con
  roiGoc: 0.05, roiBon: 0.15, roiGiup: 0.10,   // tỉ lệ rơi vật phẩm bất ngờ: thu 1 ô · thu ô đã bón · giúp bạn 1 lượt
  roiLoai: PHA >= 2 ? [['trangtri', 0.6], ['phan_bon', 0.3], ['dong_xu_co', 0.1]] : [['phan_bon', 0.8], ['dong_xu_co', 0.2]],
  giaPhan: 10,                   // mua phân bón ở chợ (EXP) — CEO 30/09: tác dụng mạnh thì phải đắt; chỉ đáng bón cho cây đắt / lâu ngày
  // điểm chăm chỉ (spec §3.3 — CEO: lượt 10 câu ≥70%, điểm = số câu đúng, trần 20–30 câu/ngày)
  nguongDat: 7, tranDiemNgay: 30,
  // tiền (spec §3.2 — CEO: trần xu nông trại trả ra 30/tháng, mùa đầu 45)
  tranXuThang: 30, tranXuThangMuaDau: 45,
  tranXuTieuThang: 5,            // CEO 30/09: "chỉ nên cho HS dùng 5 xu" — xu đổi ra để mua bịch/đồ mỗi tháng (muốn thêm: trả bằng điểm = phải học)
  tranXuTuan: null,              // BỎ 30/09 (thay bằng giới hạn hạt mỗi ngày = số ô). Đặt số > 0 để bật lại trần xu tiêu mỗi tuần
  // sang vườn bạn (spec §5.7 — CEO: trộm 3 / giúp 5)
  trom: 3, giup: 5, tromToiDa: 0.2, tromMoiLan: 1,   // CEO 30/09: giảm trộm — mỗi lượt 1 quả, mỗi ô mất tối đa 20%
  choDuoi: [0, 0.2, 0.4, 0.6],   // tỉ lệ chó đuổi trộm theo mốc thiện cảm
  // thú cưng (spec §5.8)
  tcMoi: 5, tcMoc: [20, 50, 100], chimBatSau: 50,
  meoQua: tc => tc >= 20 ? 0.1 + tc / 250 : 0,     // mèo tha quà mỗi ngày (≤ 50%)
  soChoTrangTri: 8,
  thuToiDa: 40,                  // hộp thư giữ 40 tin gần nhất
  // thanh "Việc hôm nay" ghim góc trái (lấy từ Zoo Pet, 30/09): chỉ đường, KHÔNG thưởng (spec §5.11 — nhiệm vụ có thưởng làm sau). false = tắt
  viecHom: true,
};

window.NT_DATA = { PHA, RUONG, MUA, VAT, LO_CAP, BANH, TRANG_TRI, I, THU, NN_MOC, QUA_CAP, BAN_AO, LUAT };
})();
