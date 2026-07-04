import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()

// lop 8B1 + 1 doc btvn của nó
const lop = (await c.query("select id from lop where ten_lop='8B1' limit 1")).rows[0]
const doc = (await c.query("select id from tai_lieu where loai='btvn' and lop_id=$1 limit 1", [lop.id])).rows[0]
console.log('8B1 lop', lop.id, 'doc', doc.id)

// seed bai_test tạm (claude_build bypass RLS)
const bt = (await c.query(
  "insert into bai_test(nguon_tai_lieu_id,lop_id,ngay,loai,mon) values($1,$2,'2026-07-02','btvn','Toán') returning id", [doc.id, lop.id])).rows[0]
await c.query("insert into bai_test_cau(bai_test_id,thu_tu,loai_cau,noi_dung,dap_an_key,diem) values($1,1,'tra_loi_ngan','Test câu 1','6',1)", [bt.id])
console.log('seeded bai_test', bt.id)

async function asHS(ma) {
  const sb = createClient(E.VITE_SUPABASE_URL, E.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
  const { error: le } = await sb.auth.signInWithPassword({ email: `${ma.toLowerCase()}@hs.bkdemy.local`, password: ma })
  if (le) { console.log(ma, 'LOGIN FAIL', le.message); return }
  const { data: hsid } = await sb.rpc('my_hoc_sinh_id')
  const { data: tests, error } = await sb.from('bai_test').select('id, lop_id').eq('trang_thai', 'mo')
  const { data: caus } = await sb.from('bai_test_cau').select('id').eq('bai_test_id', bt.id)
  console.log(`${ma}: my_hoc_sinh_id=${hsid ? 'OK' : 'null'} · thấy ${tests?.length ?? 0} test${error ? ' ERR ' + error.message : ''} · đọc ${caus?.length ?? 0} câu`)
  await sb.auth.signOut()
}
await asHS('HS0009') // 8B1 → PHẢI thấy 1 test + 1 câu
await asHS('HS0010') // 8S1 → KHÔNG được thấy test 8B1, 0 câu

// dọn
await c.query('delete from bai_test where id=$1', [bt.id])
console.log('đã xoá bai_test tạm')
await c.end()
