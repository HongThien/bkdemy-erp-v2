import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const { count: totalCount } = await supabase.from('gami_grades').select('*', { count: 'exact', head: true })
console.log('Tổng số dòng gami_grades (toàn hệ):', totalCount)

const { data: lop8s1 } = await supabase.from('lop').select('id').eq('mon', 'Toán').eq('trang_thai', 'dang_hoc').limit(200)
const lopIds = (lop8s1 ?? []).map((l: any) => l.id)
const { data: hslop } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop_id').in('lop_id', lopIds).eq('trang_thai', 'dang_hoc')
const hsIds = [...new Set((hslop ?? []).map((r: any) => r.hoc_sinh_id))]

const { count: cntThisSet } = await supabase.from('gami_grades').select('*', { count: 'exact', head: true }).in('hoc_sinh_id', hsIds.slice(0,50))
console.log('Số dòng của 50 HS đầu (probe):', cntThisSet)

// Lấy 1 HS mẫu, xem full grades của em đó (không limit)
const sampleHs = hsIds[0]
const { data: sampleGrades, count: sampleCount } = await supabase.from('gami_grades').select('buoi_hoc_id, problem_id, graded_at', { count: 'exact' }).eq('hoc_sinh_id', sampleHs).limit(5000)
console.log(`HS mẫu ${sampleHs}: tổng ${sampleCount} dòng grades, ${sampleGrades?.length} lấy được`)
