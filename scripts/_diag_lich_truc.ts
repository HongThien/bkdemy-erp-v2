// Read-only smoke: RPC fn_lich_truc_cua_hs + listLichTruc (argv: hoc_sinh_id, mon)
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listLichTruc, lichTrucCuaHS, goiYTheoLichTruc, goiYXepLichBoTroYeu } from '../src/lib/botro_yeu'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const hs = process.argv[2] ?? '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb', mon = process.argv[3] ?? 'Toán'
console.log('lich_truc_bo_tro rows:', (await listLichTruc()).length)
const slots = await lichTrucCuaHS(hs, mon)
console.log('slot áp dụng cho HS:', JSON.stringify(slots))
const g = await goiYXepLichBoTroYeu(hs, mon)
console.log('đề xuất (ưu tiên):', JSON.stringify(goiYTheoLichTruc(slots, g.ganNhat).slice(0, 4).map((s) => `${s.ngay} ${s.gio_bat_dau} ${s.khopCaTruoc ? '★' : ''}`)))
