// ĐÁNH GIÁ KẾT QUẢ HỌC TẬP — ENGINE PURE. Theo `spec-danhgia-hoctap.md` + `PLAN-danhgia-hoctap.md`.
// KHÔNG đụng DB, KHÔNG import supabase. Service (`src/lib/danhgia.ts`) nạp data rồi gọi vào đây.
// test: node scripts/verify_danhgia.mjs
//
// ⭐ NGUYÊN TẮC (spec §0): CODE TÍNH SỐ, CLAUDE PHÁN. File này chỉ ra SỐ + ĐỀ XUẤT có lý do;
//    không viết văn, không tự quyết. Người duyệt mới đổi state thật (PLAN §1.F).
// ⭐ HAI TẦNG ĐO (spec §1) — đừng lẫn:
//    · tầng DẠNG    → MỨC   → quyết bổ trợ dạng nào. Dùng `masteryOfDang` (5 gần nhất, cap 5).
//    · tầng CHUYÊN ĐỀ → TREND → phát hiện tiến/lùi. Tính THẲNG CÂU, MỌI câu trong cửa sổ, KHÔNG cap.
//    Net-bucket chỉ tồn tại ở tầng DẠNG. Chuyên đề KHÔNG gắn nhãn đạt/cần-luyện/yếu.
import { MASTERY_CONFIG } from './mastery.js'

export const DANHGIA_CONFIG = {
  // Gate "đủ số lần đánh giá" (Thùy 07-22). KHÔNG phải số mới: = MASTERY_CONFIG.TIN_TB (n≤2 = độ tin
  // THẤP). Đo thật: bỏ gate → 76,8% roster có ≥1 dạng yếu, trong đó 35% ô yếu chỉ có ĐÚNG 1 lần đo
  // ("1 câu sai → gọi bổ trợ"). Gate n≥3 → 48,4%.
  GATE_N: MASTERY_CONFIG.TIN_TB,
  YEU: MASTERY_CONFIG.CAN_LUYEN, // ≤ 0.5 = yếu = vào diện bổ trợ (spec §9)
  KET_NGAY: 7, // trần "kẹt chưa retest" = 1 tuần (spec §9) → đủ để ĐỀ XUẤT lên level
  MA_CHU_KY: 3, // moving average 3 chu kỳ PHẲNG (spec §2.B đường B)
  // [CALIBRATE] "dai dẳng nhiều buổi dưới Nghiêm túc" → L2 (spec §4.2 không cho con số).
  // Tạm: ≥3 buổi dưới-Nghiêm-túc trong 5 buổi gần nhất. Chỉnh theo base-rate thật.
  THAI_DO_DAI_DANG: { soBuoi: 3, trongSo: 5 },
  // ⚠ TRỌNG SỐ TẦNG CHUYÊN ĐỀ ≠ MASTERY_CONFIG.WEIGHT — CÓ CHỦ ĐÍCH, đừng "dọn cho gọn".
  // Spec §9 chốt: ET=2 · MT=3 · BTVN=1 · **bổ trợ đuổi = 0** (không vào mastery, chỉ là mốc dạy bù).
  // Nhưng MASTERY_CONFIG.WEIGHT.bt = 1 (tầng DẠNG, có toggle riêng ở màn Kết quả học tập).
  // → neo vào bảng chung cho et/mt/btvn, chỉ ghi đè 3 nguồn KHÔNG thuộc §9 về 0.
  // (`bt_grades` hiện RỖNG 0 dòng — verify 07-22 — nên đây là đúng-về-nguyên-tắc, chưa đổi số nào.)
  WEIGHT: { ...MASTERY_CONFIG.WEIGHT, bt: 0, ingame: 0, dg: 0 },
}

// Thang thái độ 4 bậc CÓ THỨ TỰ (verify 07-22: đúng 4 giá trị này trong DB).
// Chuẩn TUYỆT ĐỐI = Nghiêm túc (bậc 0). Bất kỳ bậc > 0 = tín hiệu, nặng dần. KHÔNG so lịch sử,
// KHÔNG so ngang HS (spec §2.A②).
export const THAI_DO_BAC = { nghiem_tuc: 0, chua_het_suc: 1, chua_nghiem_tuc: 2, chong_doi: 3 }

// ── CỬA SỔ 14 NGÀY, MỐC FIX (spec §0: atom thời gian DUY NHẤT) ────────────────────────
// Nửa đầu tháng (ngày 1–15) = 'A' · nửa sau (16–cuối) = 'B'. Mọi cửa sổ dài hơn = XÂU CHUỖI
// nhiều atom, KHÔNG có cửa sổ riêng.
// ⚠ Giờ VN, KHÔNG dùng toISOString (CLAUDE.md §2 cấm) — cộng offset rồi đọc phần UTC.
const VN_OFFSET_MS = 7 * 3600_000
function vnParts(t) {
  const ms = t instanceof Date ? t.getTime() : typeof t === 'number' ? t : Date.parse(t)
  const d = new Date(ms + VN_OFFSET_MS)
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, day: d.getUTCDate() }
}
export function cuaSoCua(t) {
  const { y, m, day } = vnParts(t)
  return `${y}-${String(m).padStart(2, '0')}-${day <= 15 ? 'A' : 'B'}`
}
// Cửa sổ liền TRƯỚC ('2026-07-A' → '2026-06-B').
export function cuaSoTruoc(win) {
  const [y, m, nua] = [+win.slice(0, 4), +win.slice(5, 7), win.slice(8)]
  if (nua === 'B') return `${y}-${String(m).padStart(2, '0')}-A`
  const pm = m === 1 ? 12 : m - 1, py = m === 1 ? y - 1 : y
  return `${py}-${String(pm).padStart(2, '0')}-B`
}
// Chuỗi cửa sổ liên tiếp [tu … den] (cả 2 đầu). Dùng để dựng trục thời gian ĐỦ MỐC — chỗ khuyết
// data sẽ thành null (đứt quãng), KHÔNG nội suy (spec §2.B).
export function chuoiCuaSo(tu, den) {
  const out = [den]
  let cur = den
  for (let i = 0; i < 240 && cur !== tu; i++) { cur = cuaSoTruoc(cur); out.unshift(cur) }
  return out
}

// ── TẦNG CHUYÊN ĐỀ — điểm 1 cửa sổ (spec §2.A①) ──────────────────────────────────────
// score = Σ(value × weight_nguồn) / Σ(weight_nguồn) trên MỌI câu thuộc chuyên đề trong cửa sổ.
// KHÔNG cap 5 (khác tầng dạng). Bổ trợ đuổi weight 0 → tự rụng.
// Trả null khi không có câu nào (chưa-đo ≠ 0 — CLAUDE.md §5).
// ⚠ KHÔNG gate cứng theo min-n (Thùy 07-22: "cứ tính như bình thường nhưng CÓ HIỆN CẢNH BÁO các
//    dạng thiếu lần đo") → luôn trả `n` + `itLanDo` để UI gắn cờ, không tự im lặng.
export function diemChuyenDe(cauList, cfg = DANHGIA_CONFIG) {
  if (!cauList || cauList.length === 0) return null
  let wsum = 0, wtot = 0, n = 0
  for (const c of cauList) {
    const w = cfg.WEIGHT?.[c.src] ?? 1 // nguồn lạ → 1 (đối xứng masteryOfDang)
    if (w === 0) continue // bổ trợ đuổi / ingame / đánh giá GV: KHÔNG vào mastery (spec §0, §9)
    wsum += c.value * w; wtot += w; n++
  }
  if (wtot === 0) return null // có câu nhưng toàn nguồn weight 0 ⇒ vẫn là CHƯA-ĐO, không phải 0 điểm
  return { score: wsum / wtot, n, itLanDo: n < DANHGIA_CONFIG.GATE_N }
}

// Gom câu theo cửa sổ → chuỗi điểm chuyên đề theo trục thời gian.
// cauList = [{value, src, t}]. Trả [{cuaSo, diem|null}] ĐỦ MỐC từ cửa sổ đầu → cuối (khuyết = null).
export function chuoiDiemChuyenDe(cauList, cfg = DANHGIA_CONFIG) {
  if (!cauList?.length) return []
  const theoWin = new Map()
  for (const c of cauList) {
    const w = cuaSoCua(c.t)
    if (!theoWin.has(w)) theoWin.set(w, [])
    theoWin.get(w).push(c)
  }
  const wins = [...theoWin.keys()].sort()
  return chuoiCuaSo(wins[0], wins[wins.length - 1])
    .map((w) => ({ cuaSo: w, diem: theoWin.has(w) ? diemChuyenDe(theoWin.get(w), cfg) : null }))
}

// ── HAI PHA THEO VÒNG ĐỜI CHUYÊN ĐỀ (spec §2.A①) ─────────────────────────────────────
// PHA 1 — cửa sổ ĐẦU TIÊN (HS chưa có mốc bản thân): chấm bằng SO LỚP. Tự chuẩn hoá độ khó.
//   "tiến bộ loại 2": chậm nhất lớp → giữa lớp = tiến.
export function trungVi(xs) {
  const a = xs.filter((x) => x != null).sort((p, q) => p - q)
  if (!a.length) return null
  const m = a.length >> 1
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2
}
export function chamPha1(diemHS, diemLop) {
  if (diemHS == null) return null
  const ds = (diemLop ?? []).filter((x) => x != null)
  if (!ds.length) return null
  const tv = trungVi(ds)
  // rank 1 = cao nhất. Đếm số HS điểm CAO HƠN + 1.
  const rank = ds.filter((x) => x > diemHS).length + 1
  return { pha: 1, diem: diemHS, rank, siSo: ds.length, trungViLop: tv, khoangCach: diemHS - tv }
}
// PHA 2 — từ cửa sổ thứ 2 (đã có mốc bản thân): SO CHÍNH MÌNH, HIỆN CẢ HAI SỐ.
//   ⚠ KHÔNG trừ, KHÔNG chỉ hiện delta (spec nói rõ) — "tiến bộ loại 1": 0.6 → 0.7 = tiến.
export function chamPha2(diemTruoc, diemSau) {
  if (diemTruoc == null || diemSau == null) return null
  return { pha: 2, truoc: diemTruoc, sau: diemSau, huong: diemSau > diemTruoc ? 'tien' : diemSau < diemTruoc ? 'lui' : 'giu' }
}

// ── DÀI HẠN (spec §2.B) — KHÔNG có phép đo mới, chỉ xâu chuỗi ────────────────────────
// Đường B: khoảng cách (HS − TB lớp) rồi LÀM MƯỢT bằng trung bình trượt 3 chu kỳ PHẲNG.
// Đọc độ CAO = vị thế · độ DỐC = tiến/lùi. Thay hẳn "đường delta" (đạo hàm khuếch đại nhiễu).
// < 3 chu kỳ → trả null cho điểm đó (UI hiện thô + "chưa đủ dữ liệu trend").
// ⚠ Lỗ trong chuỗi để ĐỨT quãng: cửa sổ nào có null trong bộ 3 → điểm mượt = null, KHÔNG nội suy.
export function trungBinhTruot3(series, k = DANHGIA_CONFIG.MA_CHU_KY) {
  return series.map((_, i) => {
    if (i < k - 1) return null
    const bo = series.slice(i - k + 1, i + 1)
    if (bo.some((x) => x == null)) return null // đứt quãng — không nội suy nối thẳng (lừa mắt)
    return bo.reduce((a, b) => a + b, 0) / k
  })
}
// Dốc B-mượt âm LIÊN TIẾP mấy nhịp → tín hiệu trigger ngầm (spec §2.B: không hiển thị delta riêng).
export function docAmLienTiep(muot) {
  let dem = 0
  for (let i = muot.length - 1; i > 0; i--) {
    const a = muot[i], b = muot[i - 1]
    if (a == null || b == null) break
    if (a < b) dem++; else break
  }
  return dem
}

// ── CỜ CHẨN ĐOÁN ─────────────────────────────────────────────────────────────────────
// "BTVN CHE" (PLAN §1.D) — yếu theo nguồn GIÁM SÁT (ET+MT) nhưng hết yếu khi gộp BTVN.
// Đo thật 07-22: BTVN dễ hơn (tỉ lệ đúng TB 0,854 vs ET 0,799 vs MT 0,647) → 235 ô được "cứu",
// chỉ 46 ô đi ngược. Ô bị che = kém ở bài có giám sát, ổn ở bài tự làm ở nhà ⇒ đáng nghi nhất.
// Vá điểm mù false-negative mà spec §5 tự nhận "chưa build v1".
export function coBTVNChe(scoreEtMt, scoreGop, nguong = DANHGIA_CONFIG.YEU) {
  if (scoreEtMt == null || scoreGop == null) return false
  return scoreEtMt <= nguong && scoreGop > nguong
}
// "LÊN RỒI RỚT" (nhặt từ BKDEMY_CANHBAO_BOTRO_SPEC §5) — ngay sau bổ trợ thì lên, các lần sau tụt
// ⇒ buổi đó NHỒI chứ không DẠY HIỂU. Một mốc đo thì mù chuyện này.
// retests = [{value, t}] SAU day_at, theo thứ tự thời gian tăng dần.
export function lenRoiRot(retests, nguong = DANHGIA_CONFIG.YEU) {
  if (!retests || retests.length < 2) return false
  const dau = retests[0].value
  const sau = retests.slice(1)
  return dau > nguong && sau.every((r) => r.value <= nguong)
}

// ── MÁY LEVEL KIẾN THỨC (spec §4.1 + PLAN §1.F: chỉ ĐỀ XUẤT) ─────────────────────────
// ⭐ Level = trạng thái của HỌC SINH, KHÔNG phải của dạng. Mastery dạng chỉ quyết định BỔ TRỢ
//    DẠNG NÀO, không nâng/hạ level.
// ⭐ Diện bổ trợ = CHỈ dạng YẾU (≤0.5) VÀ đủ độ tin (n ≥ GATE_N). `Cần luyện` (0.5–0.8) KHÔNG vào
//    diện — bổ trợ chữa đoạn HIỂU BÀI, không chữa đoạn THÀNH THẠO → luồng ôn tập/lặp (§4.3).
// ⭐ Máy KHÔNG tự đổi level. Trả { deXuat, lyDo[], bangChung } để NGƯỜI duyệt (Thùy 07-22).
//
// input:
//   levelHienTai: 0..3
//   dangs: [{ ma_dang, score, n, dayAt?, retests?: [{value,t}], scoreEtMt? }]
//   coChuongDo / coLoTienQuyet: boolean (kênh ③ / ④ — flag CỨNG của người, máy KHÔNG xét lại)
//   nhipOnLienTiep: số nhịp retest liên tiếp diện RỖNG (để áp luật 1-nhịp/2-nhịp khi xuống)
//   bayGio: ms (test bơm vào cho tất định)
export function deXuatLevelKienThuc(input) {
  const cfg = DANHGIA_CONFIG
  const { levelHienTai = 0, dangs = [], coChuongDo = false, coLoTienQuyet = false, nhipOnLienTiep = 0, bayGio = 0 } = input
  const lyDo = []

  // Diện = dạng yếu ĐỦ ĐỘ TIN. Dạng yếu mà n < gate → tách riêng để UI cảnh báo "ít lần đo",
  // KHÔNG đẩy vào diện (Thùy 07-22).
  const dien = dangs.filter((d) => d.score <= cfg.YEU && d.n >= cfg.GATE_N)
  const yeuThieuDo = dangs.filter((d) => d.score <= cfg.YEU && d.n < cfg.GATE_N)
  const canLuyen = dangs.filter((d) => d.score > cfg.YEU && d.score < MASTERY_CONFIG.DAT)
  const btvnChe = dangs.filter((d) => coBTVNChe(d.scoreEtMt, d.score))

  // ③④ — flag CỨNG của người: vọt thẳng L2+, bỏ qua nấc (spec §4.1).
  if (coChuongDo || coLoTienQuyet) {
    lyDo.push(coChuongDo ? '③ chuông đỏ (TA báo lỗi rất nghiêm trọng ở bài đang học)' : '④ lỗ hổng tiên quyết (GV báo hổng kiến thức nền)')
    return ket(Math.max(levelHienTai, 2), lyDo, { dien, yeuThieuDo, canLuyen, btvnChe, nhay: true })
  }

  // "KHÔNG WORK" → đề xuất LÊN 1 mức. Hai cửa (spec §4.1):
  //   (a) retest ≤ 0.5 (vẫn yếu)  (b) kẹt > 1 tuần chưa retest được — lỡ 1 tuần = lỡ 1 nhịp.
  const retestHong = dien.filter((d) => d.retests?.length && d.retests[d.retests.length - 1].value <= cfg.YEU)
  const ket1Tuan = dien.filter((d) => d.dayAt && !d.retests?.length && (bayGio - Date.parse(d.dayAt)) > cfg.KET_NGAY * 86400_000)
  if (levelHienTai > 0 && (retestHong.length || ket1Tuan.length)) {
    if (retestHong.length) lyDo.push(`${retestHong.length} dạng retest vẫn ≤0.5 (xử chưa work)`)
    if (ket1Tuan.length) lyDo.push(`${ket1Tuan.length} dạng kẹt >${cfg.KET_NGAY} ngày chưa retest được`)
    return ket(Math.min(levelHienTai + 1, 3), lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
  }

  // Diện RỖNG → đề xuất XUỐNG. L1 = 1 nhịp đủ (lỗ nông) · L2/L3 = phải 2 nhịp (lỗ sâu, kiểm độ
  // BỀN của "hiểu bài", chống hiểu-giả/nhớ-tạm) → ổn lần đầu chỉ về L1.
  if (dien.length === 0) {
    if (levelHienTai === 0) return ket(0, ['diện yếu rỗng'], { dien, yeuThieuDo, canLuyen, btvnChe })
    if (levelHienTai === 1) {
      lyDo.push('diện yếu RỖNG, 1 nhịp retest ổn (lỗ nông → đủ)')
      return ket(0, lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
    }
    if (nhipOnLienTiep >= 2) {
      lyDo.push('diện yếu RỖNG 2 nhịp liên tiếp (đã kiểm độ bền)')
      return ket(1, lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
    }
    lyDo.push('diện yếu RỖNG 1 nhịp — L2/L3 cần 2 nhịp, buổi sau retest lại mới hạ')
    return ket(levelHienTai, lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
  }

  // Còn diện, chưa có tín hiệu "không work" → L0 lên L1; đang ở L1+ thì GIỮ, xử nốt.
  if (levelHienTai === 0) {
    lyDo.push(`${dien.length} dạng yếu (≤0.5, đủ ${cfg.GATE_N} lần đo)`)
    return ket(1, lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
  }
  lyDo.push(`còn ${dien.length} dạng trong diện, đang xử`)
  return ket(levelHienTai, lyDo, { dien, yeuThieuDo, canLuyen, btvnChe })
}

function ket(deXuat, lyDo, bangChung) {
  return {
    deXuat,
    lyDo,
    bangChung: {
      dien: bangChung.dien.map((d) => d.ma_dang),
      yeuThieuDo: bangChung.yeuThieuDo.map((d) => d.ma_dang), // hiện cảnh báo "ít lần đo"
      canLuyen: bangChung.canLuyen.map((d) => d.ma_dang), // → luồng ôn tập/lặp, KHÔNG bổ trợ (§4.3)
      btvnChe: bangChung.btvnChe.map((d) => d.ma_dang), // yếu ở nguồn giám sát, được BTVN cứu
      nhay: !!bangChung.nhay,
    },
  }
}

// ── MÁY LEVEL THÁI ĐỘ (spec §4.2) — ĐỘC LẬP HOÀN TOÀN với kiến thức ──────────────────
// Giỏi vẫn có thể thái độ kém và ngược lại. 2 nấc: nấc xử ở HS (L1) · nấc xử ở PH (L2).
// buois = [{thai_do, t}] mới → cũ hoặc cũ → mới đều được (chỉ đếm, có sort nội bộ).
export function deXuatLevelThaiDo(buois) {
  const cfg = DANHGIA_CONFIG.THAI_DO_DAI_DANG
  const co = (buois ?? []).filter((b) => b.thai_do != null && THAI_DO_BAC[b.thai_do] != null)
  if (!co.length) return { deXuat: 0, lyDo: ['chưa có dữ liệu thái độ'], bangChung: { duoiChuan: 0, chongDoi: 0 } }
  const sap = [...co].sort((a, b) => Date.parse(b.t) - Date.parse(a.t)) // mới → cũ
  const chongDoi = sap.filter((b) => b.thai_do === 'chong_doi')
  const duoiChuan = sap.filter((b) => THAI_DO_BAC[b.thai_do] > 0)
  const bangChung = { duoiChuan: duoiChuan.length, chongDoi: chongDoi.length }

  // `Chống đối` → nhảy nấc cao NGAY, không đợi lặp (spec §4.2).
  if (chongDoi.length) return { deXuat: 2, lyDo: ['có buổi `Chống đối` → nhảy nấc ngay, không đợi lặp'], bangChung }
  if (!duoiChuan.length) return { deXuat: 0, lyDo: ['mọi buổi đều Nghiêm túc'], bangChung }

  // Dai dẳng nhiều buổi dưới Nghiêm túc → L2 (nhắc phụ huynh). [CALIBRATE] ngưỡng.
  const ganNhat = sap.slice(0, cfg.trongSo)
  const demGan = ganNhat.filter((b) => THAI_DO_BAC[b.thai_do] > 0).length
  if (demGan >= cfg.soBuoi) return { deXuat: 2, lyDo: [`${demGan}/${ganNhat.length} buổi gần nhất dưới Nghiêm túc (dai dẳng)`], bangChung }
  return { deXuat: 1, lyDo: [`${duoiChuan.length} buổi dưới Nghiêm túc`], bangChung }
}
