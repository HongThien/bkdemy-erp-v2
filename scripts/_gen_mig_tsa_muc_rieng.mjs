// Sinh phần (5) của mig 202610030228 từ thân hàm ĐANG CHẠY (pg_get_functiondef): thay đúng đoạn "tìm lớp em đang học của môn"
// bằng `_hs_lop_tu_luyen(v_hs, p_mon)` — mỗi hàm phải khớp ĐÚNG 1 mẫu, ĐÚNG 1 lần; lệch thì dừng.
// Chạy: node scripts/_gen_mig_tsa_muc_rieng.mjs <file ra>
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
const THAY = [
  // tu_luyen_sinh + 3 bản tu_luyen_chu_de_sinh
  [/  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l\.id = hl\.lop_id\r?\n    where hl\.hoc_sinh_id = v_hs and hl\.trang_thai = 'dang_hoc' and l\.mon = p_mon\r?\n    order by hl\.ngay_vao desc limit 1;/,
    `  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)`],
  // tu_luyen_dien_sinh (where + order cùng 1 dòng)
  [/  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l\.id = hl\.lop_id\r?\n    where hl\.hoc_sinh_id = v_hs and hl\.trang_thai = 'dang_hoc' and l\.mon = p_mon order by hl\.ngay_vao desc limit 1;/,
    `  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228`],
  // tu_luyen_chu_de_ds_dang — lấy khối
  [/  select l\.khoi into v_khoi from hoc_sinh_lop hl join lop l on l\.id = hl\.lop_id\r?\n    where hl\.hoc_sinh_id = v_hs and hl\.trang_thai = 'dang_hoc' and l\.mon = p_mon\r?\n    order by hl\.ngay_vao desc limit 1;/,
    `  select l.khoi into v_khoi from lop l where l.id = public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228`],
]
let out = ''
for (const ten of ['tu_luyen_sinh', 'tu_luyen_chu_de_sinh', 'tu_luyen_dien_sinh', 'tu_luyen_chu_de_ds_dang']) {
  const rows = (await c.query(`select pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) a from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname=$1 order by 2`, [ten])).rows
  for (const { d, a } of rows) {
    const khop = THAY.filter(([re]) => re.test(d))
    if (khop.length !== 1) throw new Error(`${ten}(${a}): khớp ${khop.length} mẫu, cần đúng 1`)
    const [re, moi] = khop[0]
    if ((d.match(new RegExp(re.source, 'g')) ?? []).length !== 1) throw new Error(`${ten}(${a}): mẫu xuất hiện ≠ 1 lần`)
    out += `-- ${ten}(${a}) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp\n` + d.replace(re, moi).trimEnd() + ';\n\n'
  }
}
fs.writeFileSync(process.argv[2], out)
console.log('ok', out.length)
await c.end()
