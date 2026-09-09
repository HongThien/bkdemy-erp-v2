import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

// Quét rộng hơn: mọi dòng MT chấm trong 3 ngày gần nhất (theo graded_at), gom theo buổi.
const since = new Date(Date.now() - 3 * 86400_000).toISOString()
const { data: mtRows } = await supabase.from('gami_grades')
  .select('graded_at, buoi_hoc_id, hoc_sinh_id, prob:problem_id(phase)')
  .gte('graded_at', since).limit(5000)
const mtRecent = (mtRows ?? []).filter((r: any) => r.prob?.phase === 'mt')
const buoiIds = [...new Set(mtRecent.map((r: any) => r.buoi_hoc_id))]
console.log(`MT chấm trong 3 ngày gần nhất: ${mtRecent.length} dòng, ${buoiIds.length} buổi`)
const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, lop:lop_id(ten_lop, mon)').in('id', buoiIds as string[])
for (const b of (buois ?? []) as any[]) console.log(`  ${b.ngay} · ${b.lop?.ten_lop} · ${b.lop?.mon} · ${b.id}`)
