// Mô phỏng ĐIỂM RANK (spec-thanh-tuu-nhiem-vu.md v4) — KHÔNG đụng DB.
// Tham số nền lấy từ số đo DB thật 28/09/2026 (xem phan-tich-diem-rank.md §1).
// Chạy: node scripts/sim-diem-rank.mjs  → in bảng markdown.
// Monte Carlo: mỗi kịch bản chạy RUNS lần, báo trung bình.

const RUNS = 400
let seed = 20260928
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }
const clip = (x, a, b) => Math.max(a, Math.min(b, x))
const poisson = (l) => { if (l <= 0) return 0; const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rnd() } while (p > L); return k - 1 }
const binom = (n, p) => { let k = 0; for (let i = 0; i < n; i++) if (rnd() < p) k++; return k }

// ---------- bảng MT theo hạng (Phụ lục spec) ----------
const mtBang = (h) => h > 50 ? 50 : Math.round(50 + 50 * Math.pow((51 - h) / 50, 1.5))

// ---------- cấu hình điểm (đề xuất) ----------
const MON = {
  Toan: { et: 5, btvn: 5, ngay: 30 },   // số ET / BTVN chuẩn mỗi tháng (đo thật: ~4.6 / ~4.8)
  KHTN: { et: 3, btvn: 2, ngay: 30 },   // (đo thật: ~2.5 / ~2)
}
const PA = {  // phương án trọng số
  A_MT_nang:  { et: 100, btvn: 100, muon: 50, mtHeSo: 15 },  // MT 750–1500
  B_can_bang: { et: 100, btvn: 100, muon: 50, mtHeSo: 10 },  // MT 500–1000  ← đề xuất
  C_MT_nhe:   { et: 100, btvn: 100, muon: 50, mtHeSo: 5 },   // MT 250–500
}
const TT_DIEM = { 8: 10, 9: 20, 10: 30 }   // điểm 1 lượt Thử thách pass theo số câu đúng /10
const TT_TRAN_NGAY = 60

// trần tháng Thử thách
//  'co_dinh' : ¼ × (tối đa ET + BTVN + MT hạng 1) của môn  → cùng 1 con số cho mọi em
//  'theo_em' : ¼ × (ET + BTVN + MT CHÍNH EM kiếm được tháng đó) → Thử thách ≤ 20% tổng của chính em
function tranThang(pa, mon, kieu, diemHoc) {
  if (kieu === 'theo_em') return Math.round(diemHoc / 4)
  const m = MON[mon]; return Math.round((m.et * pa.et + m.btvn * pa.btvn + 100 * pa.mtHeSo) / 4)
}

// ---------- kiểu HS ----------
// skill: xác suất đúng 1 câu · coMat: xác suất có mặt 1 buổi · dh/muon: BTVN · app: lượt Thử thách / ngày · mt: có đi thi MT
const KIEU = [
  { id: 'K1', ten: 'Giỏi toàn diện (lớp + app đều)',        skill: .92, coMat: 1,   dh: 1,   muon: 0,   app: 2 },
  { id: 'K2', ten: 'Giỏi, KHÔNG dùng app',                   skill: .92, coMat: 1,   dh: 1,   muon: 0,   app: 0 },
  { id: 'K3', ten: 'Khá, chăm',                              skill: .80, coMat: .95, dh: .9,  muon: .05, app: 1 },
  { id: 'K4', ten: 'Trung bình',                             skill: .70, coMat: .9,  dh: .75, muon: .1,  app: .3 },
  { id: 'K5', ten: 'Yếu nhưng cày app rất nhiều',            skill: .55, coMat: .95, dh: .9,  muon: .05, app: 3 },
  { id: 'K6', ten: 'Yếu, lười',                              skill: .55, coMat: .8,  dh: .5,  muon: .1,  app: 0 },
  { id: 'K7', ten: 'Hay ốm/nghỉ (60% buổi, lỡ MT tháng 2)',  skill: .75, coMat: .6,  dh: .6,  muon: .05, app: .5, lo_mt: [2] },
  { id: 'K8', ten: 'Vào học từ tháng 2',                      skill: .85, coMat: 1,   dh: .95, muon: 0,   app: 1, vao: 2 },
  { id: 'K9', ten: 'Giỏi, cày app điên (8 lượt/ngày)',       skill: .88, coMat: .95, dh: .95, muon: 0,   app: 8 },
  { id: 'K10', ten: 'Chăm nhưng KHÔNG BAO GIỜ thi MT',       skill: .80, coMat: .95, dh: .9,  muon: .05, app: 1, lo_mt: [1, 2, 3] },
  { id: 'K11', ten: 'Giỏi, bỏ lớp (50%) bù bằng app',        skill: .90, coMat: .5,  dh: .5,  muon: 0,   app: 4 },
  // thêm 28/09 sau khi Thùy chốt "Thử thách vô hạn lượt, chỉ điểm có trần"
  { id: 'K12', ten: 'Yếu, cày Thử thách vô hạn (15 lượt/ngày)', skill: .55, coMat: .95, dh: .9, muon: .05, app: 15 },
  { id: 'K13', ten: 'Trung bình, cày Thử thách (6 lượt/ngày)',  skill: .70, coMat: .95, dh: .85, muon: .1, app: 6 },
]

// quần thể nền 1 khối (phân bố theo số đo thật)
function sinhNen(n, apDung) {
  const ds = []
  for (let i = 0; i < n; i++) {
    const skill = clip(0.72 + 0.1 * gauss(), 0.35, 0.97)
    const r = rnd(); const coMat = r < .7 ? .95 : r < .9 ? .85 : .65
    const dh = clip(coMat - 0.15 + 0.1 * gauss(), 0.2, 1), muon = 0.1
    let app = 0
    if (rnd() < apDung) { const u = rnd(); app = u < .35 ? .2 : u < .65 ? .6 : u < .9 ? 1.8 : 5 }
    ds.push({ id: 'nen', skill, coMat, dh, muon, app })
  }
  return ds
}

function chayKhoi({ mon, siSo, pa, tranKieu, apDung, thang = 3, tranNgayChia = 0, quyHang = false, thiLai = false, kieu = KIEU }) {
  // quyHang (D4): hạng MT quy đổi = ceil(hạng × 50 / số em có thi) rồi mới tra bảng 1–50
  // thiLai (D6): lỡ MT ⇒ thi lại, vẫn có điểm xếp hạng (HS offline không nghỉ ⇒ mọi em đều có MT)
  // tranNgayChia > 0 ⇒ trần ngày = trần tháng CỐ ĐỊNH ÷ tranNgayChia (D3); 0 ⇒ dùng TT_TRAN_NGAY
  const tranNgay = tranNgayChia ? Math.round(tranThang(pa, mon, 'co_dinh') / tranNgayChia) : TT_TRAN_NGAY
  const hs = [...kieu.map(k => ({ ...k })), ...sinhNen(Math.max(0, siSo - kieu.length), apDung)]
  hs.forEach(h => { h.tong = 0; h.src = { et: 0, btvn: 0, mt: 0, tt: 0 }; h.thang = []; h.cum = [] })
  const m = MON[mon]
  for (let t = 1; t <= thang; t++) {
    // MT: điểm = 10×skill + nhiễu, xếp hạng trong khối (chỉ người thi)
    const thi = []
    for (const h of hs) {
      h.m = { et: 0, btvn: 0, mt: 0, tt: 0 }
      if (h.vao && t < h.vao) continue
      for (let i = 0; i < m.et; i++) if (rnd() < h.coMat) h.m.et += pa.et
      for (let i = 0; i < m.btvn; i++) { const u = rnd(); if (u < h.dh) h.m.btvn += pa.btvn; else if (u < h.dh + h.muon) h.m.btvn += pa.muon }
      const coThi = thiLai || (!(h.lo_mt || []).includes(t) && rnd() < (h.coMat >= .9 ? .97 : h.coMat >= .8 ? .9 : .75))
      if (coThi) thi.push({ h, d: Math.round(clip(10 * h.skill + 0.9 * gauss(), 0, 10) * 4) / 4 })
    }
    thi.sort((a, b) => b.d - a.d)
    thi.forEach((x, i) => { let hang = i + 1; while (hang > 1 && thi[hang - 2].d === x.d) hang--
      if (quyHang) hang = Math.ceil(hang * 50 / thi.length)
      x.h.m.mt = mtBang(hang) * pa.mtHeSo })
    // Thử thách theo ngày, rồi áp trần tháng
    for (const h of hs) {
      if (h.vao && t < h.vao) continue
      const tran = tranThang(pa, mon, tranKieu, h.m.et + h.m.btvn + h.m.mt)
      let tt = 0
      for (let d = 0; d < m.ngay; d++) {
        let ngay = 0; const luot = poisson(h.app)
        for (let l = 0; l < luot; l++) { const dung = binom(10, h.skill); if (dung >= 8) ngay += TT_DIEM[dung] }
        tt += Math.min(ngay, tranNgay)
      }
      h.m.tt = Math.min(tt, tran)
      const tongThang = h.m.et + h.m.btvn + h.m.mt + h.m.tt
      for (const k in h.m) h.src[k] += h.m[k]
      h.tong += tongThang; h.thang.push(tongThang); h.cum[t] = h.tong
    }
  }
  const sorted = [...hs].sort((a, b) => b.tong - a.tong)
  sorted.forEach((h, i) => h.hang = i + 1)
  return hs
}

function monteCarlo(cfg) {
  const acc = {}; const pop = []
  for (let r = 0; r < RUNS; r++) {
    const hs = chayKhoi(cfg)
    for (const h of hs) {
      if (h.id === 'nen') { pop.push(h.tong); continue }
      const a = acc[h.id] ??= { ten: h.ten, tong: 0, hang: 0, et: 0, btvn: 0, mt: 0, tt: 0, t1: 0, t2: 0, t3: 0 }
      a.tong += h.tong; a.hang += h.hang; for (const k in h.src) a[k] += h.src[k]
      h.thang.forEach((v, i) => a['t' + (i + 1 + (h.vao ? h.vao - 1 : 0))] += v)
    }
  }
  for (const a of Object.values(acc)) for (const k of ['tong', 'hang', 'et', 'btvn', 'mt', 'tt', 't1', 't2', 't3']) a[k] = a[k] / RUNS
  pop.sort((a, b) => a - b)
  const pct = (p) => Math.round(pop[Math.floor(p * (pop.length - 1))])
  return { acc, pct }
}

const f = (x) => Math.round(x).toLocaleString('vi-VN')
const pc = (a, b) => b ? Math.round(100 * a / b) + '%' : '—'

function inKieu(title, cfg) {
  const { acc, pct } = monteCarlo(cfg)
  console.log(`\n### ${title}\n`)
  console.log(`Khối ${cfg.mon} ${cfg.siSo} HS · ${cfg.tranKieu === 'theo_em' ? 'trần Thử thách THEO EM' : 'trần Thử thách CỐ ĐỊNH'} · ${Math.round(cfg.apDung * 100)}% HS nền dùng app\n`)
  console.log('| Kiểu HS | T1 | T2 | T3 | **Tổng 3 tháng** | Hạng TB /' + cfg.siSo + ' | ET | BTVN | MT | Thử thách | % Thử thách |')
  console.log('|---|---|---|---|---|---|---|---|---|---|---|')
  for (const k of KIEU) { const a = acc[k.id]
    console.log(`| ${k.id} ${a.ten} | ${f(a.t1)} | ${f(a.t2)} | ${f(a.t3)} | **${f(a.tong)}** | ${Math.round(a.hang)} | ${f(a.et)} | ${f(a.btvn)} | ${f(a.mt)} | ${f(a.tt)} | ${pc(a.tt, a.tong)} |`) }
  console.log(`\nPhân bố tổng 3 tháng của HS nền: p10 ${f(pct(.1))} · p30 ${f(pct(.3))} · p50 ${f(pct(.5))} · p70 ${f(pct(.7))} · p85 ${f(pct(.85))} · p95 ${f(pct(.95))} · max ${f(pct(1))}`)
  return { acc, pct }
}

// ============================================================================
// BỘ SỐ ĐÃ CHỐT (Thùy 28/09): node scripts/sim-diem-rank.mjs --chot
//   D1 ET 100 · BTVN 100/50 · MT bảng×10 · Thử thách 10/20/30 · trần tháng CỐ ĐỊNH ¼ · trần ngày = tháng/20
//   D4 quy hạng MT theo sĩ số dự thi · D6 lỡ MT thi lại · mỗi môn riêng · Thử thách vô hạn lượt
// ============================================================================
const KIEU_CHOT = [
  ...KIEU.filter(k => ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K8', 'K9', 'K12', 'K13'].includes(k.id)),
  { id: 'K7', ten: 'Ốm lỡ MT tháng 2, thi lại', skill: .75, coMat: .9, dh: .85, muon: .1, app: .5, lo_mt: [2] },
]
const HE_SO_BAC = [0, 0.4, 1.0, 1.6, 2.0, 2.4]   // bậc 1..6 (mùa 3 tháng) × điểm tối đa 1 tháng của môn
const maxThang = (pa, mon) => { const m = MON[mon]; return m.et * pa.et + m.btvn * pa.btvn + 100 * pa.mtHeSo + tranThang(pa, mon, 'co_dinh') }

function chayChot(mon, siSo, title, soThang = 3, heSo = HE_SO_BAC) {
  const pa = PA.B_can_bang, mx = maxThang(pa, mon)
  const nguong = heSo.map(k => Math.round(k * mx))
  const ghe = Math.max(1, Math.round(0.03 * siSo))
  const bacCua = (diem, laGhe) => laGhe ? 7 : nguong.reduce((b, n, i) => diem >= n ? i + 1 : b, 1)
  const acc = {}; const phanBo = [null, Array(8).fill(0), Array(8).fill(0), Array(8).fill(0)]; let soNen = 0; let mtNen = 0, mtNenN = 0
  for (let r = 0; r < RUNS; r++) {
    const hs = chayKhoi({ mon, siSo, pa, tranKieu: 'co_dinh', apDung: .6, tranNgayChia: 20, quyHang: true, thiLai: true, kieu: KIEU_CHOT, thang: soThang })
    const bac = {}
    for (let t = 1; t <= soThang; t++) {
      const xep = [...hs].sort((a, b) => (b.cum[t] || 0) - (a.cum[t] || 0))
      xep.forEach((h, i) => { const d = h.cum[t] || 0; (bac[t] ??= new Map()).set(h, bacCua(d, i < ghe && d >= nguong[5])) })
    }
    const xep3 = [...hs].sort((a, b) => b.tong - a.tong); xep3.forEach((h, i) => h.hang = i + 1)
    for (const h of hs) {
      if (h.id === 'nen') { soNen++; for (let t = 1; t <= soThang; t++) phanBo[t][bac[t].get(h)]++; mtNen += h.src.mt; mtNenN++; continue }
      const a = acc[h.id] ??= { ten: h.ten, c1: 0, c2: 0, c3: 0, hang: 0, tt: 0, mt: 0, b1: [], b2: [], b3: [] }
      a.c1 += h.cum[1] || 0; a.c2 += h.cum[2] || 0; a.c3 += h.tong; a.hang += h.hang; a.tt += h.src.tt; a.mt += h.src.mt
      for (let t = 1; t <= soThang; t++) a['b' + t].push(bac[t].get(h))
    }
  }
  const mode = (arr) => { const c = {}; arr.forEach(x => c[x] = (c[x] || 0) + 1); return +Object.entries(c).sort((a, b) => b[1] - a[1])[0][0] }
  console.log(`\n### ${title}\n`)
  console.log(`Điểm tối đa 1 tháng: **${f(mx)}** · Ngưỡng bậc 2–6: ${nguong.slice(1).map(f).join(' / ')} · Ghế bậc 7: top ${ghe} và ≥ ${f(nguong[5])}${mtNenN ? ' · MT TB/tháng HS nền: ' + f(mtNen / mtNenN / soThang) : ''}\n`)
  const n = RUNS, T = [...Array(soThang).keys()].map(i => i + 1)
  if (soThang === 3) {
    console.log('| Kiểu HS | Cộng dồn T1 | Cộng dồn T2 | **Cuối mùa T3** | Hạng /' + siSo + ' | Bậc T1 → T2 → T3 | MT 3 tháng | Thử thách | % TT |')
    console.log('|---|---|---|---|---|---|---|---|---|')
  } else {
    console.log('| Kiểu HS | **Điểm mùa (1 tháng)** | Hạng /' + siSo + ' | **Bậc** | MT | Thử thách | % TT |')
    console.log('|---|---|---|---|---|---|---|')
  }
  for (const [, a] of Object.entries(acc).sort((x, y) => y[1].c3 - x[1].c3))
    console.log(soThang === 3
      ? `| ${a.ten} | ${f(a.c1 / n)} | ${f(a.c2 / n)} | **${f(a.c3 / n)}** | ${Math.round(a.hang / n)} | ${T.map(t => t === 3 ? '**' + mode(a['b' + t]) + '**' : mode(a['b' + t])).join(' → ')} | ${f(a.mt / n)} | ${f(a.tt / n)} | ${pc(a.tt, a.c3)} |`
      : `| ${a.ten} | **${f(a.c3 / n)}** | ${Math.round(a.hang / n)} | **${mode(a.b1)}** | ${f(a.mt / n)} | ${f(a.tt / n)} | ${pc(a.tt, a.c3)} |`)
  if (soNen) {
    console.log('\nPhân bố bậc của HS nền (% số em):\n')
    console.log('| Sau | Bậc 1 | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 | Bậc 7 (ghế) |')
    console.log('|---|---|---|---|---|---|---|---|')
    for (let t = 1; t <= soThang; t++) { const tot = phanBo[t].reduce((s, x) => s + x, 0)
      console.log(`| Tháng ${t} | ${[1, 2, 3, 4, 5, 6, 7].map(b => Math.round(100 * phanBo[t][b] / tot) + '%').join(' | ')} |`) }
  }
}

// ============================================================================
// MÙA 1 NĂM — thang bậc "người thường → thần" (Thùy 28/09): node scripts/sim-diem-rank.mjs --nam
//   8 bậc CỐ ĐỊNH (mỗi bậc 3 sao) + 2 bậc GHẾ (chỉ top khối × môn mới ngồi)
//   Ngưỡng = hệ số × điểm tối đa 1 tháng của môn (Toán 2.500 · KHTN 1.875) — cùng công thức mọi môn
// ============================================================================
const BAC_NAM = [
  { ten: 'Novice', hs: 0 }, { ten: 'Soldier', hs: 0.6 }, { ten: 'Captain', hs: 1.6 }, { ten: 'General', hs: 3.0 },
  { ten: 'Hero', hs: 4.6 }, { ten: 'Legend', hs: 7.0 }, { ten: 'King', hs: 8.0 }, { ten: 'Emperor', hs: 9.8 },
]
// Ghế thần ngồi được QUANH NĂM: xét phong độ = điểm từ đầu mùa ÷ (điểm tối đa tháng × số tháng đã qua)
const GHE_GOD = 0.03, PHONG_DO_GOD = 0.84        // God of War: top 3% khối × môn VÀ phong độ ≥ 84%
const PHONG_DO_SUPREME = 0.92                    // Supreme God: hạng 1 khối × môn VÀ phong độ ≥ 92%
function chayNam(mon, siSo, title, soThang = 12) {
  const pa = PA.B_can_bang, mx = maxThang(pa, mon)
  const ng = BAC_NAM.map(b => Math.round(b.hs * mx))
  const ghe = Math.max(1, Math.round(GHE_GOD * siSo))
  const TEN = [...BAC_NAM.map(b => b.ten), 'God of War', 'Supreme God']
  const bacCua = (d, hang, t) => {
    if (hang === 1 && d >= PHONG_DO_SUPREME * mx * t) return [9, 0]
    if (hang <= ghe && d >= PHONG_DO_GOD * mx * t) return [8, 0]
    let b = 0; ng.forEach((n, i) => { if (d >= n) b = i })
    const tren = b < 7 ? ng[b + 1] : ng[7] + (ng[7] - ng[6])
    const sao = Math.min(3, 1 + Math.floor(3 * (d - ng[b]) / (tren - ng[b])))
    return [b, sao]
  }
  const MOC = [1, 3, 6, 9, 12].filter(t => t <= soThang)
  const kieu = [...KIEU_CHOT.filter(k => k.id !== 'K8'), { id: 'K14', ten: 'Vào học tháng 7 (giữa năm)', skill: .85, coMat: 1, dh: .95, muon: 0, app: 1, vao: 7 }]
  const acc = {}; const pb = {}; MOC.forEach(t => pb[t] = Array(10).fill(0))
  for (let r = 0; r < RUNS / 4; r++) {
    const hs = chayKhoi({ mon, siSo, pa, tranKieu: 'co_dinh', apDung: .6, tranNgayChia: 20, quyHang: true, thiLai: true, kieu, thang: soThang })
    for (const t of MOC) {
      const xep = [...hs].sort((a, b) => (b.cum[t] || 0) - (a.cum[t] || 0))
      xep.forEach((h, i) => { const [b, s] = bacCua(h.cum[t] || 0, i + 1, t)
        if (h.id === 'nen') pb[t][b]++
        else { const a = acc[h.id] ??= { ten: h.ten, d: {}, b: {} }; (a.d[t] ??= []).push(h.cum[t] || 0); (a.b[t] ??= []).push(b * 10 + s) } })
    }
  }
  const tenBac = (code) => { const b = Math.floor(code / 10), s = code % 10; return TEN[b] + (b <= 7 ? ' ' + '★'.repeat(s) : '') }
  const mode = (arr) => { const c = {}; arr.forEach(x => c[x] = (c[x] || 0) + 1); return +Object.entries(c).sort((a, b) => b[1] - a[1])[0][0] }
  const avg = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length
  console.log(`\n### ${title}\n`)
  console.log('Ngưỡng vào bậc: ' + BAC_NAM.map((b, i) => `${b.ten} ${f(ng[i])}`).join(' · ') + ` · God of War: top ${ghe} & phong độ ≥ 84% (${f(PHONG_DO_GOD * mx)}/tháng) · Supreme God: hạng 1 & phong độ ≥ 92% (${f(PHONG_DO_SUPREME * mx)}/tháng)\n`)
  console.log('| Kiểu HS | ' + MOC.map(t => 'Hết T' + t).join(' | ') + ' |')
  console.log('|---|' + MOC.map(() => '---').join('|') + '|')
  for (const [, a] of Object.entries(acc).sort((x, y) => avg(y[1].d[soThang]) - avg(x[1].d[soThang])))
    console.log(`| ${a.ten} | ` + MOC.map(t => `${tenBac(mode(a.b[t]))} (${f(avg(a.d[t]))})`).join(' | ') + ' |')
  console.log('\nPhân bố HS nền theo bậc lớn (%):\n')
  console.log('| Hết tháng | ' + TEN.join(' | ') + ' |')
  console.log('|---|' + TEN.map(() => '---').join('|') + '|')
  for (const t of MOC) { const tot = pb[t].reduce((s, x) => s + x, 0); console.log(`| ${t} | ` + pb[t].map(x => Math.round(100 * x / tot) + '%').join(' | ') + ' |') }
}
if (process.argv.includes('--nam')) {
  console.log('# MÙA 1 NĂM (12 tháng) — ' + (RUNS / 4) + ' lần/khối · bộ số đã chốt')
  chayNam('Toan', 54, 'TOÁN khối 7 — 54 em')
  chayNam('KHTN', 34, 'KHTN khối 9 — 34 em')
  process.exit(0)
}

if (process.argv.includes('--chot')) {
  console.log('# BỘ SỐ ĐÃ CHỐT — mô phỏng mùa 3 tháng, ' + RUNS + ' lần/khối, 60% HS dùng Thử thách\n')
  console.log('ET 100 · BTVN 100 (muộn 50) · MT bảng hạng quy theo sĩ số × 10 (500–1.000) · Thử thách 8/9/10 đúng = 10/20/30')
  console.log('Trần Thử thách: Toán ' + tranThang(PA.B_can_bang, 'Toan', 'co_dinh') + '/tháng, ' + Math.round(tranThang(PA.B_can_bang, 'Toan', 'co_dinh') / 20) + '/ngày · KHTN ' + tranThang(PA.B_can_bang, 'KHTN', 'co_dinh') + '/tháng, ' + Math.round(tranThang(PA.B_can_bang, 'KHTN', 'co_dinh') / 20) + '/ngày')
  chayChot('Toan', 54, 'TOÁN khối 7 — 54 em')
  chayChot('Toan', 68, 'TOÁN khối 9 — 68 em (khối lớn nhất)')
  chayChot('Toan', 11, 'TOÁN khối 4 — 11 em (khối nhỏ, kiểm D4)')
  chayChot('KHTN', 34, 'KHTN khối 9 — 34 em')
  chayChot('KHTN', 11, 'KHTN khối 8 — 11 em (khối nhỏ, kiểm D4)')
  // Phương án MÙA 1 THÁNG (C4 chưa chốt): ngưỡng = hệ số × điểm tối đa 1 tháng
  const HE_SO_1T = [0, 0.4, 0.56, 0.68, 0.76, 0.84]
  console.log('\n---\n## Phương án MÙA 1 THÁNG — hệ số bậc 2–6: ' + HE_SO_1T.slice(1).join(' / '))
  chayChot('Toan', 54, 'MÙA 1 THÁNG — TOÁN khối 7 — 54 em', 1, HE_SO_1T)
  chayChot('KHTN', 34, 'MÙA 1 THÁNG — KHTN khối 9 — 34 em', 1, HE_SO_1T)
  process.exit(0)
}

console.log('# Kết quả mô phỏng Điểm Rank — ' + RUNS + ' lần/kịch bản\n')
console.log('Bảng MT: hạng 1 = ' + mtBang(1) + ' · 10 = ' + mtBang(10) + ' · 25 = ' + mtBang(25) + ' · 50+ = ' + mtBang(50) + ' (× hệ số phương án)')
console.log('Trần Thử thách cố định/tháng — Toán PA B: ' + tranThang(PA.B_can_bang, 'Toan', 'co_dinh') + ' · KHTN PA B: ' + tranThang(PA.B_can_bang, 'KHTN', 'co_dinh'))

inKieu('S1 — PA B cân bằng · trần CỐ ĐỊNH · adoption hiện tại (25%)', { mon: 'Toan', siSo: 54, pa: PA.B_can_bang, tranKieu: 'co_dinh', apDung: .25 })
inKieu('S2 — PA B cân bằng · trần THEO EM · adoption hiện tại (25%)', { mon: 'Toan', siSo: 54, pa: PA.B_can_bang, tranKieu: 'theo_em', apDung: .25 })
inKieu('S3 — PA B · trần THEO EM · adoption sau khi có Thử thách (60%)', { mon: 'Toan', siSo: 54, pa: PA.B_can_bang, tranKieu: 'theo_em', apDung: .6 })
inKieu('S4 — PA A MT nặng (750–1500) · trần theo em · 60%', { mon: 'Toan', siSo: 54, pa: PA.A_MT_nang, tranKieu: 'theo_em', apDung: .6 })
inKieu('S5 — PA C MT nhẹ (250–500) · trần theo em · 60%', { mon: 'Toan', siSo: 54, pa: PA.C_MT_nhe, tranKieu: 'theo_em', apDung: .6 })
inKieu('S6 — KHTN khối NHỎ 12 HS · PA B · trần theo em · 60%', { mon: 'KHTN', siSo: 12, pa: PA.B_can_bang, tranKieu: 'theo_em', apDung: .6 })
inKieu('S7 — Toán khối LỚN 68 HS · PA B · trần theo em · 60%', { mon: 'Toan', siSo: 68, pa: PA.B_can_bang, tranKieu: 'theo_em', apDung: .6 })

// ---- sau khi Thùy chốt D2 (trần cố định — HS offline không được nghỉ), D3 (trần ngày), D5 (mỗi môn riêng) ----
console.log('\n---\n## Sau chốt 28/09: trần CỐ ĐỊNH · trần ngày = trần tháng ÷ 20 · mỗi môn tính riêng')
console.log('Trần ngày Toán = ' + Math.round(tranThang(PA.B_can_bang, 'Toan', 'co_dinh') / 20) + ' · KHTN = ' + Math.round(tranThang(PA.B_can_bang, 'KHTN', 'co_dinh') / 20))
inKieu('S8 — TOÁN khối 54 · CHỐT', { mon: 'Toan', siSo: 54, pa: PA.B_can_bang, tranKieu: 'co_dinh', apDung: .6, tranNgayChia: 20 })
inKieu('S9 — TOÁN khối 68 · CHỐT', { mon: 'Toan', siSo: 68, pa: PA.B_can_bang, tranKieu: 'co_dinh', apDung: .6, tranNgayChia: 20 })
inKieu('S10 — KHTN khối 34 · CHỐT', { mon: 'KHTN', siSo: 34, pa: PA.B_can_bang, tranKieu: 'co_dinh', apDung: .6, tranNgayChia: 20 })
