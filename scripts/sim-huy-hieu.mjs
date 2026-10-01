// Mô phỏng HUY HIỆU phase 1 (8 huy hiệu, bộ Hy Lạp) qua 1 NĂM HỌC 10 tháng — KHÔNG đụng DB.
// Mục đích: căn ngưỡng 4★ / 5★ (Thùy 28/09: "5★ phải gần hết năm học — 10 tháng thì hoàn hảo 8–9 tháng")
// và ước lượng SỐ BẢN CỨNG / năm cho trung tâm.
// Chạy: node scripts/sim-huy-hieu.mjs
// Nền phân bố HS lấy từ số đo DB thật 28/09 (xem phan-tich-diem-rank.md §1): có mặt 85–94%, BTVN đúng hạn ~75%,
// Toán ~5–6 buổi / 5 ET / 5 BTVN / 1 MT mỗi tháng. Mức dùng app: 60% HS (dự báo khi có Thử thách).

const RUNS = 200, THANG = 10
// Thùy 28/09: 1★/2★/3★/4★/5★ = 1/2/4/6/9 THÁNG. 1–3★ đếm tháng ĐẠT CHUẨN (điều kiện đơn) · 4–5★ đếm tháng HOÀN HẢO (nhiều điều kiện)
const MOC = [1, 2, 4, 6, 9]
let seed = 20260928
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }
const clip = (x, a, b) => Math.max(a, Math.min(b, x))
const poisson = (l) => { if (l <= 0) return 0; const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd() } while (p > L); return k - 1 }
const binom = (n, p) => { let k = 0; for (let i = 0; i < n; i++) if (rnd() < p) k++; return k }

function sinhHS() {
  const skill = clip(0.72 + 0.1 * gauss(), 0.35, 0.97)
  const r = rnd(); const coMat = r < .7 ? .97 : r < .9 ? .9 : .75
  const dh = clip(coMat - 0.2 + 0.12 * gauss(), 0.2, 1)            // xác suất 1 bài BTVN nộp đúng hạn
  let app = 0
  if (rnd() < 0.6) { const u = rnd(); app = u < .35 ? .2 : u < .65 ? .6 : u < .9 ? 1.8 : 5 }   // lượt Thử thách / ngày
  // Hiệu chỉnh theo DB thật (T7–T9 Toán): tháng "không vắng buổi nào" ~65% · tháng "BTVN đủ, đúng hạn mọi bài" ~47%,
  // và RẤT BỀN theo từng em (3 tháng: 23% đạt cả 3, 28% không tháng nào) ⇒ mỗi em 1 xác suất riêng, không tung xu độc lập.
  const u1 = rnd(), pA1 = u1 < .5 ? .9 : u1 < .85 ? .55 : .2
  const u2 = rnd(), pA2 = u2 < .3 ? .9 : u2 < .7 ? .45 : .1
  return { skill, coMat, dh, app, pA1, pA2, tien: 0.01 * gauss() }   // tien = xu hướng tiến bộ / tháng (điểm skill)
}

function namHoc(siSo) {
  const hs = Array.from({ length: siSo }, sinhHS)
  hs.forEach(h => { h.hh = { helios: 0, chronos: 0, athena: 0, zeus: 0, phoenix: 0, hercules: 0, hephaestus: 0, nike: 0 }; h.std = { ...h.hh }
    h.chuoiCoMat = 0; h.maxChuoiCoMat = 0; h.chuoiBTVN = 0; h.maxChuoiBTVN = 0; h.etTot = 0; h.mtTop30 = 0; h.mtTang = 0
    h.ngayPass = 0; h.lap = 0; h.hangDau = null; h.hangTruoc = null; h.btvnTruoc = null; h.diemRank = 0 })
  for (let t = 1; t <= THANG; t++) {
    // --- đo trong tháng ---
    for (const h of hs) {
      h.skill = clip(h.skill + h.tien, 0.3, 0.98)
      // đi học 6 buổi; vắng thì 70% có học bù (không đứt chuỗi, vẫn tính "đủ")
      let du = true
      for (let b = 0; b < 6; b++) { if (rnd() < h.coMat || rnd() < 0.7) { h.chuoiCoMat++; h.maxChuoiCoMat = Math.max(h.maxChuoiCoMat, h.chuoiCoMat) } else { du = false; h.chuoiCoMat = 0 } }
      h.A1 = rnd() < h.pA1          // tháng không vắng buổi nào (hiệu chỉnh DB)
      // BTVN 5 bài
      let dhAll = true, tl = 0
      for (let b = 0; b < 5; b++) { if (rnd() < h.dh) { h.chuoiBTVN++; h.maxChuoiBTVN = Math.max(h.maxChuoiBTVN, h.chuoiBTVN) } else { dhAll = false; h.chuoiBTVN = 0 }
        tl += clip(h.skill + 0.08 * gauss(), 0, 1) }
      h.A2 = rnd() < h.pA2; h.btvnTL = tl / 5   // tháng BTVN đủ, đúng hạn mọi bài (hiệu chỉnh DB)
      h.B4 = h.btvnTL >= 0.85; h.B5 = h.btvnTL >= 0.90
      h.C2 = h.btvnTruoc == null ? false : (h.btvnTL >= h.btvnTruoc + 0.05 || h.btvnTL >= 0.90); h.btvnTruoc = h.btvnTL
      // ET 5 bài, 10 câu
      let et80 = 0; for (let b = 0; b < 5; b++) if (binom(10, h.skill) >= 8) et80++
      h.etTot += et80; h.B1 = et80 >= 4
      // app: Thử thách
      let ngayPass = 0, luot1010 = 0, cauDung = 0
      for (let d = 0; d < 30; d++) { const n = poisson(h.app); let pass = false
        for (let l = 0; l < n; l++) { const k = binom(10, h.skill); cauDung += k; if (k >= 8) pass = true; if (k === 10) luot1010++ }
        if (pass) ngayPass++ }
      h.ngayPass += ngayPass; h.A4 = cauDung >= 200; h.A5 = ngayPass >= 10; h.A6 = ngayPass >= 15; h.B6 = luot1010 >= 5
      // lấp lỗ: xác suất lấp ≥1 dạng yếu/tháng tăng theo lượng luyện; HS giỏi hết dạng yếu thì "giữ vững" cũng tính
      const pLap = clip(0.15 + 0.004 * cauDung, 0, 0.9); h.C3 = rnd() < pLap || h.skill >= 0.9
      if (h.C3 && h.skill < 0.9) h.lap++
      h.mt = clip(10 * h.skill + 0.9 * gauss(), 0, 10)
      h.diemRank = (h.A1 ? 500 : 420) + h.btvnTL * 500 + h.mt * 50 + Math.min(500, ngayPass * 25)   // xấp xỉ Điểm Rank tháng
    }
    // --- xếp hạng MT trong khối ---
    const xep = [...hs].sort((a, b) => b.mt - a.mt); xep.forEach((h, i) => h.hangMT = i + 1)
    const n30 = Math.ceil(0.3 * siSo), n10 = Math.ceil(0.1 * siSo)
    for (const h of hs) {
      h.B2 = h.hangMT <= n30; if (h.B2) h.mtTop30++
      if (h.hangDau == null) h.hangDau = h.hangMT
      const tang = h.hangTruoc != null && (h.hangMT < h.hangTruoc || h.hangMT <= n10); if (tang) h.mtTang++
      h.P1 = h.hangMT < h.hangDau || h.hangMT <= n10                  // tốt hơn hạng tháng đầu năm (hoặc giữ top 10%)
      h.hangTruoc = h.hangMT
    }
    const xepR = [...hs].sort((a, b) => b.diemRank - a.diemRank)
    xepR.forEach((h, i) => { h.dua30 = i < Math.ceil(0.3 * siSo); h.dua10 = i < Math.ceil(0.1 * siSo) })   // bảng đua tháng (xấp xỉ điểm tháng)
    // --- tháng hoàn hảo (bộ nhiều điều kiện của từng huy hiệu) ---
    for (const h of hs) {
      // tháng ĐẠT CHUẨN (1 điều kiện)
      if (h.A1) h.std.helios++; if (h.A2) h.std.chronos++; if (h.B1) h.std.athena++; if (h.B2) h.std.zeus++
      if (h.P1) h.std.phoenix++; if (h.A5) h.std.hercules++; if (h.C3) h.std.hephaestus++; if (h.dua30) h.std.nike++
      // tháng HOÀN HẢO (bộ nhiều điều kiện — luôn chứa điều kiện chuẩn)
      if (h.A1 && h.A2 && h.A6) h.hh.helios++
      if (h.A2 && h.A1 && h.A4) h.hh.chronos++
      if (h.B1 && h.A2 && h.B4) h.hh.athena++
      if (h.B2 && h.B1 && h.B5) h.hh.zeus++
      if (h.P1 && h.A2 && h.A1) h.hh.phoenix++   // bỏ C2 (BTVN tăng mỗi tháng) — nhiễu, 6 tháng liền gần như không thể
      if (h.A6 && h.B6 && h.A2) h.hh.hercules++
      if (h.C3 && h.A2 && h.A5) h.hh.hephaestus++
      if (h.dua10 && h.A1 && h.A2) h.hh.nike++
    }
  }
  return hs
}

const HH = {
  helios: ['Helios', 'không vắng buổi nào', 'không vắng + BTVN đủ đúng hạn + Thử thách ≥ 15 ngày'],
  chronos: ['Chronos', 'nộp đủ, đúng hạn mọi BTVN', 'BTVN đủ đúng hạn + đi học đủ + tự luyện ≥ 200 câu đúng'],
  athena: ['Athena', 'ET ≥ 80% ở ≥ 3/4 số bài', 'ET ≥ 80% (≥ 3/4 bài) + BTVN đủ đúng hạn + BTVN đúng TB ≥ 85%'],
  zeus: ['Zeus', 'MT top 30% khối', 'MT top 30% + ET ≥ 80% (≥ 3/4 bài) + BTVN đúng TB ≥ 90%'],
  phoenix: ['Phoenix', 'hạng MT tốt hơn đầu năm (hoặc giữ top 10%)', 'hạng MT tốt hơn đầu năm + BTVN đủ đúng hạn + không vắng'],
  hercules: ['Hercules', 'pass Thử thách ≥ 10 ngày', 'Thử thách ≥ 15 ngày + ≥ 5 lượt 10/10 + BTVN đủ đúng hạn'],
  hephaestus: ['Hephaestus', 'lấp ≥ 1 lỗ (hoặc hết dạng yếu)', 'lấp ≥ 1 lỗ + BTVN đủ đúng hạn + Thử thách ≥ 10 ngày'],
  nike: ['Nike', 'top 30% bảng đua tháng', 'top 10% bảng đua tháng + đi học đủ + BTVN đủ đúng hạn'],
}
const SI_SO_TOAN_C2 = 40 + 54 + 49 + 68   // số đo DB 28/09
const acc = {}; for (const k in HH) acc[k] = { s: [0, 0, 0, 0, 0], n: 0 }
for (let r = 0; r < RUNS; r++) {
  for (const h of namHoc(54)) for (const k in HH) {
    let sao = 0
    for (let i = 0; i < 3; i++) if (h.std[k] >= MOC[i]) sao = i + 1
    if (sao === 3 && h.hh[k] >= MOC[3]) sao = 4
    if (sao === 4 && h.hh[k] >= MOC[4]) sao = 5
    for (let x = 1; x <= sao; x++) acc[k].s[x - 1]++
    acc[k].n++
  }
}
const pc = (x, n) => Math.round(100 * x / n) + '%'
console.log(`# Mô phỏng 8 huy hiệu — 1 năm học ${THANG} tháng · khối 54 em · ${RUNS} lần · sao = ${MOC.join('/')} tháng\n`)
console.log('| Huy hiệu | Tháng đạt chuẩn (1–3★) | Tháng hoàn hảo (4–5★) | ≥1★ | ≥2★ | ≥3★ | **≥4★** | **5★** | Bản cứng/năm Toán C2 (' + SI_SO_TOAN_C2 + ' HS): 4★ · 5★ |')
console.log('|---|---|---|---|---|---|---|---|---|')
let t4 = 0, t5 = 0
for (const k in HH) { const a = acc[k], n = a.n, b4 = Math.round(SI_SO_TOAN_C2 * (a.s[3] - a.s[4]) / n), b5 = Math.round(SI_SO_TOAN_C2 * a.s[4] / n)
  t4 += b4; t5 += b5
  console.log(`| **${HH[k][0]}** | ${HH[k][1]} | ${HH[k][2]} | ${pc(a.s[0], n)} | ${pc(a.s[1], n)} | ${pc(a.s[2], n)} | **${pc(a.s[3], n)}** | **${pc(a.s[4], n)}** | ${b4} · ${b5} |`) }
console.log(`\n**Bản cứng / năm học (Toán cấp 2): 4★ ~${t4} · 5★ ~${t5} · tổng ~${t4 + t5}** (4★ đạt rải rác từ tháng 6 · 5★ dồn cuối năm)`)
