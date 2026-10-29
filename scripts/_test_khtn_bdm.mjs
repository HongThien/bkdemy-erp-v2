// Test hàm bản đồ mới KHTN (mig 202610291712) trong 1 transaction rồi ROLLBACK.  node scripts/_test_khtn_bdm.mjs [--da-ap]
import pg from 'pg'; import fs from 'node:fs'
const url = fs.readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url}); await c.connect()
const q = async (s,a)=>(await c.query(s,a)).rows
let ok = 0, fail = 0
const kiem = (t, d, x = '') => { if (d) { ok++; console.log('  ✔', t) } else { fail++; console.log('  ✘', t, x) } }
const loiKhi = async (s, a) => { await c.query('savepoint s'); try { await c.query(s, a); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
try {
  await q('begin')
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync('supabase/migrations/202610291712_khtn_ban_do_moi_ham.sql','utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const t0 = Date.now(); const [{ cay }] = await q(`select fn_khtn_bdm_cay('7') cay`); const ms = Date.now() - t0
  const nhoms = cay.chu_de.flatMap((cd) => cd.o.flatMap((o) => o.nhom))
  const dbs = nhoms.flatMap((n) => n.dang_bai)
  kiem(`cây K7: ${cay.chu_de.length} chủ đề · ${nhoms.length} nhóm · ${dbs.length} dạng bài (${ms} ms)`, cay.chu_de.length === 7 && nhoms.length === 67 && dbs.length === 117)
  const soCau = dbs.reduce((s, d) => s + d.so_cau, 0), chua = nhoms.reduce((s, n) => s + n.chua_gan, 0)
  console.log('   câu gán', soCau, '· chưa phân', chua, '· tổng', cay.tong)
  kiem('tổng câu = gán + chưa phân + chưa khớp', soCau + chua + cay.tong.cau_chua_khop === cay.tong.cau, JSON.stringify(cay.tong))
  const n = nhoms.find((x) => x.chua_gan > 0 && x.dang_bai.length > 0)
  const [{ cg }] = await q(`select fn_khtn_bdm_cau_chua_gan($1, null, null) cg`, [n.id])
  kiem(`chưa phân của nhóm «${n.ten}»: ${cg.tong_cau} câu (= số trên cây)`, cg.tong_cau === n.chua_gan)
  const m = cg.cau[0].ma_cau, d = n.dang_bai[0].id
  const [{ v }] = await q(`select fn_khtn_bdm_gan_cau($1, $2) v`, [[m], d])
  kiem(`gán ${m} → ${d}: ${v} dòng`, v >= 1)
  const kc = await q(`select * from fn_khtn_bdm_kho_cau('dang_bai', $1)`, [d])
  kiem('kho câu dạng bài có câu vừa gán', kc.some((r) => r.ma_cau === m && r.nguon_gan === 'gan_cau:nguoi'))
  const [{ cay: c2 }] = await q(`select fn_khtn_bdm_cay('7') cay`)
  const n2 = c2.chu_de.flatMap((x) => x.o.flatMap((o) => o.nhom)).find((x) => x.id === n.id)
  kiem('cây: chưa phân của nhóm giảm đúng', n2.chua_gan === n.chua_gan - v)
  let e = await loiKhi(`select fn_khtn_bdm_xoa_nhom($1)`, [n.id])
  kiem('xoá nhóm có câu đã gán bị chặn', e && e.includes('đã được gán'), e)
  const nhomKhac = c2.chu_de.find((x) => x.o.length).o[0].nhom
  if (nhomKhac.length > 1) {
    await q(`select fn_khtn_bdm_sap_xep('nhom', $1)`, [[...nhomKhac].reverse().map((x) => x.id)])
    const [{ c3 }] = await q(`select fn_khtn_bdm_cay('7') c3`)
    kiem('sắp xếp nhóm đổi thứ tự', c3.chu_de.find((x) => x.o.length).o[0].nhom[0].id === nhomKhac[nhomKhac.length - 1].id)
  }
  const [k9] = await q(`select d.id from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '9' limit 1`)
  e = await loiKhi(`select fn_khtn_bdm_gan_cau($1, $2)`, [[cg.cau[1]?.ma_cau ?? m], k9.id])
  kiem('gán câu K7 vào dạng bài K9 bị chặn', e && e.includes('khối'), e)
  const [{ lg }] = await q(`select count(*)::int lg from khtn_bdm_log where bang = 'khtn_bdm_gan_cau' and at > now() - interval '1 minute'`)
  kiem('gán câu có ghi lịch sử', lg >= 1)
  const anon = await q(`select count(*)::int n from pg_proc p where p.proname ~ '^fn_khtn_bdm_' and has_function_privilege('anon', p.oid, 'execute')`)
  kiem('anon không gọi được hàm fn_khtn_bdm_*', anon[0].n === 0)
} catch (e) { fail++; console.log('✘ LỖI', e.message) } finally { await q('rollback'); await c.end(); console.log(`\n${ok} đạt · ${fail} hỏng — ROLLBACK`); process.exit(fail ? 1 : 0) }
