// Kiểm mig 202610221458 (kho trên lớp Đại) TRONG ROLLBACK: node scripts/_test_dai_kho_lop.mjs [--mig]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t, ct = '') => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t, ct) }
const loiKhi = async (s, a) => { await q('savepoint s'); try { await q(s, a); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
try {
  await q('begin')
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610221458_dai_kho_tren_lop.sql', 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  // một dạng bài K7 có câu kho luyện đã gán
  const [g] = await q(`select g.dang_bai_id, array_agg(g.ma_cau order by g.ma_cau) mas from dai_bdm_gan_cau g join dai_cau_hoi c on c.ma_cau = g.ma_cau and c.xoa_at is null
                         join dai_bdm_dang_bai d on d.id = g.dang_bai_id join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                        where cd.khoi = '7' group by 1 having count(*) >= 2 limit 1`)
  const DB = g.dang_bai_id
  const [a] = await q(`select * from fn_dai_lop_them($1, 'giang', $2::jsonb)`, [DB, JSON.stringify({ noi_dung: 'Bài giảng 1: $x+1=2$', loi_giai: 'x=1', ghi_chu: 'mở đầu' })])
  const [b] = await q(`select * from fn_dai_lop_them($1, 'giang', $2::jsonb)`, [DB, JSON.stringify({ noi_dung: 'Bài giảng 2', loai_cau: 'trac_nghiem', lua_chon: ['1', '2', '3', '4'], dap_an: 'B' })])
  kt(/^LOP\d{6}$/.test(a.ma_cau) && a.thu_tu === 0 && b.thu_tu === 1, `thêm: mã ${a.ma_cau}, thứ tự 0 → 1`)
  kt(Array.isArray(b.lua_chon) && b.lua_chon.length === 4, 'lựa chọn TN lưu jsonb')
  const ch = await q(`select * from fn_dai_lop_chep_tu_kho($1, 'luyen', $2)`, [DB, g.mas.slice(0, 2)])
  kt(ch.length === 2 && ch.every((x) => x.vai === 'luyen' && x.nguon_ma_cau) && ch[0].thu_tu === 0 && ch[1].thu_tu === 1, 'chép 2 câu kho luyện ⇒ 2 câu mới vai luyện, nhớ nguồn')
  await q(`select fn_dai_lop_xep($1, 'giang', $2)`, [DB, [b.ma_cau, a.ma_cau, ch[0].ma_cau]])
  const ds = await q(`select ma_cau, vai, thu_tu from fn_dai_lop_cua_dang($1)`, [DB])
  kt(ds.filter((x) => x.vai === 'giang').map((x) => x.ma_cau).join() === [b.ma_cau, a.ma_cau, ch[0].ma_cau].join(), 'xếp lại + đổi vai câu chép sang giảng')
  const [dem] = await q(`select * from fn_dai_lop_dem('7') where dang_bai_id = $1`, [DB])
  kt(dem?.so_giang === 3 && dem?.so_luyen === 1, `đếm theo dạng: ${dem?.so_giang} giảng · ${dem?.so_luyen} luyện`)
  kt(!!(await loiKhi(`update dai_cau_lop set ma_cau = 'LOPXXX' where ma_cau = $1`, [a.ma_cau])), 'mã gốc không đổi được')
  await q(`update dai_cau_lop set xoa_at = now() where ma_cau = $1`, [a.ma_cau])
  kt((await q(`select * from fn_dai_lop_cua_dang($1)`, [DB])).length === 3, 'kho rác: câu xoá không hiện')
  kt(!!(await loiKhi(`select fn_dai_lop_xep($1, 'giang', $2)`, [DB, ['T000']])), 'xếp với câu lạ ⇒ chặn')
  kt(!!(await loiKhi(`select fn_dai_lop_them($1, 'giang', '{"noi_dung":"  "}'::jsonb)`, [DB])), 'đề trống ⇒ chặn')
  kt(!!(await loiKhi(`delete from dai_bdm_dang_bai where id = $1`, [DB])), 'xoá dạng bài còn câu kho trên lớp ⇒ DB chặn')
  const anon = await q(`select has_function_privilege('anon', 'fn_dai_lop_them(text,text,jsonb)', 'execute') x`)
  kt(!anon[0].x, 'anon không gọi được hàm ghi')
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
