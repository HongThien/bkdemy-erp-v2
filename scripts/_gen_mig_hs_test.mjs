// Sinh phần "chặn em test" của mig hs_test từ thân hàm ĐANG CHẠY (pg_get_functiondef). Mỗi chỗ thay phải khớp ĐÚNG 1 lần; lệch thì dừng.
// Chạy: node scripts/_gen_mig_hs_test.mjs <file ra>
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
const HIEN = (x) => `public._hs_hien(${x})`
const SUA = {
  // Rank mùa + đua tháng: danh sách em của khối (lấy từ lớp cùng môn + khối, không xét trạng thái lớp ⇒ em ở lớp test lọt vào)
  fn_rank_mua: [["where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_khoi is null or l.khoi = p_khoi)",
    `where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_khoi is null or l.khoi = p_khoi) and ${HIEN('hl.hoc_sinh_id')}`]],
  fn_rank_dua_thang: [["where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi",
    `where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi and ${HIEN('hl.hoc_sinh_id')}`]],
  // Album huy hiệu: "N bạn cùng khối đạt"
  fn_hs_album: [["where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_khoi",
    `where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_khoi and ${HIEN('hl.hoc_sinh_id')}`]],
  // Việc trao huy hiệu bản cứng (màn nhân sự) — nhân sự không thấy em test
  fn_huy_hieu_viec_trao: [["join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc'",
    `join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and ${HIEN('d.hoc_sinh_id')}`]],
  // Gợi ý kết bạn
  fn_ban_be_goi_y: [["where h.id <> v_me and not (h.id = any(v_ban))",
    `where h.id <> v_me and not (h.id = any(v_ban)) and ${HIEN('h.id')}`]],
  // BXH tự luyện (2 bản) + BXH tỉ lệ đạt: đang lọc h.trang_thai = 'dang_hoc' ⇒ em test xem thì thấy cả em test, em thật không thấy
  hs_xep_hang_tu_luyen: [["h.trang_thai = 'dang_hoc'", `h.trang_thai in ('dang_hoc', 'test') and ${HIEN('h.id')}`]],
  fn_hs_xep_hang_ti_le_dat: [["h.trang_thai = 'dang_hoc'", `h.trang_thai in ('dang_hoc', 'test') and ${HIEN('h.id')}`]],
}
let out = ''
for (const [ten, cap] of Object.entries(SUA)) {
  const rows = (await c.query(`select pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) a from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname=$1 order by 2`, [ten])).rows
  if (!rows.length) throw new Error(`không thấy hàm ${ten}`)
  for (const { d, a } of rows) {
    let moi = d
    for (const [cu, thay] of cap) {
      const n = moi.split(cu).length - 1
      if (n !== 1) throw new Error(`${ten}(${a}): "${cu.slice(0, 50)}…" khớp ${n} lần, cần đúng 1`)
      moi = moi.replace(cu, thay)
    }
    out += `-- ${ten}(${a}) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien\n${moi.trimEnd()};\n\n`
  }
}
// Thế giới BK: MỌI tin sinh từ 1 hàm UNION lớn ⇒ bọc cả khối, lọc theo người được nhắc tới (không sửa từng nhánh)
{
  const [{ d }] = (await c.query(`select pg_get_functiondef('public._the_gioi_tin(timestamptz)'::regprocedure) d`)).rows
  const m = d.match(/^([\s\S]*?AS \$function\$\r?\n)([\s\S]*?)(\r?\n\$function\$\s*)$/)
  if (!m) throw new Error('_the_gioi_tin: không tách được thân')
  const cot = 'khoa, tang, nhom, kieu, hoc_sinh_id, thanh_vien, lop_id, mon, at, chi_tiet'
  const than = `  select * from (\n${m[2].replace(/;\s*$/, '')}\n  ) t(${cot})\n  where ${HIEN('t.hoc_sinh_id')} -- mig hs_test: tin của em test chỉ em test thấy`
  out += `-- _the_gioi_tin — thân từ bản đang chạy, bọc 1 lớp lọc em test\n${m[1]}${than}${m[3].trimEnd()};\n\n`
}
fs.writeFileSync(process.argv[2], out)
console.log('ok', out.length)
await c.end()
