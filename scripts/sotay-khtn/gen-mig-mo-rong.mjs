// Sinh phần "sửa hàm có sẵn" của mig sotay_muc_mo_rong từ thân ĐANG CHẠY (pg_get_functiondef). Mỗi chỗ thay khớp ĐÚNG 1 lần.
// Chạy: node scripts/sotay-khtn/gen-mig-mo-rong.mjs <file ra>
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
const lay = async (sig) => (await c.query(`select pg_get_functiondef($1::regprocedure) d`, [sig])).rows[0].d
const thay = (ten, d, cu, moi) => {
  const n = d.split(cu).length - 1
  if (n !== 1) throw new Error(`${ten}: "${cu.slice(0, 60)}…" khớp ${n} lần`)
  return d.replace(cu, moi)
}
let out = ''
// (a) trigger: sửa NỘI DUNG mới (loại, công thức, ý, bảng, ví dụ, hay nhầm, liên quan) cũng là sửa nội dung ⇒ thẻ đã duyệt về chờ duyệt
{
  let d = await lay('public._sotay_ct_truoc_ghi()')
  d = thay('_sotay_ct_truoc_ghi', d,
    'v_doi := (new.ten, new.ten_khac, new.noi_dung, new.luu_y, new.cau_nho, new.hinh, new.chu_de, new.ct2018)\n           is distinct from (old.ten, old.ten_khac, old.noi_dung, old.luu_y, old.cau_nho, old.hinh, old.chu_de, old.ct2018);',
    'v_doi := (new.ten, new.ten_khac, new.noi_dung, new.luu_y, new.cau_nho, new.hinh, new.chu_de, new.ct2018,\n            new.loai, new.cong_thuc, new.y, new.bang, new.bien, new.vd, new.nham, new.lq) -- mig sotay_muc_mo_rong: thêm cột nội dung mới\n           is distinct from (old.ten, old.ten_khac, old.noi_dung, old.luu_y, old.cau_nho, old.hinh, old.chu_de, old.ct2018,\n            old.loai, old.cong_thuc, old.y, old.bang, old.bien, old.vd, old.nham, old.lq);')
  out += `-- _sotay_ct_truoc_ghi — thân từ bản đang chạy, chỉ nới bộ cột "nội dung"\n${d.trimEnd()};\n\n`
}
// (b) hs_sotay_tim_ct: trả ĐỦ nội dung mục (1 nguồn: _sotay_muc_json) thay vì 9 trường của thẻ công thức
{
  let d = await lay('public.hs_sotay_tim_ct(text, text, text, integer)')
  const m = d.match(/jsonb_agg\(jsonb_build_object\([\s\S]*?\) order by diem desc/)
  if (!m) throw new Error('hs_sotay_tim_ct: không thấy khối jsonb_build_object')
  d = thay('hs_sotay_tim_ct', d, m[0], 'jsonb_agg(public._sotay_muc_json(ma) order by diem desc')
  out += `-- hs_sotay_tim_ct — thân từ bản đang chạy, mỗi kết quả = _sotay_muc_json (đủ nội dung để mở luôn)\n${d.trimEnd()};\n\n`
}
fs.writeFileSync(process.argv[2], out)
console.log('ok', out.length)
await c.end()
