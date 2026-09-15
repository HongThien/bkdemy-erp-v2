import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const { data } = await supabase.from('gami_grades').select('buoi_hoc_id, prob:problem_id(phase, ma_dang)').limit(3000)
const rows = (data ?? []) as any[]
const cand = rows.find(r => r.prob?.phase === 'ingame' && r.prob?.ma_dang && r.buoi_hoc_id)
if (!cand) { console.log('none found'); process.exit(0) }
const { data: buoi } = await supabase.from('buoi_hoc').select('id, ngay, lop:lop_id(ten_lop, mon), trang_thai, danh_gia_xong_at').eq('id', cand.buoi_hoc_id).single()
console.log(JSON.stringify(buoi, null, 2))
