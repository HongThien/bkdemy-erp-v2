import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lop8s1 } = await supabase.from('lop').select('id').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
const lopIds = (lop8s1 ?? []).map((l: any) => l.id)
const { data: hslop } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop_id').in('lop_id', lopIds).eq('trang_thai', 'dang_hoc')
const hsIds = [...new Set((hslop ?? []).map((r: any) => r.hoc_sinh_id))]

// Paginate theo HS (tránh limit PostgREST) — batch 20 HS/lượt.
const byHsPhase = new Map<string, Set<string>>()
for (let i = 0; i < hsIds.length; i += 20) {
  const batch = hsIds.slice(i, i + 20)
  const { data: grades } = await supabase.from('gami_grades').select('hoc_sinh_id, buoi_hoc_id, prob:problem_id(phase)').in('hoc_sinh_id', batch).limit(20000)
  for (const r of (grades ?? []) as any[]) {
    const phase = r.prob?.phase
    if (!phase || !r.buoi_hoc_id) continue
    const key = `${r.hoc_sinh_id}|${phase}`
    if (!byHsPhase.has(key)) byHsPhase.set(key, new Set())
    byHsPhase.get(key)!.add(r.buoi_hoc_id)
  }
}
const mtCounts: number[] = [], etCounts: number[] = []
for (const hs of hsIds) {
  mtCounts.push(byHsPhase.get(`${hs}|mt`)?.size ?? 0)
  etCounts.push(byHsPhase.get(`${hs}|et`)?.size ?? 0)
}
const avg = (a: number[]) => a.reduce((x,y)=>x+y,0)/a.length
console.log(`HS: ${hsIds.length}`)
console.log(`MT bài/HS: TB ${avg(mtCounts).toFixed(2)} · %HS 0 bài: ${(100*mtCounts.filter(c=>c===0).length/mtCounts.length).toFixed(1)}% · %HS ≥2: ${(100*mtCounts.filter(c=>c>=2).length/mtCounts.length).toFixed(1)}% · %HS ≥3: ${(100*mtCounts.filter(c=>c>=3).length/mtCounts.length).toFixed(1)}%`)
console.log(`ET bài/HS: TB ${avg(etCounts).toFixed(2)} · %HS 0 bài: ${(100*etCounts.filter(c=>c===0).length/etCounts.length).toFixed(1)}% · %HS ≥3: ${(100*etCounts.filter(c=>c>=3).length/etCounts.length).toFixed(1)}% · %HS ≥6: ${(100*etCounts.filter(c=>c>=6).length/etCounts.length).toFixed(1)}%`)
