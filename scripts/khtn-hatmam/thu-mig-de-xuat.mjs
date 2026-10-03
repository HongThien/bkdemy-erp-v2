// Chạy thử mig khtn_de_xuat_dang_cum trong transaction rồi ROLLBACK: trọn vòng dạng chờ → đề xuất → nhân sự Nhận / Gộp / Trả lời.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p = []) => { await c.query('savepoint s'); try { const r = (await c.query(s, p)).rows; await c.query('release savepoint s'); return r } catch (e) { await c.query('rollback to savepoint s'); return 'LỖI: ' + e.message } }
const file = fs.readdirSync('supabase/migrations').find((f) => f.includes('khtn_de_xuat_dang_cum'))
await c.query('begin')
try {
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('áp thử', file, 'OK')
  console.log('sinh mã K070203 →', await q(`select fn_khtn_sinh_ma_dang('K070203') m`), '· sai mã →', await q(`select fn_khtn_sinh_ma_dang('K070000') m`))
  // nhân sự có quyền ghi bdkt (admin)
  const ds = await q(`select tk.id uid, ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id order by (ns.ho_ten ilike '%thùy%') desc, ns.ho_ten limit 20`)
  let ns = null
  for (const x of ds) { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: x.uid })]); if ((await q(`select co_quyen_ghi('bdkt') q`))[0].q) { ns = x; break } }
  if (!ns) throw new Error('không tìm được nhân sự có quyền ghi bdkt trong 20 tài khoản đầu')
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: ns.uid })])
  console.log('nhân sự thử:', ns.ho_ten, '· quyền ghi bdkt:', await q(`select co_quyen_ghi('bdkt') q`))
  // 3 câu thử ở dạng chờ khối 7
  for (const i of [1, 2, 3]) await q(`insert into khtn_cau_hoi (ma_cau, dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, nguon, da_duyet)
     values ('KTHU00' || $1, 'K07000000', 'trac_nghiem', 'Câu thử ' || $1, '["a","b","c","d"]', 'A', 'thu', false)`, [i])
  const [{ id: dxMoi }] = await q(`insert into khtn_de_xuat (loai, khoi, ma_chuyen_de, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
     values ('dang_moi', '7', 'K070203', 'Tính % khối lượng nguyên tố', 'Cho CTHH, tính %', 'K07020303', 'ERP chỉ có chiều ngược', 'thu', 'ai') returning id`)
  await q(`insert into khtn_de_xuat_cau values ($1, 'KTHU001'), ($1, 'KTHU002')`, [dxMoi])
  const [{ id: dxTd }] = await q(`insert into khtn_de_xuat (loai, khoi, ma_chuyen_de, ly_do, lo, nguon) values ('trao_doi', '7', 'K070202', 'Câu này thuộc liên kết ion hay cộng hoá trị?', 'thu', 'ai') returning id`)
  await q(`insert into khtn_de_xuat_cau values ($1, 'KTHU003')`, [dxTd])
  console.log('\nds chờ:', (await q(`select loai, ma_chuyen_de, ten_chuyen_de, jsonb_array_length(cau) n from fn_khtn_de_xuat_ds('7')`)))
  console.log('Nhận dạng mới →', await q(`select fn_khtn_de_xuat_quyet($1, 'nhan') r`, [dxMoi]))
  console.log('  bản đồ:', await q(`select ma_dang, ten_dang, muc_do from khtn_ban_do where ma_dang = 'K07020304'`), '· câu:', await q(`select ma_cau, dang_chinh from khtn_cau_hoi where ma_cau in ('KTHU001','KTHU002')`))
  console.log('Trả lời + dời về K07020203 →', await q(`select fn_khtn_de_xuat_quyet($1, 'tra_loi', null, null, 'K07020203', 'Liên kết ion') r`, [dxTd]))
  console.log('  câu:', await q(`select ma_cau, dang_chinh from khtn_cau_hoi where ma_cau = 'KTHU003'`))
  console.log('thống kê:', await q(`select * from fn_khtn_de_xuat_tk('7')`))
  console.log('quyết lần 2 (phải lỗi):', await q(`select fn_khtn_de_xuat_quyet($1, 'nhan') r`, [dxMoi]))
} finally { await c.query('rollback'); await c.end() }
