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

function chayKhoi({ mon, siSo, pa, tranKieu, apDung, thang = 3 }) {
  const hs = [...KIEU.map(k => ({ ...k })), ...sinhNen(siSo - KIEU.length, apDung)]
  hs.forEach(h => { h.tong = 0; h.src = { et: 0, btvn: 0, mt: 0, tt: 0 }; h.thang = [] })
  const m = MON[mon]
  for (let t = 1; t <= thang; t++) {
    // MT: điểm = 10×skill + nhiễu, xếp hạng trong khối (chỉ người thi)
    const thi = []
    for (const h of hs) {
      h.m = { et: 0, btvn: 0, mt: 0, tt: 0 }
      if (h.vao && t < h.vao) continue
      for (let i = 0; i < m.et; i++) if (rnd() < h.coMat) h.m.et += pa.et
      for (let i = 0; i < m.btvn; i++) { const u = rnd(); if (u < h.dh) h.m.btvn += pa.btvn; else if (u < h.dh + h.muon) h.m.btvn += pa.muon }
      const coThi = !(h.lo_mt || []).includes(t) && rnd() < (h.coMat >= .9 ? .97 : h.coMat >= .8 ? .9 : .75)
      if (coThi) thi.push({ h, d: Math.round(clip(10 * h.skill + 0.9 * gauss(), 0, 10) * 4) / 4 })
    }
    thi.sort((a, b) => b.d - a.d)
    thi.forEach((x, i) => { let hang = i + 1; while (hang > 1 && thi[hang - 2].d === x.d) hang--; x.h.m.mt = mtBang(hang) * pa.mtHeSo })
    // Thử thách theo ngày, rồi áp trần tháng
    for (const h of hs) {
      if (h.vao && t < h.vao) continue
      const tran = tranThang(pa, mon, tranKieu, h.m.et + h.m.btvn + h.m.mt)
      let tt = 0
      for (let d = 0; d < m.ngay; d++) {
        let ngay = 0; const luot = poisson(h.app)
        for (let l = 0; l < luot; l++) { const dung = binom(10, h.skill); if (dung >= 8) ngay += TT_DIEM[dung] }
        tt += Math.min(ngay, TT_TRAN_NGAY)
      }
      h.m.tt = Math.min(tt, tran)
      const tongThang = h.m.et + h.m.btvn + h.m.mt + h.m.tt
      for (const k in h.m) h.src[k] += h.m[k]
      h.tong += tongThang; h.thang.push(tongThang)
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
