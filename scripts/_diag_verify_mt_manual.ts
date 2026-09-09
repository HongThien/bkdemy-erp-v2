import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const RESULT_VALUE: Record<string, number> = { correct: 1, partial: 0.5, wrong: 0 }

async function raiSoMT(lopId: string, ten: string) {
  const { data: roster } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ho_ten)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc')
  const hsIds = (roster ?? []).map((r: any) => r.hoc_sinh_id)
  const { data: grades } = await supabase.from('gami_grades').select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase)').in('hoc_sinh_id', hsIds).limit(20000)
  const mtRows = (grades ?? []).filter((r: any) => r.prob?.phase === 'mt')
  const byBuoi = new Map<string, { t: string; per: Map<string, {sum:number,count:number}> }>()
  for (const r of mtRows as any[]) {
    let b = byBuoi.get(r.buoi_hoc_id)
    if (!b) { b = { t: r.graded_at, per: new Map() }; byBuoi.set(r.buoi_hoc_id, b) }
    if (r.graded_at > b.t) b.t = r.graded_at
    const v = RESULT_VALUE[r.result]; if (v === undefined) continue
    const hh = b.per.get(r.hoc_sinh_id) ?? { sum: 0, count: 0 }
    hh.sum += v; hh.count++; b.per.set(r.hoc_sinh_id, hh)
  }
  const sorted = [...byBuoi.entries()].sort((a,b) => a[1].t.localeCompare(b[1].t))
  const last = sorted[sorted.length - 1]
  if (!last) { console.log(`${ten}: KHÔNG có MT nào`); return }
  const means = new Map<string, number>()
  for (const [hs, s] of last[1].per) means.set(hs, s.sum / s.count)
  const vals = [...means.values()]
  const tbLop = vals.reduce((a,b)=>a+b,0) / vals.length
  const hsMap = new Map((roster ?? []).map((r: any) => [r.hoc_sinh_id, r.hoc_sinh?.ho_ten]))
  console.log(`\n${ten} — MT gần nhất (buổi ${last[0]}, ${last[1].t}), TB lớp = ${tbLop.toFixed(3)}, ${vals.length} HS có điểm:`)
  const rows = [...means.entries()].map(([hs, d]) => ({ ten: hsMap.get(hs), diem: d, pct: d / tbLop })).sort((a,b) => a.pct - b.pct)
  for (const r of rows) console.log(`  ${r.ten}: ${r.diem.toFixed(3)} (${(r.pct*100).toFixed(0)}% TB lớp)${r.pct < 0.9 ? '  <-- DƯỚI 90%, phải dính kênh MT' : ''}`)
}
await raiSoMT('b5b9edad-161b-4543-bbda-fac5565bfc0d', '9A1')
await raiSoMT('8c2d1c19-3bd4-479d-8e8a-467a5ade52ab', '6A1')
