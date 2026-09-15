// GROUND TRUTH kênh 4, phân trang THẬT, tái hiện đúng luật engine: buổi MT có cửa sổ ∈ {hiện tại,
// liền trước} (cửa sổ tính từ graded_at muộn nhất của buổi), lấy buổi MUỘN NHẤT per HS, dính nếu
// mean HS < 0.9 × mean lớp (mean lớp = TB các mean của HS trong roster có điểm ở buổi đó).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'
import { listCandidatesLop } from '../src/lib/danhgia'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const RV: Record<string, number> = { correct: 1, partial: 0.5, wrong: 0 }
const hienTai = cuaSoCua(Date.now()), truoc = cuaSoTruoc(hienTai)
console.log(`Cửa sổ hiện tại=${hienTai} · liền trước=${truoc}`)

async function fetchAll(build: (f: number, t: number) => any) {
  let out: any[] = []
  for (let f = 0; ; f += 1000) { const { data, error } = await build(f, f + 999); if (error) throw error; out = out.concat(data ?? []); if ((data ?? []).length < 1000) break }
  return out
}
async function kiem(lopId: string, ten: string) {
  const { data: roster } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ho_ten)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc')
  const hsIds = (roster ?? []).map((r: any) => r.hoc_sinh_id)
  const hsTen = new Map((roster ?? []).map((r: any) => [r.hoc_sinh_id, r.hoc_sinh?.ho_ten]))
  const rows = await fetchAll((f, t) => supabase.from('gami_grades').select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase)').in('hoc_sinh_id', hsIds).order('graded_at').order('id').range(f, t))
  const mt = rows.filter((r) => r.prob?.phase === 'mt')
  const byBuoi = new Map<string, { t: string; per: Map<string, { s: number; c: number }> }>()
  for (const r of mt) {
    let b = byBuoi.get(r.buoi_hoc_id); if (!b) { b = { t: r.graded_at, per: new Map() }; byBuoi.set(r.buoi_hoc_id, b) }
    if (r.graded_at > b.t) b.t = r.graded_at
    const v = RV[r.result]; if (v === undefined) continue
    const h = b.per.get(r.hoc_sinh_id) ?? { s: 0, c: 0 }; h.s += v; h.c++; b.per.set(r.hoc_sinh_id, h)
  }
  const buois = [...byBuoi.entries()].map(([id, b]) => ({ id, t: b.t, cs: cuaSoCua(b.t), means: new Map([...b.per].map(([h, x]) => [h, x.s / x.c])) })).sort((a, b) => a.t.localeCompare(b.t))
  const truth = new Set<string>()
  const detail: string[] = []
  for (const hs of hsIds) {
    const mine = buois.filter((b) => b.means.has(hs) && (b.cs === hienTai || b.cs === truoc))
    const last = mine.at(-1); if (!last) continue
    const d = last.means.get(hs)!, vals = [...last.means.values()], tb = vals.reduce((a, b) => a + b, 0) / vals.length
    if (d < tb * 0.9) { truth.add(hs); detail.push(`    ${hsTen.get(hs)}: ${d.toFixed(3)} vs TB ${tb.toFixed(3)} (${(100 * d / tb).toFixed(0)}%) @ ${last.cs}`) }
  }
  const cands = await listCandidatesLop(lopId)
  const engine = new Set(cands.filter((c) => c.kenh.includes('so_lop_mt')).map((c) => c.hoc_sinh_id))
  const chiTruth = [...truth].filter((h) => !engine.has(h)).map((h) => hsTen.get(h))
  const chiEngine = [...engine].filter((h) => !truth.has(h)).map((h) => hsTen.get(h))
  console.log(`\n=== ${ten}: ${rows.length} dòng grades (phân trang), ${mt.length} MT, ${buois.length} buổi MT ===`)
  console.log(`  ground truth dính kênh 4: ${truth.size} · engine: ${engine.size} · ${chiTruth.length === 0 && chiEngine.length === 0 ? '✅ KHỚP' : '❌ LỆCH'}`)
  detail.forEach((d) => console.log(d))
  if (chiTruth.length) console.log(`  ⚠ chỉ truth có: ${chiTruth.join(', ')}`)
  if (chiEngine.length) console.log(`  ⚠ chỉ engine có: ${chiEngine.join(', ')}`)
}
await kiem('b5b9edad-161b-4543-bbda-fac5565bfc0d', '9A1')
await kiem('1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3', '8A1')
await kiem('8c2d1c19-3bd4-479d-8e8a-467a5ade52ab', '6A1')
