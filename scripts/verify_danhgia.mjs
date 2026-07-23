// Test ENGINE ĐÁNH GIÁ KẾT QUẢ HỌC TẬP (chạy: node scripts/verify_danhgia.mjs).
// Pure — không đụng DB. Bám `spec-danhgia-hoctap.md` + quyết định của Thùy ghi ở `PLAN-danhgia-hoctap.md`.
import {
  DANHGIA_CONFIG, THAI_DO_BAC, cuaSoCua, cuaSoTruoc, chuoiCuaSo,
  diemChuyenDe, chuoiDiemChuyenDe, trungVi, chamPha1, chamPha2,
  trungBinhTruot3, docAmLienTiep, coBTVNChe, lenRoiRot,
  cuoiCuaSo, bucketTaiThoiDiem, dangDoiBucketXau,
  deXuatLevelKienThuc, deXuatLevelThaiDo,
} from '../src/gami/danhgia.js'

let fail = 0
const ok = (cond, msg) => { if (!cond) { console.error('✗', msg); fail++ } else console.log('✓', msg) }
const near = (a, b, t = 1e-9) => a != null && Math.abs(a - b) <= t
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const C = (value, src, t) => ({ value, src, t })

// ── CỬA SỔ 14 NGÀY MỐC FIX, GIỜ VN ────────────────────────────────────────────────
ok(cuaSoCua('2026-07-15T10:00:00+07:00') === '2026-07-A', 'ngày 15 → nửa A')
ok(cuaSoCua('2026-07-16T10:00:00+07:00') === '2026-07-B', 'ngày 16 → nửa B')
ok(cuaSoCua('2026-07-31T23:59:00+07:00') === '2026-07-B', 'cuối tháng → B')
ok(cuaSoCua('2026-08-01T00:30:00+07:00') === '2026-08-A', 'đầu tháng sau → A mới')
// ⚠ Bẫy timezone: 23h ngày 15 giờ VN = 16:00 UTC cùng ngày → vẫn phải là A.
ok(cuaSoCua('2026-07-15T16:00:00Z') === '2026-07-A', 'giờ VN: 23h ngày 15 (=16:00Z) vẫn là A, không trượt sang B')
// 17:00Z ngày 15 = 00:00 ngày 16 giờ VN → PHẢI sang B (nếu tính theo UTC sẽ sai thành A).
ok(cuaSoCua('2026-07-15T17:00:00Z') === '2026-07-B', 'giờ VN: 00h ngày 16 (=17:00Z hôm trước) đã là B')

ok(cuaSoTruoc('2026-07-B') === '2026-07-A', 'cửa sổ trước của B = A cùng tháng')
ok(cuaSoTruoc('2026-07-A') === '2026-06-B', 'cửa sổ trước của A = B tháng trước')
ok(cuaSoTruoc('2026-01-A') === '2025-12-B', 'bắc cầu sang năm trước')
ok(eq(chuoiCuaSo('2026-06-B', '2026-07-B'), ['2026-06-B', '2026-07-A', '2026-07-B']), 'chuỗi cửa sổ liên tiếp đủ mốc')

// ── TẦNG CHUYÊN ĐỀ: điểm 1 cửa sổ ─────────────────────────────────────────────────
ok(diemChuyenDe([]) === null, 'không câu nào → null (chưa-đo, KHÔNG phải 0)')
ok(near(diemChuyenDe([C(1, 'et', 'x'), C(0, 'et', 'x')]).score, 0.5), '1 đúng 1 sai cùng nguồn → 0.5')
// weighted: et(w2)·1 + mt(w3)·0 = 2/5 = 0.4  (≠ flat mean 0.5)
ok(near(diemChuyenDe([C(1, 'et', 'x'), C(0, 'mt', 'x')]).score, 0.4), 'weighted theo nguồn: et2 + mt3 → 0.4, khác flat mean')
ok(near(diemChuyenDe([C(0.5, 'btvn', 'x')]).score, 0.5), 'C (chưa đạt) = 0.5')
// ⭐ KHÔNG cap 5 (khác tầng dạng): 8 câu đều tính.
const tam = Array.from({ length: 8 }, (_, i) => C(i < 6 ? 1 : 0, 'btvn', 'x'))
ok(diemChuyenDe(tam).n === 8 && near(diemChuyenDe(tam).score, 0.75), 'tầng chuyên đề KHÔNG cap 5 — cả 8 câu vào điểm')
// ⭐ Bổ trợ đuổi / ingame / đánh giá GV: weight 0 → rụng khỏi điểm (spec §0, §9).
ok(DANHGIA_CONFIG.WEIGHT.bt === 0, 'bổ trợ đuổi (bt) weight 0 — KHÁC MASTERY_CONFIG.WEIGHT.bt=1, cố ý')
const conBt = diemChuyenDe([C(1, 'et', 'x'), C(0, 'bt', 'x'), C(0, 'ingame', 'x')])
ok(near(conBt.score, 1) && conBt.n === 1, 'bt/ingame không kéo điểm xuống — bị loại, không phải tính là 0')
ok(diemChuyenDe([C(0, 'bt', 'x')]) === null, 'toàn nguồn weight 0 → CHƯA-ĐO (null), không phải 0 điểm')
// Cảnh báo "ít lần đo" (Thùy 07-22: vẫn tính, chỉ gắn cờ — KHÔNG chặn).
ok(diemChuyenDe([C(1, 'et', 'x'), C(1, 'et', 'x')]).itLanDo === true, 'n=2 < gate → vẫn ra SỐ, kèm cờ itLanDo')
ok(diemChuyenDe([C(1, 'et', 'x'), C(1, 'et', 'x'), C(1, 'et', 'x')]).itLanDo === false, 'n=3 ≥ gate → hết cờ')

// ── Chuỗi điểm theo cửa sổ: lỗ để ĐỨT, không nội suy ──────────────────────────────
const chuoi = chuoiDiemChuyenDe([
  C(1, 'et', '2026-06-20T10:00:00+07:00'), // 06-B
  C(0, 'et', '2026-07-20T10:00:00+07:00'), // 07-B  (07-A KHUYẾT)
])
ok(chuoi.length === 3 && eq(chuoi.map((x) => x.cuaSo), ['2026-06-B', '2026-07-A', '2026-07-B']), 'chuỗi dựng đủ mốc kể cả cửa sổ khuyết')
ok(chuoi[1].diem === null, 'cửa sổ khuyết data → null (ĐỨT quãng, KHÔNG nội suy nối thẳng)')

// ── PHA 1 (so LỚP) / PHA 2 (so CHÍNH MÌNH) ────────────────────────────────────────
ok(trungVi([0.2, 0.5, 0.9]) === 0.5, 'trung vị lẻ')
ok(near(trungVi([0.2, 0.4, 0.6, 0.8]), 0.5), 'trung vị chẵn = TB 2 giá trị giữa')
const p1 = chamPha1(0.4, [0.9, 0.7, 0.5, 0.4, 0.2])
ok(p1.pha === 1 && p1.rank === 4 && p1.siSo === 5, 'pha 1: rank trong lớp (4/5)')
ok(near(p1.trungViLop, 0.5) && near(p1.khoangCach, -0.1), 'pha 1: khoảng cách tới trung vị lớp')
ok(chamPha1(0.4, []) === null, 'pha 1: lớp không có điểm nào → null (không bịa)')
// ⭐ Pha 2 HIỆN CẢ HAI SỐ, KHÔNG trừ (spec nói rõ).
const p2 = chamPha2(0.6, 0.7)
ok(p2.truoc === 0.6 && p2.sau === 0.7 && p2.huong === 'tien', 'pha 2: giữ CẢ HAI số A→B, không chỉ delta')
ok(!('delta' in p2), 'pha 2: KHÔNG phun trường delta (spec cấm hiển thị mỗi delta)')
ok(chamPha2(0.8, 0.6).huong === 'lui' && chamPha2(0.6, 0.6).huong === 'giu', 'pha 2: hướng tiến/lùi/giữ')

// ── DÀI HẠN: moving average 3 PHẲNG ───────────────────────────────────────────────
const ma = trungBinhTruot3([0.3, 0.6, 0.9, 1.2])
ok(ma[0] === null && ma[1] === null, '< 3 chu kỳ → null (UI hiện thô + "chưa đủ dữ liệu trend")')
ok(near(ma[2], 0.6) && near(ma[3], 0.9), 'MA-3 phẳng = TB 3 điểm liền kề')
ok(eq(trungBinhTruot3([0.3, null, 0.9, 1.2]), [null, null, null, null]), 'bộ 3 dính lỗ → null, KHÔNG nội suy qua chỗ khuyết')
ok(docAmLienTiep([null, null, 0.9, 0.7, 0.5]) === 2, 'đếm dốc âm liên tiếp từ cuối chuỗi')
ok(docAmLienTiep([null, null, 0.5, 0.7, 0.9]) === 0, 'dốc dương → 0 nhịp âm')

// ── NET-BUCKET: dạng con đổi bucket XẤU (spec §2.A①) ──────────────────────────────
const V = (t) => new Date(t).getTime()
ok(cuoiCuaSo('2026-07-A') === V('2026-07-15T23:59:59.999+07:00'), 'cuối cửa sổ A = hết ngày 15 giờ VN')
ok(cuoiCuaSo('2026-07-B') === V('2026-07-31T23:59:59.999+07:00'), 'cuối cửa sổ B = hết ngày cuối THÁNG (31)')
ok(cuoiCuaSo('2026-02-B') === V('2026-02-28T23:59:59.999+07:00'), 'tháng 2 → ngày cuối là 28, không hardcode 30/31')
const E = (value, t) => ({ value, t, src: 'et' })
// Dạng D1: 06-B toàn đúng (đạt) → 07-A thêm 5 lần sai (yếu) ⇒ TỤT.
const tut = {
  D1: [E(1, '2026-06-20T10:00:00+07:00'), E(1, '2026-06-21T10:00:00+07:00'), E(1, '2026-06-22T10:00:00+07:00'),
       E(0, '2026-07-05T10:00:00+07:00'), E(0, '2026-07-06T10:00:00+07:00'), E(0, '2026-07-07T10:00:00+07:00'),
       E(0, '2026-07-08T10:00:00+07:00'), E(0, '2026-07-09T10:00:00+07:00')],
  D2: [E(1, '2026-06-20T10:00:00+07:00'), E(1, '2026-07-05T10:00:00+07:00')], // giữ đạt
}
const doi = dangDoiBucketXau(tut, '2026-06-B', '2026-07-A')
ok(doi.length === 1 && doi[0].ma_dang === 'D1' && doi[0].tu === 'dat' && doi[0].den === 'yeu', 'bắt đúng dạng tụt bucket (D1 đạt→yếu), D2 giữ nguyên thì không kể')
// ⚠ Mastery = "tính TỚI thời điểm", không phải "chỉ dùng câu TRONG cửa sổ": cửa sổ vắng bài
// KHÔNG được thành tụt hạng giả.
const vangBai = { D3: [E(1, '2026-06-20T10:00:00+07:00'), E(1, '2026-06-21T10:00:00+07:00')] }
ok(eq(dangDoiBucketXau(vangBai, '2026-06-B', '2026-07-A'), []), 'cửa sổ sau KHÔNG có bài → giữ nguyên bucket cũ, KHÔNG báo tụt giả')
// Chưa đo ở mốc trước → không kết luận (không coi "mới xuất hiện" là tụt).
const moiCo = { D4: [E(0, '2026-07-05T10:00:00+07:00')] }
ok(eq(dangDoiBucketXau(moiCo, '2026-06-B', '2026-07-A'), []), 'dạng chỉ mới đo ở cửa sổ sau → không kết luận tụt')
ok(bucketTaiThoiDiem([], Date.now()) === null, 'không lần đo nào → null (chưa-đo, không phải yếu)')

// ── CỜ CHẨN ĐOÁN ──────────────────────────────────────────────────────────────────
ok(coBTVNChe(0.4, 0.6) === true, 'BTVN che: yếu theo ET+MT, hết yếu khi gộp → cờ')
ok(coBTVNChe(0.4, 0.45) === false, 'yếu cả hai → không phải bị che')
ok(coBTVNChe(0.9, 0.95) === false, 'ổn cả hai → không cờ')
ok(coBTVNChe(null, 0.6) === false, 'thiếu 1 vế → không kết luận')
ok(lenRoiRot([{ value: 1, t: 'a' }, { value: 0, t: 'b' }]) === true, 'lên rồi rớt: retest đầu cao, sau tụt → cờ NHỒI')
ok(lenRoiRot([{ value: 1, t: 'a' }, { value: 1, t: 'b' }]) === false, 'giữ được → không cờ')
ok(lenRoiRot([{ value: 1, t: 'a' }]) === false, '1 mốc đo thì MÙ chuyện lên-rồi-rớt → không kết luận')

// ── MÁY LEVEL KIẾN THỨC — chỉ ĐỀ XUẤT (Thùy 07-22) ────────────────────────────────
const NOW = Date.parse('2026-07-22T12:00:00+07:00')
const D = (o) => ({ ma_dang: 'D1', score: 0.3, n: 5, ...o })

// Gate độ tin: yếu nhưng n < 3 → KHÔNG vào diện, chỉ cảnh báo.
const gate = deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ n: 2 })], bayGio: NOW })
ok(gate.deXuat === 0, 'yếu nhưng mới 2 lần đo → KHÔNG đề xuất lên level')
ok(eq(gate.bangChung.yeuThieuDo, ['D1']) && eq(gate.bangChung.dien, []), 'ô yếu thiếu lần đo → nằm ở cảnh báo, không nằm ở diện')

// L0 → L1 khi có dạng yếu đủ độ tin.
ok(deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({})], bayGio: NOW }).deXuat === 1, '1 dạng yếu đủ độ tin → đề xuất L1 (Thùy chốt: 1 dạng là đủ)')

// `Cần luyện` KHÔNG vào diện — đi luồng ôn tập, KHÔNG bổ trợ, KHÔNG lên level (spec §4.3).
const cl = deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ score: 0.65 })], bayGio: NOW })
ok(cl.deXuat === 0 && eq(cl.bangChung.canLuyen, ['D1']), 'Cần luyện (0.5–0.8) → không lên level, tách sang luồng ôn tập')

// ── MỐC 0.5 = 2 NGƯỠNG LỆCH NHAU (TRỄ) — Thùy 07-22 ──────────────────────────────
// Đánh giá CHUNG: 0.5 = cần luyện. VÀO diện: < 0.5. RA khỏi diện: > 0.5. Đúng 0.5 = giữ nguyên.
const b05 = deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ score: 0.5 })], bayGio: NOW })
ok(b05.deXuat === 0 && eq(b05.bangChung.dien, []), 'score = 0.5, CHƯA mở đợt → cần luyện, KHÔNG vào diện')
ok(eq(b05.bangChung.canLuyen, ['D1']), 'score = 0.5 nằm ở nhóm "cần luyện" (khớp masteryOfDang + màn Kết quả học tập)')
ok(deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ score: 0.49 })], bayGio: NOW }).deXuat === 1, 'score < 0.5 → yếu thật → vào diện, đề xuất L1')
// ĐÃ mở đợt: 0.5 chưa đủ để RA (spec §4.1 "bằng 0.5 KHÔNG tính") → ở lại, GIỮ level.
const mo05 = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ score: 0.5, daMo: true })], bayGio: NOW })
ok(eq(mo05.bangChung.dien, ['D1']) && mo05.deXuat === 1, 'ĐÃ mở đợt + retest đúng 0.5 → Ở LẠI diện, GIỮ level (không lên, không xuống)')
const mo06 = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ score: 0.6, daMo: true })], bayGio: NOW })
ok(eq(mo06.bangChung.dien, []) && mo06.deXuat === 0, 'ĐÃ mở đợt + retest > 0.5 → RA khỏi diện, đề xuất hạ level')
// Trễ = chống rung: cùng score 0.5 nhưng kết quả khác nhau tuỳ trạng thái ĐANG có.
ok(deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ score: 0.5, daMo: true })], bayGio: NOW }).bangChung.dien.length === 1
   && deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ score: 0.5 })], bayGio: NOW }).bangChung.dien.length === 0,
   'TRỄ: cùng 0.5 — đã mở thì ở lại, chưa mở thì không vào (chống vào-ra-vào-ra mỗi lần chấm)')
// retest đúng 0.5 KHÔNG phải "xử không work" → không được leo thang.
const r05 = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ score: 0.5, daMo: true, dayAt: '2026-07-20T10:00:00+07:00', retests: [{ value: 0.5, t: 'z' }] })], bayGio: NOW })
ok(r05.deXuat === 1, 'retest = 0.5 → KHÔNG lên level (chưa đóng được dạng, nhưng cũng chưa phải xử hỏng)')

// ③④ = flag CỨNG của người → vọt thẳng L2+, bỏ qua nấc. Máy KHÔNG xét lại.
const cd = deXuatLevelKienThuc({ levelHienTai: 0, dangs: [], coChuongDo: true, bayGio: NOW })
ok(cd.deXuat === 2 && cd.bangChung.nhay === true, '③ chuông đỏ → vọt thẳng L2 dù diện rỗng')
ok(deXuatLevelKienThuc({ levelHienTai: 3, dangs: [], coLoTienQuyet: true, bayGio: NOW }).deXuat === 3, '④ ở L3 rồi thì giữ L3, không tụt về 2')

// "Không work" → đề xuất LÊN. Hai cửa: retest vẫn yếu · kẹt > 1 tuần chưa retest.
const rh = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ daMo: true, dayAt: '2026-07-20T10:00:00+07:00', retests: [{ value: 0, t: 'z' }] })], bayGio: NOW })
ok(rh.deXuat === 2, 'retest vẫn < 0.5 → xử chưa work → đề xuất lên L2')
const ket = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ daMo: true, dayAt: '2026-07-10T10:00:00+07:00' })], bayGio: NOW })
ok(ket.deXuat === 2, 'kẹt >1 tuần chưa retest được → tự đề xuất lên level (lỡ 1 tuần = lỡ 1 nhịp)')
const chuaKet = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ daMo: true, dayAt: '2026-07-18T10:00:00+07:00' })], bayGio: NOW })
ok(chuaKet.deXuat === 1, 'mới 4 ngày chưa tới trần 1 tuần → giữ level, chưa đề xuất lên')
ok(deXuatLevelKienThuc({ levelHienTai: 3, dangs: [D({ daMo: true, retests: [{ value: 0, t: 'z' }] })], bayGio: NOW }).deXuat === 3, 'L3 là trần — không đề xuất vượt quá')

// Đóng dạng: retest > 0.5 là XONG (KHÔNG đòi tới 0.8) → rút khỏi diện.
const dong = deXuatLevelKienThuc({ levelHienTai: 1, dangs: [D({ score: 0.6, daMo: true })], bayGio: NOW })
ok(dong.deXuat === 0 && eq(dong.bangChung.dien, []), 'retest lên 0.6 (>0.5) → dạng rút khỏi diện, không đòi Đạt 0.8')

// Xuống level: L1 = 1 nhịp đủ · L2/L3 = phải 2 nhịp (kiểm độ BỀN, chống hiểu-giả).
ok(deXuatLevelKienThuc({ levelHienTai: 1, dangs: [], nhipOnLienTiep: 1, bayGio: NOW }).deXuat === 0, 'L1 + diện rỗng 1 nhịp → về L0 (lỗ nông)')
ok(deXuatLevelKienThuc({ levelHienTai: 2, dangs: [], nhipOnLienTiep: 1, bayGio: NOW }).deXuat === 2, 'L2 + rỗng MỚI 1 nhịp → GIỮ L2, chờ buổi sau retest lại')
ok(deXuatLevelKienThuc({ levelHienTai: 2, dangs: [], nhipOnLienTiep: 2, bayGio: NOW }).deXuat === 1, 'L2 + rỗng 2 nhịp → hạ 1 nấc về L1 (không nhảy thẳng L0)')
ok(deXuatLevelKienThuc({ levelHienTai: 3, dangs: [], nhipOnLienTiep: 2, bayGio: NOW }).deXuat === 1, 'L3 + rỗng 2 nhịp → về L1')

// Máy chỉ ĐỀ XUẤT: luôn kèm lý do + bằng chứng để NGƯỜI duyệt (PLAN §1.F).
const kq = deXuatLevelKienThuc({ levelHienTai: 0, dangs: [D({ scoreEtMt: 0.4, score: 0.6 })], bayGio: NOW })
ok(Array.isArray(kq.lyDo) && kq.lyDo.length > 0, 'mọi đề xuất kèm LÝ DO (người duyệt cần đọc được)')
ok(eq(kq.bangChung.btvnChe, ['D1']), 'cờ "BTVN che" đi kèm bằng chứng: yếu ở nguồn giám sát, được BTVN cứu')

// ── MÁY LEVEL THÁI ĐỘ — độc lập hoàn toàn ─────────────────────────────────────────
ok(THAI_DO_BAC.nghiem_tuc === 0 && THAI_DO_BAC.chong_doi === 3, 'thang 4 bậc CÓ THỨ TỰ, chuẩn tuyệt đối = Nghiêm túc')
const T = (thai_do, t) => ({ thai_do, t })
ok(deXuatLevelThaiDo([]).deXuat === 0, 'chưa có dữ liệu thái độ → không phán')
ok(deXuatLevelThaiDo([T('nghiem_tuc', '2026-07-20')]).deXuat === 0, 'toàn Nghiêm túc → L0')
ok(deXuatLevelThaiDo([T('chua_het_suc', '2026-07-20'), T('nghiem_tuc', '2026-07-18')]).deXuat === 1, '1 buổi dưới Nghiêm túc → L1 (nhắc/trò chuyện HS)')
// `Chống đối` nhảy nấc NGAY, không đợi lặp.
ok(deXuatLevelThaiDo([T('chong_doi', '2026-07-20')]).deXuat === 2, '`Chống đối` 1 buổi → nhảy thẳng L2, không đợi dai dẳng')
// Dai dẳng → L2 (nhắc phụ huynh).
const dd = deXuatLevelThaiDo([
  T('chua_nghiem_tuc', '2026-07-20'), T('chua_het_suc', '2026-07-18'), T('chua_nghiem_tuc', '2026-07-16'),
  T('nghiem_tuc', '2026-07-14'), T('nghiem_tuc', '2026-07-12'),
])
ok(dd.deXuat === 2, '3/5 buổi gần nhất dưới Nghiêm túc → dai dẳng → L2 (nhắc PH)')
// Cũ mà xa thì không tính dai dẳng — chỉ soi cửa sổ buổi GẦN NHẤT.
const xa = deXuatLevelThaiDo([
  T('nghiem_tuc', '2026-07-20'), T('nghiem_tuc', '2026-07-18'), T('nghiem_tuc', '2026-07-16'),
  T('nghiem_tuc', '2026-07-14'), T('nghiem_tuc', '2026-07-12'), T('chua_het_suc', '2026-06-01'),
])
ok(xa.deXuat === 1, 'lỗi cũ đã xa (ngoài 5 buổi gần nhất) → chỉ còn L1, không leo L2')

console.log(fail ? `\n❌ ${fail} test FAIL` : '\n✅ Tất cả test PASS')
process.exit(fail ? 1 : 0)
