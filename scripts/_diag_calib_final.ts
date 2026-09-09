// Tổng hợp CUỐI: 4 kênh đã chốt tham số (Thùy 08-23):
// 1) chuyên đề tụt QUA NGƯỠNG bucket (đạt→cần luyện / cần luyện→yếu) VÀ delta > 0.2, recency-fixed.
// 2) % dạng yếu / tổng dạng đã đo > 15%.
// 3) ET-only, TB 4 buổi gần nhất < 90% TB lớp.
// 4) MT-only, bài gần nhất < 90% TB lớp.
// + báo động ③④ giữ nguyên. Kết hợp OR (1-trong-N là đủ). 1 lần chạy = 1 snapshot đồng nhất.
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
const RESULT_VALUE: Record<string, number> = { correct: 1, partial: 0.5, wrong: 0 }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)

type Row = { hsId: string; lop: string; sig1: boolean; sig2: boolean; sig2_10: boolean; sig3: boolean; sig4: boolean; sig34: boolean }
const rows: Row[] = []
let tongHS = 0
const t0 = Date.now()

for (const l of (lops ?? []) as any[]) {
  const { data: hslop, count } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id', { count: 'exact' }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const hsIds = (hslop ?? []).map((r: any) => r.hoc_sinh_id)

  const sheets = await getStatSheetLop(l.id)
  const sheetMap = new Map(sheets.map((s) => [s.hoc_sinh_id, s]))

  const { data: grades } = await supabase.from('gami_grades')
    .select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase)')
    .in('hoc_sinh_id', hsIds).limit(20000)
  const gRows = (grades ?? []) as any[]

  function buoiTB(phase: string) {
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

    // Kênh 1
    let sig1 = false
    for (const cd of s.chuyenDes) {
      if (cd.cham?.pha !== 2) continue
      const bTruoc = bucket(cd.cham.truoc), bSau = bucket(cd.cham.sau)
      if (RANK[bSau] >= RANK[bTruoc]) continue
      if (cd.cham.truoc - cd.cham.sau > 0.2) { sig1 = true; break }
    }

    // Kênh 2
    const nDangDo = s.dangs.length
    const nYeu = s.dangs.filter((d) => d.muc === 'yeu').length
    const pctYeu = nDangDo > 0 ? nYeu / nDangDo : 0
    const sig2_10 = nDangDo > 0 && pctYeu > 0.10
    const sig2_15 = nDangDo > 0 && pctYeu > 0.15
    const sig2 = sig2_15

    // Kênh 3
    const etCuaHS = etBuoi.filter((b) => b.means.has(hsId)).slice(-4)
    let sig3 = false
    if (etCuaHS.length >= 4) {
      const etHS = etCuaHS.reduce((s2, b) => s2 + b.means.get(hsId)!, 0) / etCuaHS.length
      const etLop = etCuaHS.reduce((s2, b) => s2 + [...b.means.values()].reduce((x, y) => x + y, 0) / b.means.size, 0) / etCuaHS.length
      sig3 = etHS < etLop * 0.9
    }

    // Kênh 4
    const mtCuaHS = mtBuoi.filter((b) => b.means.has(hsId))
    let sig4 = false
    if (mtCuaHS.length >= 1) {
      const last = mtCuaHS[mtCuaHS.length - 1]
      const mtHS = last.means.get(hsId)!
      const mtLop = [...last.means.values()].reduce((x, y) => x + y, 0) / last.means.size
      sig4 = mtHS < mtLop * 0.9
    }

    const sig34 = s.coChuongDo || s.coLoTienQuyet

    rows.push({ hsId, lop: l.ten_lop, sig1, sig2, sig2_10, sig3, sig4, sig34 })
  }
}

console.log(`\n=== ${lops?.length} lớp Toán · ${tongHS} HS · ${Date.now() - t0}ms ===\n`)
const c1 = rows.filter((r) => r.sig1).length
const c2 = rows.filter((r) => r.sig2).length
const c3 = rows.filter((r) => r.sig3).length
const c4 = rows.filter((r) => r.sig4).length
const c34 = rows.filter((r) => r.sig34).length
console.log(`Kênh 1 (chuyên đề qua ngưỡng + delta>0.2): ${c1}/${tongHS} = ${(100*c1/tongHS).toFixed(1)}%`)
console.log(`Kênh 2 (% dạng yếu > 10%):                  ${c2}/${tongHS} = ${(100*c2/tongHS).toFixed(1)}%`)
console.log(`Kênh 3 (ET TB 4 buổi < 90% TB lớp):          ${c3}/${tongHS} = ${(100*c3/tongHS).toFixed(1)}%`)
console.log(`Kênh 4 (MT bài gần nhất < 90% TB lớp):       ${c4}/${tongHS} = ${(100*c4/tongHS).toFixed(1)}%`)
console.log(`Báo động ③④ (giữ nguyên):                    ${c34}/${tongHS} = ${(100*c34/tongHS).toFixed(1)}%`)

const tong = rows.filter((r) => r.sig1 || r.sig2 || r.sig3 || r.sig4 || r.sig34).length
console.log(`\n★ TỔNG (OR, 1-trong-5 là đủ): ${tong}/${tongHS} = ${(100*tong/tongHS).toFixed(1)}%`)

const soTinHieu = (r: Row) => [r.sig1, r.sig2, r.sig3, r.sig4, r.sig34].filter(Boolean).length
const demSo: Record<number, number> = {}
for (const r of rows) { const n = soTinHieu(r); demSo[n] = (demSo[n] ?? 0) + 1 }
console.log(`Phân bố số tín hiệu/HS:`, JSON.stringify(demSo))

// ── Phân bố CHỈ trên 4 kênh mới (không tính báo động ③④) ──
const soTinHieu4 = (r: Row) => [r.sig1, r.sig2, r.sig3, r.sig4].filter(Boolean).length
const demSo4: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
for (const r of rows) demSo4[soTinHieu4(r)]++
console.log(`\n── Phân bố CHỈ 4 kênh (không gộp báo động ③④) ──`)
for (const n of [0, 1, 2, 3, 4]) {
  console.log(`   đúng ${n} tín hiệu: ${demSo4[n]}/${tongHS} = ${(100*demSo4[n]/tongHS).toFixed(1)}%`)
}
console.log(`   ≥1 tín hiệu (OR): ${tongHS - demSo4[0]}/${tongHS} = ${(100*(tongHS-demSo4[0])/tongHS).toFixed(1)}%`)
console.log(`   ≥2 tín hiệu: ${demSo4[2]+demSo4[3]+demSo4[4]}/${tongHS} = ${(100*(demSo4[2]+demSo4[3]+demSo4[4])/tongHS).toFixed(1)}%`)
console.log(`   ≥3 tín hiệu: ${demSo4[3]+demSo4[4]}/${tongHS} = ${(100*(demSo4[3]+demSo4[4])/tongHS).toFixed(1)}%`)

// ── Phân tích CẶP: 1-2, 1-3, 1-4, 2-3, 2-4, 3-4 ──
console.log(`\n── Phân tích từng CẶP kênh (chồng lấn vs độc lập) ──`)
const KEYS = ['sig1', 'sig2', 'sig3', 'sig4'] as const
const PAIRS: [number, number][] = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
for (const [i, j] of PAIRS) {
  const ki = KEYS[i], kj = KEYS[j]
  const both = rows.filter((r) => r[ki] && r[kj]).length
  const onlyI = rows.filter((r) => r[ki] && !r[kj]).length
  const onlyJ = rows.filter((r) => !r[ki] && r[kj]).length
  const either = both + onlyI + onlyJ
  const ni = rows.filter((r) => r[ki]).length
  const nj = rows.filter((r) => r[kj]).length
  const jaccard = either > 0 ? both / either : 0
  console.log(`\n   Kênh ${i+1} (n=${ni}) × Kênh ${j+1} (n=${nj}):`)
  console.log(`     cả 2 cùng dính: ${both} (${(100*both/tongHS).toFixed(1)}%)`)
  console.log(`     chỉ kênh ${i+1}: ${onlyI} · chỉ kênh ${j+1}: ${onlyJ}`)
  console.log(`     hợp (≥1 trong 2): ${either} (${(100*either/tongHS).toFixed(1)}%) · Jaccard overlap = ${(100*jaccard).toFixed(1)}%`)
  console.log(`     % kênh ${i+1} mà CŨNG dính kênh ${j+1}: ${ni > 0 ? (100*both/ni).toFixed(1) : '—'}% · % kênh ${j+1} mà CŨNG dính kênh ${i+1}: ${nj > 0 ? (100*both/nj).toFixed(1) : '—'}%`)
}

// ── ĐỀ XUẤT CUỐI: ≥2-trong-4 kênh HOẶC báo động ③④ — so 2 phương án kênh2 ──
console.log(`\n── ĐỀ XUẤT: ≥2-trong-4 HOẶC báo động ③④ ──`)
const soTinHieu4_15 = (r: Row) => [r.sig1, r.sig2, r.sig3, r.sig4].filter(Boolean).length
const soTinHieu4_10 = (r: Row) => [r.sig1, r.sig2_10, r.sig3, r.sig4].filter(Boolean).length
const final15 = rows.filter((r) => soTinHieu4_15(r) >= 2 || r.sig34).length
const final10 = rows.filter((r) => soTinHieu4_10(r) >= 2 || r.sig34).length
console.log(`   kênh2 mốc 15%: ${final15}/${tongHS} = ${(100*final15/tongHS).toFixed(1)}%`)
console.log(`   kênh2 mốc 10%: ${final10}/${tongHS} = ${(100*final10/tongHS).toFixed(1)}%`)
const chiBaoDong15 = rows.filter((r) => r.sig34 && soTinHieu4_15(r) < 2).length
console.log(`   (trong đó chỉ vào vì báo động, chưa đủ 2 kênh — mốc 15%: ${chiBaoDong15})`)
