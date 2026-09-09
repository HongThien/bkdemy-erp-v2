// Calibrate 4 tiêu chí MỚI (Thùy 08-23 vòng 2) trên data THẬT — 300 HS Toán, 36 lớp.
// 1) chuyên đề tụt QUA NGƯỠNG bucket (đạt→cần luyện hoặc cần luyện→yếu), pha 2 so chính mình.
// 2) % dạng yếu (muc='yeu') / tổng dạng đã đo — quét 10/15/20% xem chọn mốc nào.
// 3) ET-only: TB 4 buổi ET gần nhất < 90% TB lớp 4 buổi đó (average-vs-average).
// 4) MT-only: bài MT GẦN NHẤT (n≥1, vì MT hiếm 1 lần/tháng) < 90% TB lớp bài đó.
// Kết hợp OR (1 tín hiệu là đủ) + giữ nguyên ③④ (báo động). KHÔNG động DB — chỉ SELECT.
// Chạy: npx vite-node scripts/_diag_calib_botro2.ts
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const bucket = (score: number) => score >= 0.8 ? 'dat' : score >= 0.5 ? 'can_luyen' : 'yeu'
const RANK: Record<string, number> = { dat: 2, can_luyen: 1, yeu: 0 }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)

type Row = {
  hsId: string; lop: string
  sigTrend: boolean; trendLyDo: string
  pctYeu: number; nDangDo: number
  sigET: boolean; etHS: number | null; etLop: number | null
  sigMT: boolean; mtHS: number | null; mtLop: number | null
  coChuongDo: boolean; coLoTienQuyet: boolean
}
const rows: Row[] = []
let tongHS = 0
const t0 = Date.now()

for (const l of (lops ?? []) as any[]) {
  const { data: hslop, count } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id', { count: 'exact' }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const hsIds = (hslop ?? []).map((r: any) => r.hoc_sinh_id)

  // ── Kênh 1+2: dùng thẳng getStatSheetLop (đã có chuyenDes.cham + dangs) ──
  const sheets = await getStatSheetLop(l.id)
  const sheetMap = new Map(sheets.map((s) => [s.hoc_sinh_id, s]))

  // ── Kênh 3+4: ET-only và MT-only, tách riêng khỏi mọi nguồn khác ──
  const { data: grades } = await supabase.from('gami_grades')
    .select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase)')
    .in('hoc_sinh_id', hsIds).limit(20000)
  const gRows = (grades ?? []) as any[]
  const RESULT_VALUE: Record<string, number> = { correct: 1, partial: 0.5, wrong: 0 }

  function buoiTB(phase: string) {
    // { buoi_hoc_id -> { t, perHS: hsId -> {sum,count} } }
    const m = new Map<string, { t: string; perHS: Map<string, { sum: number; count: number }> }>()
    for (const r of gRows) {
      if (r.prob?.phase !== phase || !r.buoi_hoc_id) continue
      const v = RESULT_VALUE[r.result]; if (v === undefined) continue
      let b = m.get(r.buoi_hoc_id)
      if (!b) { b = { t: r.graded_at, perHS: new Map() }; m.set(r.buoi_hoc_id, b) }
      if (Date.parse(r.graded_at) > Date.parse(b.t)) b.t = r.graded_at
      const hh = b.perHS.get(r.hoc_sinh_id) ?? { sum: 0, count: 0 }
      hh.sum += v; hh.count++; b.perHS.set(r.hoc_sinh_id, hh)
    }
    return [...m.entries()].map(([id, b]) => {
      const means = new Map<string, number>()
      for (const [hs, s] of b.perHS) means.set(hs, s.sum / s.count)
      return { id, t: b.t, means }
    }).sort((a, b) => Date.parse(a.t) - Date.parse(b.t))
  }
  const etBuoi = buoiTB('et')
  const mtBuoi = buoiTB('mt')

  for (const hsId of hsIds) {
    const s = sheetMap.get(hsId)
    if (!s) continue

    // Kênh 1: chuyên đề tụt QUA NGƯỠNG bucket (pha 2).
    let sigTrend = false, trendLyDo = ''
    for (const cd of s.chuyenDes) {
      if (cd.cham?.pha !== 2) continue
      const bTruoc = bucket(cd.cham.truoc), bSau = bucket(cd.cham.sau)
      if (RANK[bSau] < RANK[bTruoc]) {
        sigTrend = true
        trendLyDo = `${cd.ten_chuyen_de}: ${bTruoc}(${cd.cham.truoc.toFixed(2)})→${bSau}(${cd.cham.sau.toFixed(2)})`
        break
      }
    }

    // Kênh 2: % dạng yếu / tổng dạng đã đo.
    const nDangDo = s.dangs.length
    const nYeu = s.dangs.filter((d) => d.muc === 'yeu').length
    const pctYeu = nDangDo > 0 ? nYeu / nDangDo : 0

    // Kênh 3: ET-only, TB 4 buổi gần nhất (HS) vs TB 4 buổi đó (lớp) — average-vs-average.
    const etCuaHS = etBuoi.filter((b) => b.means.has(hsId)).slice(-4)
    let sigET = false, etHS: number | null = null, etLop: number | null = null
    if (etCuaHS.length >= 4) {
      etHS = etCuaHS.reduce((s2, b) => s2 + b.means.get(hsId)!, 0) / etCuaHS.length
      etLop = etCuaHS.reduce((s2, b) => s2 + [...b.means.values()].reduce((x, y) => x + y, 0) / b.means.size, 0) / etCuaHS.length
      sigET = etHS < etLop * 0.9
    }

    // Kênh 4: MT-only, bài GẦN NHẤT (n≥1).
    const mtCuaHS = mtBuoi.filter((b) => b.means.has(hsId))
    let sigMT = false, mtHS: number | null = null, mtLop: number | null = null
    if (mtCuaHS.length >= 1) {
      const last = mtCuaHS[mtCuaHS.length - 1]
      mtHS = last.means.get(hsId)!
      mtLop = [...last.means.values()].reduce((x, y) => x + y, 0) / last.means.size
      sigMT = mtHS < mtLop * 0.9
    }

    rows.push({
      hsId, lop: l.ten_lop, sigTrend, trendLyDo, pctYeu, nDangDo,
      sigET, etHS, etLop, sigMT, mtHS, mtLop,
      coChuongDo: s.coChuongDo, coLoTienQuyet: s.coLoTienQuyet,
    })
  }
}

console.log(`\n=== ${lops?.length} lớp Toán · ${tongHS} HS · ${Date.now() - t0}ms ===\n`)

// ── Kênh 1 riêng ──
const c1 = rows.filter((r) => r.sigTrend).length
console.log(`Kênh 1 (chuyên đề tụt qua ngưỡng bucket): ${c1}/${tongHS} = ${(100*c1/tongHS).toFixed(1)}%`)

// ── Kênh 2 — quét mốc % dạng yếu ──
console.log(`\nKênh 2 — % dạng yếu / tổng dạng đã đo (chỉ tính HS có ≥1 dạng đã đo, n=${rows.filter(r=>r.nDangDo>0).length}):`)
for (const moc of [0.10, 0.15, 0.20, 0.25, 0.30]) {
  const n = rows.filter((r) => r.nDangDo > 0 && r.pctYeu > moc).length
  console.log(`   > ${(moc*100).toFixed(0)}% -> ${n}/${tongHS} = ${(100*n/tongHS).toFixed(1)}%`)
}

// ── Kênh 3 riêng ──
const c3elig = rows.filter((r) => r.etHS != null).length
const c3 = rows.filter((r) => r.sigET).length
console.log(`\nKênh 3 (ET TB 4 buổi < 90% TB lớp): đủ dữ liệu (≥4 buổi ET) ${c3elig}/${tongHS} = ${(100*c3elig/tongHS).toFixed(1)}% · trong đó dính: ${c3} (= ${(100*c3/tongHS).toFixed(1)}% toàn roster)`)

// ── Kênh 4 riêng ──
const c4elig = rows.filter((r) => r.mtHS != null).length
const c4 = rows.filter((r) => r.sigMT).length
console.log(`Kênh 4 (MT bài gần nhất < 90% TB lớp): có bài MT ${c4elig}/${tongHS} = ${(100*c4elig/tongHS).toFixed(1)}% · trong đó dính: ${c4} (= ${(100*c4/tongHS).toFixed(1)}% toàn roster)`)

// ── Báo động ③④ (giữ nguyên) ──
const c34 = rows.filter((r) => r.coChuongDo || r.coLoTienQuyet).length
console.log(`\nBáo động ③④ (giữ nguyên, không đổi): ${c34}/${tongHS} = ${(100*c34/tongHS).toFixed(1)}%`)

// ── KẾT HỢP: 1-trong-N là đủ (mốc kênh 2 = 15%, dùng làm baseline hiển thị) ──
console.log(`\n── Kết hợp OR (1-trong-4 tín hiệu + báo động), quét mốc kênh 2 ──`)
for (const moc of [0.10, 0.15, 0.20]) {
  const n = rows.filter((r) =>
    r.sigTrend || (r.nDangDo > 0 && r.pctYeu > moc) || r.sigET || r.sigMT || r.coChuongDo || r.coLoTienQuyet
  ).length
  console.log(`   kênh2 mốc ${(moc*100).toFixed(0)}% -> TỔNG ${n}/${tongHS} = ${(100*n/tongHS).toFixed(1)}%${(100*n/tongHS)>=25 && (100*n/tongHS)<=35 ? '  <= gần mục tiêu 30%' : ''}`)
}

// ── Trùng lặp — bao nhiêu HS dính ≥2 tín hiệu cùng lúc (mốc kênh2=15%) ──
const soTinHieu = (r: Row) => [r.sigTrend, r.nDangDo > 0 && r.pctYeu > 0.15, r.sigET, r.sigMT, r.coChuongDo || r.coLoTienQuyet].filter(Boolean).length
const demSo: Record<number, number> = {}
for (const r of rows) { const n = soTinHieu(r); demSo[n] = (demSo[n] ?? 0) + 1 }
console.log(`\nPhân bố số tín hiệu/HS (mốc kênh2=15%):`, JSON.stringify(demSo))

console.log(`\n── 8 ví dụ HS chỉ dính DUY NHẤT kênh 1 (đọc thử lý do) ──`)
for (const r of rows.filter((x) => x.sigTrend && soTinHieu(x) === 1).slice(0, 8)) {
  console.log(`   ${r.lop} · ${r.trendLyDo}`)
}
console.log(`\n── 8 ví dụ HS chỉ dính DUY NHẤT kênh 3 (ET) ──`)
for (const r of rows.filter((x) => x.sigET && soTinHieu(x) === 1).slice(0, 8)) {
  console.log(`   ${r.lop} · ET ${r.etHS?.toFixed(2)} vs lớp ${r.etLop?.toFixed(2)} (${((r.etHS!/r.etLop!)*100).toFixed(0)}%)`)
}
console.log(`\n── 8 ví dụ HS chỉ dính DUY NHẤT kênh 4 (MT) ──`)
for (const r of rows.filter((x) => x.sigMT && soTinHieu(x) === 1).slice(0, 8)) {
  console.log(`   ${r.lop} · MT ${r.mtHS?.toFixed(2)} vs lớp ${r.mtLop?.toFixed(2)} (${((r.mtHS!/r.mtLop!)*100).toFixed(0)}%)`)
}
