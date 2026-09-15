import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const since = new Date(Date.now() - 7 * 86400_000).toISOString()
let all: any[] = []
let from = 0
const PAGE = 1000
for (;;) {
  const { data } = await supabase.from('gami_grades')
    .select('graded_at, buoi_hoc_id, hoc_sinh_id, prob:problem_id(phase)')
    .gte('graded_at', since).range(from, from + PAGE - 1)
  if (!data?.length) break
  all = all.concat(data)
  if (data.length < PAGE) break
  from += PAGE
}
const mtRecent = all.filter((r: any) => r.prob?.phase === 'mt')
const buoiIds = [...new Set(mtRecent.map((r: any) => r.buoi_hoc_id))]
console.log(`Tổng dòng grades 7 ngày qua: ${all.length} · MT: ${mtRecent.length} dòng, ${buoiIds.length} buổi`)
const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, lop:lop_id(ten_lop, mon)').in('id', buoiIds as string[])
for (const b of ((buois ?? []) as any[]).sort((a,b) => a.ngay.localeCompare(b.ngay))) console.log(`  ${b.ngay} · ${b.lop?.ten_lop} · ${b.lop?.mon} · ${b.id}`)
