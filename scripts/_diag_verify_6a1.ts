import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const buoiId = 'edae4996-d5e3-4d66-af9f-bfd0995e9f4d'
const { data: buoi } = await supabase.from('buoi_hoc').select('id, ngay, lop_id, lop:lop_id(ten_lop, mon, trang_thai)').eq('id', buoiId).single()
console.log('Buổi:', JSON.stringify(buoi, null, 2))

const { data: roster, count } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id', { count: 'exact' }).eq('lop_id', (buoi as any).lop_id).eq('trang_thai', 'dang_hoc')
console.log('Roster dang_hoc count:', count)

const { data: mtGrades, count: mtCount } = await supabase.from('gami_grades').select('hoc_sinh_id, result', { count: 'exact' }).eq('buoi_hoc_id', buoiId).limit(5)
console.log('MT grades của buổi này:', mtCount, 'dòng, mẫu:', JSON.stringify(mtGrades))

// HS trong grades có nằm trong roster hiện tại không?
const rosterIds = new Set((roster ?? []).map((r: any) => r.hoc_sinh_id))
const { data: allMt } = await supabase.from('gami_grades').select('hoc_sinh_id').eq('buoi_hoc_id', buoiId)
const mtHsIds = [...new Set((allMt ?? []).map((r: any) => r.hoc_sinh_id))]
console.log('HS có MT ở buổi này:', mtHsIds.length, '· trong đó nằm trong roster hiện tại:', mtHsIds.filter(id => rosterIds.has(id)).length)
