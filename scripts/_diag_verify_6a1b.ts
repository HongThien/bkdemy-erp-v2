import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const buoiId = 'edae4996-d5e3-4d66-af9f-bfd0995e9f4d'
const { data: grades } = await supabase.from('gami_grades').select('problem_id').eq('buoi_hoc_id', buoiId).limit(400)
const probIds = [...new Set((grades ?? []).map((r: any) => r.problem_id))]
console.log('Số problem_id distinct:', probIds.length)
const { data: probs, error } = await supabase.from('gami_session_problems').select('id, phase, ma_dang, hinh_baitoan_id').in('id', probIds)
if (error) console.log('ERROR:', error.message)
console.log('Số problems tra được:', probs?.length)
const phaseCounts: Record<string, number> = {}
for (const p of (probs ?? []) as any[]) phaseCounts[p.phase ?? 'NULL'] = (phaseCounts[p.phase ?? 'NULL'] ?? 0) + 1
console.log('Phân bố phase:', JSON.stringify(phaseCounts))
console.log('Mẫu 3 problems:', JSON.stringify((probs ?? []).slice(0,3)))

// Thử lại join lồng y hệt napLanDo dùng
const { data: g2 } = await supabase.from('gami_grades').select('hoc_sinh_id, result, prob:problem_id(phase, ma_dang)').eq('buoi_hoc_id', buoiId).limit(5)
console.log('Join lồng mẫu:', JSON.stringify(g2))
