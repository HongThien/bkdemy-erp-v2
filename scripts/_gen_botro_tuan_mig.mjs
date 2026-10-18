// Phần "create or replace" của migration duyệt 2 vòng / 1 tuần 1 lần: lấy thân từ DB đang chạy rồi vá.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const def = async (n) => (await c.query("select pg_get_functiondef(p.oid) d from pg_proc p where proname=$1 and pronamespace='public'::regnamespace", [n])).rows[0].d.split(String.fromCharCode(13, 10)).join(String.fromCharCode(10))
const sub = (s, a, b, tag) => { if (!s.includes(a)) throw new Error('KHÔNG KHỚP: ' + tag); return s.replace(a, b) }
let out = ''

// 1) Yếu: hoàn tất ca ⇒ case kết thúc, dù chưa hết dạng yếu
let d = await def('fn_btyeu_hoan_tat')
d = sub(d,
  "  if not public._btyeu_retest_bat() and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id)\n     and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) then\n    perform public._btyeu_ket_thuc_case(b.bo_tro_yeu_id, v_ns, 'Hết dạng yếu — TA đóng ca ' || to_char(b.ngay, 'DD/MM'), now());\n  end if;",
  "  -- Thùy 17/10: 1 TUẦN CHỈ BỔ TRỢ 1 LẦN — hoàn tất ca ⇒ case KẾT THÚC, kể cả chưa hết dạng yếu (tuần sau duyệt lại ở thứ 2). Việc khẩn giữa tuần = Bổ trợ Khẩn cấp.\n  perform public._btyeu_ket_thuc_case(b.bo_tro_yeu_id, v_ns, 'Bổ trợ 1 lần/tuần — TA đóng ca ' || to_char(b.ngay, 'DD/MM') || case when exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) then ' (còn dạng chưa dạy, xét lại tuần sau)' else '' end, now());",
  'hoan_tat.yeu')
out += d + ';\n\n'

// 2) Hình: bỏ tuỳ chọn "còn học tiếp" — xong 1 buổi là xong (tham số giữ để app TA bản cũ không lỗi)
d = await def('fn_bthinh_hoan_tat')
d = sub(d, 'if not coalesce(p_con_tiep, false) then', 'if true then -- Thùy 17/10: xong 1 buổi là xong luôn (p_con_tiep còn nhận cho app cũ nhưng bị bỏ qua)', 'hoan_tat.hinh')
out += d + ';\n\n'

// 3) Bộ đếm trần + kiểm trần GỘP Yếu + Hình (trước đây chỉ đếm Yếu)
d = await def('fn_btyeu_suc_chua')
d = sub(d, "select jsonb_build_object('dang', count(*), 'cao', count(*) filter (where uu_tien = 3),\n                            'tran', public._btyeu_tran_dang(), 'tran_cao', public._btyeu_tran_cao())\n  from bo_tro_yeu where trang_thai = 'dang_xu'",
  "select jsonb_build_object('dang', count(*), 'cao', count(*) filter (where uu_tien = 3),\n                            'tran', public._btyeu_tran_dang(), 'tran_cao', public._btyeu_tran_cao())\n  from (select uu_tien from bo_tro_yeu where trang_thai = 'dang_xu' union all select uu_tien from bo_tro_hinh where trang_thai = 'dang_xu') u", 'suc_chua')
out += d + ';\n\n'
d = await def('fn_btyeu_kiem_suc_chua')
d = sub(d, "select count(*), count(*) filter (where uu_tien = 3) into v_dang, v_cao from bo_tro_yeu where trang_thai = 'dang_xu';",
  "select count(*), count(*) filter (where uu_tien = 3) into v_dang, v_cao from (select uu_tien from bo_tro_yeu where trang_thai = 'dang_xu' union all select uu_tien from bo_tro_hinh where trang_thai = 'dang_xu') u;", 'kiem')
out += d + ';\n'

fs.writeFileSync(process.argv[2], out); console.log('ok', out.length)
await c.end()
