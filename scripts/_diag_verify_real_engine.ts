// Verify SỐ THẬT sau khi wire logic ≥2/4 vào listCandidatesLop thật (không phải script mô phỏng).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
let tongHS = 0, tongCand = 0
const demKenh: Record<string, number> = {}
const t0 = Date.now()
for (const l of (lops ?? []) as any[]) {
  const { count } = await supabase.from('hoc_sinh_lop').select('*', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
  if (!count) continue
  tongHS += count
  const cands = await listCandidatesLop(l.id)
  tongCand += cands.length
  for (const c of cands) for (const k of c.kenh) demKenh[k] = (demKenh[k] ?? 0) + 1
}
console.log(`\n=== listCandidatesLop THẬT · ${lops?.length} lớp Toán · ${tongHS} HS · ${Date.now()-t0}ms ===`)
console.log(`Tổng candidate: ${tongCand}/${tongHS} = ${(100*tongCand/tongHS).toFixed(1)}%`)
console.log('Theo kênh:', JSON.stringify(demKenh))
