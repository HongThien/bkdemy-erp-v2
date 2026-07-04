import pg from 'pg'; import { createClient } from '@supabase/supabase-js'; import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f,'utf8').split('\n').map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,'')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()
const cnt = (await c.query('select (select count(*) from tai_khoan where hoc_sinh_id is not null) tk_hs, (select count(*) from hoc_sinh where trang_thai=\'dang_hoc\') hs_dh')).rows[0]
console.log('tài khoản HS:', cnt.tk_hs, '· HS đang học:', cnt.hs_dh)
// lấy 1 HS chưa nằm trong nhóm test
const h = (await c.query("select ma_hs from hoc_sinh where trang_thai='dang_hoc' and ma_hs not in ('HS0004','HS0009','HS0010') order by ma_hs limit 1")).rows[0]
const sb = createClient(E.VITE_SUPABASE_URL, E.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
const { error } = await sb.auth.signInWithPassword({ email: `${h.ma_hs.toLowerCase()}@hs.bkdemy.local`, password: h.ma_hs })
const { data: hsid } = await sb.rpc('my_hoc_sinh_id')
console.log('login thử', h.ma_hs, ':', error ? 'FAIL ' + error.message : 'OK · my_hoc_sinh_id=' + (hsid ? 'resolve ✓' : 'null'))
await sb.auth.signOut(); await c.end()
