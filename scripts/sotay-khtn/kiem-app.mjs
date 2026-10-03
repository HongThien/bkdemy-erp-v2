// Kiểm sổ tay KHTN qua ĐÚNG đường app HS (đăng nhập thật bằng em test, qua RLS). Chạy: node scripts/sotay-khtn/kiem-app.mjs <.env.local>
import { createClient } from '@supabase/supabase-js'
process.loadEnvFile(process.argv[2])
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
const { error } = await sb.auth.signInWithPassword({ email: 'test06@hs.bkdemy.local', password: 'TEST06' })
if (error) throw error
const cay = await sb.rpc('hs_sotay_muc_cay', { p_mon: 'KHTN', p_khoi: null })
if (cay.error) throw cay.error
console.log('cây: khối', cay.data.khoi, '· khối có', cay.data.khoi_list.join(','), '· chủ đề', cay.data.chu_de.length,
  '\n ', cay.data.chu_de.map((c) => `${c.nhanh}/${c.ten} (${c.muc.length})`).join(' · '))
const cd = cay.data.chu_de.find((c) => c.nhanh === 'Hóa') ?? cay.data.chu_de[0]
const m = await sb.rpc('hs_sotay_muc', { p_ma: cd.muc[0].ma })
if (m.error) throw m.error
console.log('\nmở', cd.muc[0].ma, '→', m.data.ten, `[${m.data.loai}]`, '· phần có:', Object.keys(m.data).filter((k) => ['y', 'bang', 'bien', 'vd', 'nham', 'lq', 'cong_thuc'].includes(k)).join(','))
const tim = await sb.rpc('hs_sotay_tim_ct', { p_tu_khoa: 'kim loai', p_mon: 'KHTN', p_khoi: '9', p_limit: 20 })
if (tim.error) throw tim.error
console.log('\ntìm "kim loai" khối 9:', tim.data.length, '·', tim.data.slice(0, 5).map((r) => `${r.ten} [${r.loai}]`).join(' · '))
const toan = await sb.rpc('hs_sotay_muc_cay', { p_mon: 'Toán', p_khoi: null })
console.log('\nToán: cây mục', toan.error ? toan.error.message : `${toan.data.chu_de.length} chủ đề (0 thẻ đã duyệt ⇒ app không hiện tab Sổ tay)`)
await sb.auth.signOut()
