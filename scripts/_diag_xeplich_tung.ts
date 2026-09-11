// Read-only: Thùy 09-09 "xếp Triệu Đức Tùng 16-17h hôm nay, người bổ trợ = t — không thấy lưu". Kiểm DB thật.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const ten = process.argv[2] ?? 'Triệu Đức Tùng'
const { data: hs } = await supabase.from('hoc_sinh').select('id, ho_ten, ma_hs').ilike('ho_ten', `%${ten}%`).limit(10)
console.log('HS:', JSON.stringify(hs))
for (const h of (hs ?? []) as any[]) {
  const { data: cases } = await supabase.from('bo_tro_yeu').select('id, mon, trang_thai, created_at, bo_tro_yeu_dang(id)').eq('hoc_sinh_id', h.id).order('created_at', { ascending: false }).limit(10)
  console.log(`case của ${h.ho_ten}:`, JSON.stringify((cases ?? []).map((c: any) => ({ id: c.id, mon: c.mon, tt: c.trang_thai, at: c.created_at, soDang: c.bo_tro_yeu_dang?.length }))))
  const { data: bh, error } = await supabase.from('buoi_hoc_hs')
    .select('bo_tro_yeu_id, buoi:buoi_hoc_id(id, loai, ngay, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_at, created_by)')
    .eq('hoc_sinh_id', h.id).not('bo_tro_yeu_id', 'is', null).limit(50)
  if (error) console.log('ERR', error.message)
  console.log(`buổi bổ trợ yếu của ${h.ho_ten}:`, JSON.stringify(bh, null, 1))
}
// buổi bo_tro_yeu tạo hôm nay (mọi HS) — phòng khi gắn nhầm HS
const { data: homNay } = await supabase.from('buoi_hoc').select('id, ngay, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_at').eq('loai', 'bo_tro_yeu').gte('created_at', new Date(Date.now() - 86400_000).toISOString()).order('created_at', { ascending: false }).limit(20)
console.log('buoi_hoc loai=bo_tro_yeu tạo 24h qua:', JSON.stringify(homNay, null, 1))
