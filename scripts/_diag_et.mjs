import pg from 'pg'; import { createClient } from '@supabase/supabase-js'; import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f,'utf8').split('\n').map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,'')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()
const lop = (await c.query("select id from lop where ten_lop='11B1'")).rows[0]

// seed bai_test ET + 3 câu (TN key B · ĐS key D/S/D/S · TLN key '5')
const bt = (await c.query("insert into bai_test(lop_id,ngay,loai,mon,so_cau) values($1,'2026-07-11','et','Toán',3) returning id",[lop.id])).rows[0]
await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,loai_cau,noi_dung,lua_chon,dap_an_key,loi_giai,diem) values
  ($1,1,'trac_nghiem','Câu TN', '["A. một","B. hai","C. ba","D. bốn"]'::jsonb, '"B"'::jsonb, 'giải TN', 1)`,[bt.id])
await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,loai_cau,noi_dung,menh_de,dap_an_key,loi_giai,diem) values
  ($1,2,'dung_sai','Câu ĐS', '[{"noi_dung":"mđ1","dap_an":"D","loi_giai":"lg1"},{"noi_dung":"mđ2","dap_an":"S"},{"noi_dung":"mđ3","dap_an":"D"},{"noi_dung":"mđ4","dap_an":"S"}]'::jsonb, '["D","S","D","S"]'::jsonb, null, 1)`,[bt.id])
await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,loai_cau,noi_dung,dap_an_key,loi_giai,diem) values
  ($1,3,'tra_loi_ngan','Câu TLN', '"5"'::jsonb, 'giải TLN', 1)`,[bt.id])
const caus = (await c.query('select id, thu_tu, loai_cau from bai_test_cau where bai_test_id=$1 order by thu_tu',[bt.id])).rows
console.log('seeded ET bai_test', bt.id, '·', caus.length, 'câu')

const sb = createClient(E.VITE_SUPABASE_URL, E.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
await sb.auth.signInWithPassword({ email: 'hs0004@hs.bkdemy.local', password: 'HS0004' })
const { data: hsid } = await sb.rpc('my_hoc_sinh_id')

// 1) et_de — PHẢI ẩn key/lời giải
const { data: de, error: de_err } = await sb.rpc('et_de', { p_bai_test: bt.id })
console.log('\net_de:', de_err ? 'ERR ' + de_err.message : de.length + ' câu')
const leak = JSON.stringify(de).match(/dap_an_key|loi_giai|"dap_an"/)
console.log('  giấu key/lời giải:', leak ? '✗ LỘ ' + leak[0] : '✓ sạch', '· menh_de mẫu:', JSON.stringify(de.find(x=>x.loai_cau==='dung_sai')?.menh_de))

// 2) HS ko được đọc thẳng bai_test_cau của ET (RLS)
const { data: direct } = await sb.from('bai_test_cau').select('id').eq('bai_test_id', bt.id)
console.log('  đọc thẳng bai_test_cau ET:', (direct?.length ?? 0) === 0 ? '✓ bị chặn (0)' : '✗ đọc được ' + direct.length)

// 3) mở bài + lưu đáp án (chưa chấm)
await sb.from('bai_lam').upsert({ bai_test_id: bt.id, hoc_sinh_id: hsid }, { onConflict: 'bai_test_id,hoc_sinh_id', ignoreDuplicates: true })
const { data: bl } = await sb.from('bai_lam').select('id').eq('bai_test_id', bt.id).single()
const ans = { [caus[0].id]: 1, [caus[1].id]: ['D','S','D','D'], [caus[2].id]: '5' } // TN→B đúng · ĐS 3/4 · TLN đúng
for (const [cid, a] of Object.entries(ans)) await sb.from('bai_lam_cau').upsert({ bai_lam_id: bl.id, bai_test_cau_id: cid, dap_an_hs: a }, { onConflict: 'bai_lam_id,bai_test_cau_id' })
console.log('\nđã lưu 3 đáp án (verdict null)')

// 4) et_nop — chấm server-side + reveal
const { data: rev, error: nop_err } = await sb.rpc('et_nop', { p_bai_lam: bl.id })
console.log('et_nop:', nop_err ? 'ERR ' + nop_err.message : 'OK')
if (rev) rev.forEach((r,i)=>console.log('  câu',i+1,'verdict=',r.verdict,'· key=',JSON.stringify(r.dap_an_key),'· lời giải:',r.loi_giai?'có':'—'))

// 5) verify server đã ghi verdict + da_nop
const chk = (await c.query("select trang_thai from bai_lam where id=$1",[bl.id])).rows[0]
const grades = (await c.query("select bc.loai_cau, blc.verdict, blc.diem from bai_lam_cau blc join bai_test_cau bc on bc.id=blc.bai_test_cau_id where blc.bai_lam_id=$1 order by bc.thu_tu",[bl.id])).rows
console.log('\nbai_lam:', chk.trang_thai, '(mong da_nop)')
grades.forEach(g=>console.log('  ',g.loai_cau.padEnd(13),'verdict=',g.verdict,'diem=',g.diem))
const ok = chk.trang_thai==='da_nop' && grades[0].verdict==='correct' && grades[1].verdict==='partial' && Number(grades[1].diem)===0.5 && grades[2].verdict==='correct'
console.log('\n→', ok ? 'TẤT CẢ ĐÚNG ✓' : 'CÓ SAI ✗')
await sb.auth.signOut()
await c.query('delete from bai_test where id=$1',[bt.id])
console.log('dọn xong')
await c.end()
