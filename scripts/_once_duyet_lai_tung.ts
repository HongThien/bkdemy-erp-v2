// CHẠY 1 LẦN (Thùy OK): khôi phục level kiến thức Tùng về L1 sau khi xoá test 09/09 — đi đúng đường `duyetLevel` (ghi hs_level_log + hs_level).
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { duyetLevel, getLevelLog } from '../src/lib/danhgia'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const HS = '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb'
await duyetLevel({ hocSinhId: HS, mon: 'Toán', loai: 'kien_thuc', levelChot: 1, levelMayDeXuat: null, lyDoMay: { ghiChu: 'khôi phục sau test 09/09' }, lyDoNguoi: 'Khôi phục L1 sau khi xoá dữ liệu test bổ trợ yếu 09/09 (Thùy OK)' })
const { data: lv } = await supabase.from('hs_level').select('loai, level').eq('hoc_sinh_id', HS).eq('mon', 'Toán')
console.log('hs_level:', JSON.stringify(lv))
console.log('log 3 dòng mới nhất:', JSON.stringify((await getLevelLog(HS, 'Toán')).slice(0, 3).map((r) => ({ loai: r.loai, cu: r.level_cu, chot: r.level_chot, at: r.created_at }))))
