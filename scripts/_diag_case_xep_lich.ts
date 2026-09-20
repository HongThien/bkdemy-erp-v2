// Read-only: RPC fn_btyeu_case_xep_lich bằng tài khoản nhân sự — đếm theo trạng thái + mẫu
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCaseChoXepLich } from '../src/lib/botro_yeu'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const r = await listCaseChoXepLich()
console.log(`tổng ${r.length} · chờ xếp ${r.filter((c) => !c.daXep).length} · đã xếp chưa bổ trợ ${r.filter((c) => c.daXep).length} (quá ngày ${r.filter((c) => c.buoiChoHoc?.qua_ngay).length}) · có dạng mới sau xếp ${r.filter((c) => c.soDangMoiSauXep > 0).length} · học ≥1 buổi còn dạng ${r.filter((c) => !c.daXep && c.soBuoiDaHoc > 0).length}`)
console.log('ưu tiên:', JSON.stringify([3, 2, 1].map((u) => [u, r.filter((c) => c.uuTien === u).length])))
console.log('mẫu đã xếp:', JSON.stringify(r.filter((c) => c.daXep).slice(0, 2).map((c) => ({ hs: c.ho_ten, lv: c.level, b: c.buoiChoHoc }))))
