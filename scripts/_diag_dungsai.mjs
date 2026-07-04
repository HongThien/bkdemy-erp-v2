import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { extractKey, gradeDungSai } from '../src/gami/testgrade.js'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()

const lop = (await c.query("select id from lop where ten_lop='8B1' limit 1")).rows[0]
const dang = (await c.query("select ma_dang from dai_ban_do where khoi='8' limit 1")).rows[0].ma_dang
console.log('dùng ma_dang', dang)

// 1) seed câu đúng/sai structured (menh_de = 4 ý, key D/S/D/S)
const menhDe = [
  { noi_dung: 'Mệnh đề 1 (đúng)', dap_an: 'D', ma_dang: dang, loi_giai: 'vì ...' },
  { noi_dung: 'Mệnh đề 2 (sai)', dap_an: 'S', ma_dang: dang, loi_giai: 'sai vì ...' },
  { noi_dung: 'Mệnh đề 3 (đúng)', dap_an: 'D', ma_dang: dang, loi_giai: null },
  { noi_dung: 'Mệnh đề 4 (sai)', dap_an: 'S', ma_dang: dang, loi_giai: null },
]
const cau = (await c.query(
  "insert into dai_cau_hoi(dang_chinh,loai_cau,noi_dung,menh_de,nguon,nguon_giai) values($1,'dung_sai','Câu ĐS test',$2::jsonb,'le','nguoi') returning ma_cau",
  [dang, JSON.stringify(menhDe)])).rows[0]
console.log('seeded câu', cau.ma_cau)

// 2) temp bai_test + bai_test_cau (snapshot qua extractKey như service)
const k = extractKey({ loai_cau: 'dung_sai', menh_de: menhDe })
console.log('extractKey →', JSON.stringify(k))
const bt = (await c.query("insert into bai_test(lop_id,ngay,loai,mon) values($1,'2026-07-02','btvn','Toán') returning id", [lop.id])).rows[0]
await c.query("insert into bai_test_cau(bai_test_id,thu_tu,ma_cau,loai_cau,noi_dung,menh_de,dap_an_key,diem) values($1,1,$2,'dung_sai','Câu ĐS test',$3::jsonb,$4::jsonb,1)",
  [bt.id, cau.ma_cau, JSON.stringify(menhDe), JSON.stringify(k.key)])
const btc = (await c.query('select id from bai_test_cau where bai_test_id=$1', [bt.id])).rows[0]

// 3) as HS0009 (anon): mở bài làm + ghi bai_lam_cau (đường WRITE của HS — RLS insert)
const sb = createClient(E.VITE_SUPABASE_URL, E.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
await sb.auth.signInWithPassword({ email: 'hs0009@hs.bkdemy.local', password: 'HS0009' })
const { data: hsid } = await sb.rpc('my_hoc_sinh_id')
await sb.from('bai_lam').upsert({ bai_test_id: bt.id, hoc_sinh_id: hsid }, { onConflict: 'bai_test_id,hoc_sinh_id', ignoreDuplicates: true })
const { data: bl } = await sb.from('bai_lam').select('id').eq('bai_test_id', bt.id).single()

const hsAns = ['D', 'S', 'D', 'D'] // 3/4 đúng (ý 4 sai) → partial, 0.5
const g = gradeDungSai(hsAns, k.key)
console.log('grade →', JSON.stringify(g))
const { error: werr } = await sb.from('bai_lam_cau').upsert({
  bai_lam_id: bl.id, bai_test_cau_id: btc.id, dap_an_hs: hsAns, verdict: g.verdict, diem: g.diemTho, cham_boi: 'exact',
}, { onConflict: 'bai_lam_id,bai_test_cau_id' })
console.log(werr ? 'WRITE FAIL ' + werr.message : 'WRITE OK (RLS cho HS ghi bài làm)')

// đọc lại verify
const { data: check } = await sb.from('bai_lam_cau').select('verdict,diem,dap_an_hs').eq('bai_lam_id', bl.id).single()
console.log('đọc lại:', JSON.stringify(check), '→', check?.verdict === 'partial' && Number(check?.diem) === 0.5 ? 'ĐÚNG ✓' : 'SAI ✗')
await sb.auth.signOut()

// 4) cleanup
await c.query('delete from bai_test where id=$1', [bt.id])
await c.query('delete from dai_cau_hoi where ma_cau=$1', [cau.ma_cau])
console.log('đã dọn câu + bai_test tạm')
await c.end()
