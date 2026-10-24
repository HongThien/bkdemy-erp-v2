// Chạy thử mig 202610241400 TRONG ROLLBACK: node scripts/_test_bo_tro_ca_cu_sang_moi.mjs — đếm dòng quy + gọi các hàm ca trước/sau.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
try {
  await q('begin'); await q('set local statement_timeout = 0')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const caMo = (await q(`select id from bo_tro_yeu where trang_thai = 'dang_xu' order by created_at limit 8`)).map((r) => r.id)
  const chiTiet = async () => { const o = []; for (const id of caMo) o.push((await q(`select fn_btyeu_chi_tiet_case($1) x`, [id]))[0].x); return o }
  const truoc = await chiTiet()
  const t = Date.now()
  await q(fs.readFileSync('supabase/migrations/202610241400_bo_tro_ca_cu_sang_ban_do_moi.sql', 'utf8').replace(/on commit drop/g, ''))
  console.log('mig', Date.now() - t, 'ms')
  const dem = (await q(`select count(*)::int tong, count(ma_dang_cu)::int quy, count(*) filter (where ma_dang_cu is null and ma_dang ~ '^T[13]')::int con_cu,
                          count(*) filter (where ma_dang_cu is null and ma_dang !~ '^T[13]' and ma_dang not like 'NDB%')::int khac from bo_tro_yeu_dang`))[0]
  console.log('bo_tro_yeu_dang', dem)
  console.log('tách', (await q(`select count(*)::int n, coalesce(sum(cardinality(tach)),0)::int dong from _tach`))[0]); console.log('bai_test_cau quy', (await q(`select count(*)::int n from bai_test_cau where ma_dang_cu is not null`))[0].n,
    '· mã cũ trong _qd', (await q(`select count(*)::int n from _qd`))[0].n)
  console.log('còn cũ (top):', (await q(`select yd.ma_dang, count(*)::int n, (select count(distinct _do_o_bdm(q.ma_cau, yd.ma_dang)) from dai_cau_hoi q where q.dang_chinh = yd.ma_dang and q.xoa_at is null) so_dich
                                      from bo_tro_yeu_dang yd where yd.ma_dang_cu is null and yd.ma_dang ~ '^T[13]' group by 1 order by 2 desc limit 8`)))
  console.log('còn cũ vì', (await q(`select case when d.id is null then 'ngoai_pham_vi(cap1/hinh/dang_khong_ban_do)' when d.moi is not null then 'dung_dich_trong_ca' when d.tach is not null then 'tach_dung_trong_ca' when d.da_lam is null then 'chua_lam_cau_nao' else 'cau_da_lam_co_cau_chua_quy' end ly_do, count(*)::int n, count(*) filter (where y.trang_thai='dang_xu')::int ca_mo from bo_tro_yeu_dang yd join bo_tro_yeu y on y.id=yd.bo_tro_yeu_id left join _dich d on d.id = yd.id where yd.ma_dang_cu is null and yd.ma_dang not like 'NDB%' group by 1`)))
  kt((await q(`select count(*)::int n from bo_tro_yeu where ban_do = 'cu'`))[0].n === 0, 'mọi ca = moi')
  // lệch: bài làm của ca có mã mà dạng ca không có (trước khi quy cũng có thể lệch — so trước/sau)
  const sau = await chiTiet()
  kt(sau.every((x) => x), `chi tiết ${caMo.length} ca đang mở vẫn chạy`)
  const lech = (await q(`select count(*)::int n from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id and bt.loai in ('bo_tro','bo_tro_test','retest')
                          join buoi_hoc_hs hh on hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id is not null
                          where btc.ma_dang like 'NDB%' and not exists (select 1 from bo_tro_yeu_dang yd where yd.bo_tro_yeu_id = hh.bo_tro_yeu_id and yd.ma_dang = btc.ma_dang)`))[0].n
  kt(lech === 0, `mọi câu bài làm đã quy NDB đều khớp 1 dạng của ca (lệch ${lech})`)
  const s0 = JSON.stringify(truoc[0]), s1 = JSON.stringify(sau[0])
  console.log('ví dụ ca 1 trước:', s0.slice(0, 300), '\n           sau:', s1.slice(0, 300))
  for (const id of caMo.slice(0, 3)) { const n = (await q(`select fn_btyeu_fill_dang_yeu($1) n`, [id]))[0].n; console.log('fill ca', id.slice(0, 8), n) }
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
