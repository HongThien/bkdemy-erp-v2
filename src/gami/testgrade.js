// ============================================================================
// testgrade.js — ENGINE CHẤM TEST ONLINE (PURE, không I/O). Test: node scripts/verify_testgrade.mjs
// ----------------------------------------------------------------------------
// Spec §6. 3 loại câu:
//   - trac_nghiem : so vị trí HS chọn (A/B/C/D) == chữ cái đáp án → correct/wrong (100% deterministic)
//   - tra_loi_ngan: smartNormalize + smartCheckTLN (port V1) → correct/wrong (wrong→report)
//   - dung_sai    : so 4 ý → thang partial (CHỜ Thùy chốt Bước 0.2 — chưa bật ở slice 1)
// Chỉ KẾT QUẢ (correct/partial/wrong), KHÔNG tính điểm trình bày/tốc độ (đó cho Elo).
// ============================================================================

// ── smartNormalize (port V1 TabDailyPractice.jsx) ───────────────────────────
// Chuẩn hoá đáp án tự-điền để so bằng: bỏ đơn vị, space, 1,5→1.5, 1/2→0.5, +/trailing-zero.
// ⚠ §2.0 (30/08): NGUỒN CHÂN LÝ = fn_tln_normalize ở DB (mig 202608300252) — bản JS này
// phải GIỐNG HỆT (parity test scripts trong chiến dịch audit chạy cả hai trên data thật).
// Đã SỬA 2 bug lộ ra khi so với SQL: ① \b của JS là ASCII → chữ có dấu bị coi là ranh giới
// từ, "10 học sinh" bị bóc mất h/m thành "10ọcsinh" (bóc "đơn vị" ngay trong chữ!) — thay
// bằng lookaround \p{L}\p{N} unicode. ② chia phân số không tận cùng format khác nhau giữa
// JS/SQL — chốt round 10 chữ số (toFixed(10), zero thừa bị strip ở bước cuối như cũ).
export function smartNormalize(val) {
  if (val == null) return ''
  let s = String(val).toLowerCase().trim()
  // bỏ đơn vị thường gặp — ranh giới từ UNICODE (không ăn vào chữ có dấu liền kề)
  s = s.replace(/(?<![\p{L}\p{N}_])(km\/giờ|km\/h|m\/s|m\/giây|km|cm|mm|m²|cm²|m|kg|gam|g|lít|l|đồng|vnđ|vnd|nghìn|triệu|tỷ|giờ|phút|giây|h|min|s|%)(?![\p{L}\p{N}_])/giu, '')
  s = s.replace(/\s+/g, '')          // bỏ space
  s = s.replace(/[.,]$/, '')         // bỏ chấm/phẩy trailing
  s = s.replace(/(\d),(\d)/g, '$1.$2')       // 1,5 → 1.5 (decimal VN)
  s = s.replace(/(\d)\.(\d{3})(?![\p{L}\p{N}_])/gu, '$1$2')  // 1.000 → 1000 (nghìn; ranh giới unicode như \y SQL)
  const frac = s.match(/^(-?\d+)\/(\d+)$/)   // phân số 1/2 → 0.5 (round 10 chữ số — khớp SQL)
  if (frac) { const b = parseInt(frac[2]); if (b !== 0) s = (parseInt(frac[1]) / b).toFixed(10) }
  s = s.replace(/^\+/, '')                    // bỏ dấu + đầu
  s = s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')  // 0.50→0.5, 5.0→5
  return s
}

// So 1 đáp án tự-điền (accept nhiều phần ngăn bởi ; hoặc , + hoán vị + sai số nhỏ).
export function smartCheckTLN(userAns, correctAns) {
  if (userAns == null || userAns === '' || correctAns == null || correctAns === '') return false
  // Tách CHỈ theo ; (kho dùng '3; 4') — KHÔNG tách theo , vì , là dấu THẬP PHÂN VN (0,5).
  const userParts = String(userAns).split(';').map(smartNormalize).filter(Boolean)
  const correctParts = String(correctAns).split(';').map(smartNormalize).filter(Boolean)
  if (userParts.length !== correctParts.length) return false
  const su = [...userParts].sort(), sc = [...correctParts].sort()
  for (let i = 0; i < sc.length; i++) {
    const u = su[i], c = sc[i]
    if (u === c) continue
    const un = parseFloat(u), cn = parseFloat(c)
    if (!isNaN(un) && !isNaN(cn) && Math.abs(un - cn) < 1e-6) continue
    return false
  }
  return true
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// ── Chấm 1 câu (deterministic) — trả {verdict, cham_boi} hoặc null nếu chưa xử ──
// dapAnHs: trac_nghiem = index (0..) HS chọn · tra_loi_ngan = chuỗi HS ghi
// key: trac_nghiem = chữ cái đáp án · tra_loi_ngan = chuỗi đáp án chuẩn
export function gradeTracNghiem(hsIndex, keyLetter) {
  if (hsIndex == null || hsIndex < 0) return { verdict: 'wrong', cham_boi: 'exact' }
  const chosen = LETTERS[hsIndex]
  return { verdict: chosen === String(keyLetter).trim().toUpperCase() ? 'correct' : 'wrong', cham_boi: 'exact' }
}

export function gradeTraLoiNgan(hsText, keyText) {
  return smartCheckTLN(hsText, keyText)
    ? { verdict: 'correct', cham_boi: 'exact' }
    : { verdict: 'wrong', cham_boi: 'exact' }  // wrong → HS được REPORT (spec §5,§7)
}

// Câu ĐÚNG/SAI: 4 mệnh đề, mỗi ý Đ/S. Thang điểm CHUẨN THPT 2025 (số ý đúng 0..4).
export const DUNGSAI_DIEM_4Y = [0, 0.1, 0.25, 0.5, 1.0]
const normDS = (v) => (String(v ?? '').trim().toUpperCase().startsWith('S') ? 'S' : 'D')
// hs, key = mảng 'D'/'S' cùng độ dài (thường 4). HS chưa chọn ý nào (null) = coi như sai ý đó.
export function gradeDungSai(hs, key) {
  const n = (key || []).length
  const arr = Array.isArray(hs) ? hs : []
  let dung = 0
  for (let i = 0; i < n; i++) if (arr[i] != null && normDS(arr[i]) === normDS(key[i])) dung++
  const diemTho = n === 4 ? DUNGSAI_DIEM_4Y[dung] : (n ? dung / n : 0)
  const verdict = dung === n ? 'correct' : dung > 0 ? 'partial' : 'wrong'
  return { verdict, cham_boi: 'exact', dung, tong: n, diemTho }
}

// Snapshot đề khi phát hành: rút KEY + validate. Trả {ok, key, warn}.
// - trac_nghiem: key = chữ cái (dap_an). Thiếu dap_an / lua_chon không phải mảng → warn.
// - tra_loi_ngan: key = dap_an (chuỗi). Thiếu → warn.
export function extractKey(cau) {
  const loai = cau.loai_cau
  if (loai === 'trac_nghiem') {
    const opts = Array.isArray(cau.lua_chon) ? cau.lua_chon : null
    const key = (cau.dap_an || '').trim().toUpperCase()
    if (!opts || opts.length < 2) return { ok: false, warn: 'thiếu lựa chọn' }
    if (!/^[A-F]$/.test(key)) return { ok: false, warn: 'thiếu/không rõ đáp án đúng' }
    return { ok: true, key }
  }
  if (loai === 'tra_loi_ngan') {
    const key = (cau.dap_an || '').trim()
    if (!key) return { ok: false, warn: 'thiếu đáp án' }
    return { ok: true, key }
  }
  if (loai === 'dung_sai') {
    const md = Array.isArray(cau.menh_de) ? cau.menh_de : null
    if (!md || md.length < 2) return { ok: false, warn: 'thiếu mệnh đề (chưa cấu trúc)' }
    if (md.some((m) => !/^[DS]/i.test(String(m?.dap_an ?? '').trim()))) return { ok: false, warn: 'mệnh đề thiếu đáp án Đ/S' }
    return { ok: true, key: md.map((m) => (String(m.dap_an).trim().toUpperCase().startsWith('S') ? 'S' : 'D')) }
  }
  // tu_luan: không auto-chấm được → báo caller bỏ qua
  return { ok: false, warn: `loại "${loai}" chưa hỗ trợ` }
}
