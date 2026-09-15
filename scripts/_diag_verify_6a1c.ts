import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const lopId = '8c2d1c19-3bd4-479d-8e8a-467a5ade52ab'
const { data: roster, error: e1 } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ho_ten)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc')
console.log('roster error:', e1?.message, 'count:', roster?.length)
const hsIds = (roster ?? []).map((r: any) => r.hoc_sinh_id)
console.log('hsIds sample:', hsIds.slice(0,3))

const { data: grades, error: e2 } = await supabase.from('gami_grades').select('hoc_sinh_id, buoi_hoc_id, graded_at, result, prob:problem_id(phase)').in('hoc_sinh_id', hsIds).limit(20000)
console.log('grades error:', e2?.message, 'count:', grades?.length)
const mtRows = (grades ?? []).filter((r: any) => r.prob?.phase === 'mt')
console.log('mtRows count:', mtRows.length)
const byBuoiSet = new Set(mtRows.map((r:any) => r.buoi_hoc_id))
console.log('buoi distinct in mtRows:', [...byBuoiSet])
