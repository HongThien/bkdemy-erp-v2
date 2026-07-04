// THROWAWAY — verify 0070 (TLN cache + review): tln_norm, tln_cache_check, et_nop tầng cache,
// embed query mastery-online + listTLNSai. Seed tạm trên 8B1 rồi dọn sạch.
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const E = { ...envf('.env'), ...envf('.env.local') }
const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()
const ok = (label, cond) => console.log(`${cond ? '✓' : '✗ FAIL'} ${label}`)

// 1) tln_norm
const n1 = (await c.query("select tln_norm(' 0,5 ') a, tln_norm('X = 6') b")).rows[0]
ok(`tln_norm bỏ space+lower: '${n1.a}' / '${n1.b}'`, n1.a === '0,5' && n1.b === 'x=6')

// 2) seed: bai_test ET tạm trên 8B1, 1 câu TLN key '1/2', ma_cau giả ZZTEST01
const lop = (await c.query("select id from lop where ten_lop='8B1' limit 1")).rows[0]
const bt = (await c.query("insert into bai_test(lop_id,ngay,loai,mon,so_cau) values($1,'2026-07-04','et','Toán',1) returning id", [lop.id])).rows[0]
await c.query(`insert into bai_test_cau(bai_test_id,thu_tu,ma_cau,loai_cau,noi_dung,dap_an_key,diem) values($1,1,'ZZTEST01','tra_loi_ngan','Câu test','"1/2"'::jsonb,1)`, [bt.id])
// cache: người đã duyệt chấp nhận '0,5' (JS smartNormalize → '0.5')
await c.query(`insert into question_accepted_answers(ma_cau,answer_normalized,answer_raw,source) values('ZZTEST01','0.5','0,5','manual') on conflict do nothing`)
console.log('seeded bai_test', bt.id)

const sb = createClient(E.VITE_SUPABASE_URL, E.VITE_SUPABASE_KEY, { auth: { persistSession: false } })
const { error: le } = await sb.auth.signInWithPassword({ email: 'hs0009@hs.bkdemy.local', password: 'HS0009' })
if (le) { console.log('LOGIN FAIL', le.message); process.exit(1) }
const { data: hsid } = await sb.rpc('my_hoc_sinh_id')

// 3) tln_cache_check (đường BTVN client): khớp answer_normalized + khớp norm(answer_raw) + miss
const { data: h1 } = await sb.rpc('tln_cache_check', { p_ma_cau: 'ZZTEST01', p_norm: '0.5' })
const { data: h2 } = await sb.rpc('tln_cache_check', { p_ma_cau: 'ZZTEST01', p_norm: '0,5' })
const { data: h3 } = await sb.rpc('tln_cache_check', { p_ma_cau: 'ZZTEST01', p_norm: '9' })
ok('tln_cache_check hit normalized', h1 === true)
ok('tln_cache_check hit raw', h2 === true)
ok('tln_cache_check miss', h3 === false)
const hits = (await c.query("select hit_count from question_accepted_answers where ma_cau='ZZTEST01'")).rows[0]
ok(`hit_count bump (=3): ${hits.hit_count}`, Number(hits.hit_count) === 3)
// HS KHÔNG đọc thẳng được bảng cache
const { data: qaaRows } = await sb.from('question_accepted_answers').select('id').eq('ma_cau', 'ZZTEST01')
ok('HS không SELECT được cache', (qaaRows ?? []).length === 0)

// 4) et_nop tầng cache: HS trả '0,5' (sai theo key '1/2' norm cơ bản) → cache cứu → correct/cache
const { data: de } = await sb.rpc('et_de', { p_bai_test: bt.id })
const cauId = de[0].id
await sb.from('bai_lam').upsert({ bai_test_id: bt.id, hoc_sinh_id: hsid }, { onConflict: 'bai_test_id,hoc_sinh_id', ignoreDuplicates: true })
const { data: bl } = await sb.from('bai_lam').select('id').eq('bai_test_id', bt.id).eq('hoc_sinh_id', hsid).single()
await sb.from('bai_lam_cau').upsert({ bai_lam_id: bl.id, bai_test_cau_id: cauId, dap_an_hs: '0,5' }, { onConflict: 'bai_lam_id,bai_test_cau_id' })
const { data: reveal, error: ne } = await sb.rpc('et_nop', { p_bai_lam: bl.id })
if (ne) console.log('et_nop ERR', ne.message)
ok(`et_nop verdict=${reveal?.[0]?.verdict}`, reveal?.[0]?.verdict === 'correct')
const blc = (await c.query('select verdict, cham_boi, diem from bai_lam_cau where bai_lam_id=$1', [bl.id])).rows[0]
ok(`bai_lam_cau cham_boi=cache diem=1: ${blc.verdict}/${blc.cham_boi}/${blc.diem}`, blc.verdict === 'correct' && blc.cham_boi === 'cache' && Number(blc.diem) === 1)

// 5) embed query mastery-online (fetchOnlineEvals shape) — chạy dưới HS (đọc dòng của mình)
const { data: onl, error: oe } = await sb.from('bai_lam_cau')
  .select('verdict, cham_at, lam:bai_lam_id!inner(hoc_sinh_id, trang_thai, test:bai_test_id(loai, mon)), cau:bai_test_cau_id(ma_dang)')
  .not('verdict', 'is', null).eq('lam.hoc_sinh_id', hsid)
ok(`embed online-evals chạy (${onl?.length ?? 0} dòng)${oe ? ' ERR ' + oe.message : ''}`, !oe && (onl ?? []).some((r) => r.lam?.test?.loai === 'et' && r.verdict === 'correct'))

// 6) embed listTLNSai shape (validate quan hệ, dữ liệu wrong có thể 0 dòng — chỉ cần KHÔNG lỗi)
const { error: te } = await sb.from('bai_lam_cau')
  .select('id, dap_an_hs, cham_at, cau:bai_test_cau_id!inner(id, ma_cau, noi_dung, dap_an_key, loi_giai, loai_cau, test:bai_test_id(loai, ngay, lop:lop_id(ten_lop))), lam:bai_lam_id(hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs))')
  .eq('verdict', 'wrong').eq('cau.loai_cau', 'tra_loi_ngan').limit(5)
ok(`embed listTLNSai chạy${te ? ' ERR ' + te.message : ''}`, !te)

await sb.auth.signOut()
// dọn
await c.query('delete from bai_test where id=$1', [bt.id])
await c.query("delete from question_accepted_answers where ma_cau='ZZTEST01'")
console.log('đã dọn seed tạm')
await c.end()
