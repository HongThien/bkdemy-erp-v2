// Read-only: nguồn thái độ của 1 HS — đếm theo bảng/môn/tháng (argv: lớp, tên)
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const ten = process.argv[3] ?? 'Hoàng Nhật Minh'
const { data: hs } = await supabase.from('hoc_sinh').select('id, ho_ten').ilike('ho_ten', `%${ten}%`).limit(5)
for (const h of (hs ?? []) as any[]) {
  console.log('HS', h.ho_ten, h.id)
  const { data: lops } = await supabase.from('hoc_sinh_lop').select('trang_thai, lop:lop_id(ten_lop, mon)').eq('hoc_sinh_id', h.id)
  console.log(' lớp:', JSON.stringify((lops ?? []).map((l: any) => `${l.lop?.ten_lop}/${l.lop?.mon}/${l.trang_thai}`)))
  const { data: dg, error } = await supabase.from('buoi_danh_gia').select('thai_do, buoi:buoi_hoc_id(ngay, loai, lop:lop_id(ten_lop, mon))').eq('hoc_sinh_id', h.id).limit(2000)
  if (error) console.log(' buoi_danh_gia err', error.message)
  const rows = ((dg ?? []) as any[]).map((r) => ({ td: r.thai_do, ngay: r.buoi?.ngay, loai: r.buoi?.loai, lop: r.buoi?.lop?.ten_lop, mon: r.buoi?.lop?.mon }))
  const g: Record<string, number> = {}
  for (const r of rows) { const k = `${r.mon ?? '?'}|${r.lop ?? '?'}|${String(r.ngay).slice(0, 7)}|${r.td}`; g[k] = (g[k] ?? 0) + 1 }
  console.log(' buoi_danh_gia có thai_do:', rows.filter((r) => r.td).length, '/', rows.length)
  for (const k of Object.keys(g).sort()) console.log('  ', k, g[k])
  const { data: bn } = await supabase.from('btvn_nop').select('*').eq('hoc_sinh_id', h.id).limit(5)
  console.log(' btvn_nop cột:', bn?.[0] ? Object.keys(bn[0]).join(',') : '(0 dòng)')
}
