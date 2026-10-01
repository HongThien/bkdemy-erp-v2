// Read-only: gọi RPC fn_btyeu_ta_cau_tln bằng tài khoản nhân sự (dev admin) cho các ca bổ trợ yếu hôm nay
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const { data: buois, error: eB } = await supabase.from('buoi_hoc').select('id, ngay, gio_bat_dau, trang_thai, buoi_hoc_hs!buoi_hoc_hs_buoi_hoc_id_fkey(diem_danh, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs))').eq('loai', 'bo_tro_yeu').gte('ngay', '2026-09-18').order('ngay', { ascending: false }).limit(30)
if (eB) console.log('ERR buoi:', eB.message); console.log('số buổi:', (buois ?? []).length)
for (const b of (buois ?? []) as any[]) {
  const { data, error } = await supabase.rpc('fn_btyeu_ta_cau_tln', { p_buoi: b.id })
  const hs = b.buoi_hoc_hs?.[0]
  console.log(`${b.ngay} ${String(b.gio_bat_dau).slice(0, 5)} ${b.trang_thai} · ${hs?.hoc_sinh?.ho_ten} (${hs?.hoc_sinh?.ma_hs}) dd=${hs?.diem_danh} → TLN đã trả lời: ${error ? 'ERR ' + error.message : (data as any[]).length}`)
}
