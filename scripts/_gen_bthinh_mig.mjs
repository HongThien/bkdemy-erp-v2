// Sinh phần "create or replace" của migration bo_tro_hinh_loi từ BẢN ĐANG CHẠY (không chép file migration cũ).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const def = async (n) => (await c.query("select pg_get_functiondef(p.oid) d from pg_proc p where proname=$1 and pronamespace='public'::regnamespace", [n])).rows[0].d
const sub = (s, a, b, tag) => { if (!s.includes(a)) throw new Error('KHÔNG KHỚP: ' + tag); return s.replace(a, b) }
let out = ''

// 1) xếp ca
let xep = await def('fn_ca_bo_tro_xep')
xep = sub(xep, "if p_loai not in ('duoi', 'bu', 'yeu') then raise exception 'Loại phải là duoi | bu | yeu.'", "if p_loai not in ('duoi', 'bu', 'yeu', 'hinh') then raise exception 'Loại phải là duoi | bu | yeu | hinh.'", 'xep.loai')
xep = sub(xep,
  "  else\n    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;\n    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;\n  end if;",
  "  elsif p_loai = 'yeu' then\n    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;\n    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;\n  else\n    if not exists (select 1 from bo_tro_hinh where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case Hình không hợp lệ.'; end if;\n    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;\n  end if;",
  'xep.nhanh')
xep = sub(xep, "case when p_loai <> 'yeu' and v_ta", "case when p_loai not in ('yeu', 'hinh') and v_ta", 'xep.nguoi')
xep = sub(xep, "when 'bu' then 'bu' else 'bo_tro_yeu' end", "when 'bu' then 'bu' when 'hinh' then 'bo_tro_hinh' else 'bo_tro_yeu' end", 'xep.loai_buoi')
xep = sub(xep, 'bu_cho_buoi_id, bo_tro_yeu_id, don_vi,', 'bu_cho_buoi_id, bo_tro_yeu_id, bo_tro_hinh_id, don_vi,', 'xep.cot')
xep = sub(xep, "case when p_loai = 'yeu' then p_ref end, v_dv", "case when p_loai = 'yeu' then p_ref end, case when p_loai = 'hinh' then p_ref end, v_dv", 'xep.val')
out += xep + ';\n\n'

// 2) đơn vị
let dv = await def('_ca_bo_tro_don_vi')
dv = sub(dv, "when p_loai in ('duoi', 'bu') then 4", "when p_loai in ('duoi', 'bu') then 4\n              when p_loai = 'hinh' then (case when coalesce((select h.muc from bo_tro_hinh h where h.hoc_sinh_id = p_hs and h.trang_thai = 'dang_xu' order by h.created_at desc limit 1), 1) <= 1 then 1 else 4 end)", 'dv')
out += dv + ';\n\n'

// 3) lịch phòng ngày
let ng = await def('fn_ca_bo_tro_ngay')
ng = sub(ng, "when 'bu' then 'bu' else 'yeu' end,\n             'hoc_sinh_id'", "when 'bu' then 'bu' when 'bo_tro_hinh' then 'hinh' else 'yeu' end,\n             'hoc_sinh_id'", 'ngay.loai')
ng = sub(ng, "               else 'yếu L' ||",
  "               when 'bo_tro_hinh' then 'Hình L' || coalesce((select h.muc from bo_tro_hinh h where h.id = hh.bo_tro_hinh_id), 1)\n                                       || ' · ưu tiên ' || case coalesce((select h.uu_tien from bo_tro_hinh h where h.id = hh.bo_tro_hinh_id), 2) when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end\n                                       || ' · buổi ' || (select count(*) + 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = hh.bo_tro_hinh_id and bb.id <> b.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat')\n               else 'yếu L' ||",
  'ngay.ct')
out += ng + ';\n\n'

// 4) ứng viên
let uv = await def('fn_ca_bo_tro_ung_vien')
uv = sub(uv, "  )\n  select jsonb_build_object(\n    'ca',",
  "  ),\n  hinh as (\n    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at, y.muc, y.ly_do,\n           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,\n           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id\n    from bo_tro_hinh y join hoc_sinh hs on hs.id = y.hoc_sinh_id\n    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)\n      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = y.id and bb.loai = 'bo_tro_hinh' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)\n  )\n  select jsonb_build_object(\n    'ca',",
  'uv.cte')
uv = sub(uv, 'from yeu)\n  ) into v_out;',
  "from yeu),\n    'hinh', (select coalesce(jsonb_agg(jsonb_build_object(\n        'loai', 'hinh', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when muc <= 1 then 1 else 4 end,\n        'chi_tiet', 'Hình L' || muc || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · mở ' || to_char(created_at, 'DD/MM') || coalesce(' · ' || left(ly_do, 60), ''),\n        'uu_tien', uu_tien, 'level', muc,\n        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),\n        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),\n        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),\n        'trong_so', public._bt_trong_so_lop(lop_id),\n        'vua', v_con >= (case when muc <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),\n        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when muc <= 1 then 1 else 4 end) then 'cần ' || (case when muc <= 1 then 1 else 4 end) || ' · còn ' || v_con end\n      ) order by uu_tien desc, created_at), '[]'::jsonb) from hinh)\n  ) into v_out;",
  'uv.out')
out += uv + ';\n\n'

// 5) trigger buổi
let g = await def('_trg_buoi_bo_tro_gan_ca'); g = sub(g, "('bu', 'bo_tro_yeu', 'bo_tro_duoi')", "('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh')", 'gan'); out += g + ';\n\n'
let k = await def('_trg_buoi_bo_tro_khoa_ngay'); k = sub(k, "('bo_tro_yeu', 'bu', 'bo_tro_duoi')", "('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')", 'khoa'); out += k + ';\n\n'

// 6) trần dùng chung: bản của Yếu cộng thêm Hình
let t = await def('_trg_btyeu_suc_chua')
t = sub(t, "select count(*) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and id <> new.id;", "select count(*) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu') into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and id <> new.id;", 'tran1')
t = sub(t, "select count(*) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3 and id <> new.id;", "select count(*) + (select count(*) from bo_tro_hinh where trang_thai = 'dang_xu' and uu_tien = 3) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3 and id <> new.id;", 'tran2')
t = sub(t, 'em đang bổ trợ yếu —', 'em đang bổ trợ (yếu + Hình) —', 'tran3')
out += t + ';\n\n'

fs.writeFileSync(process.argv[2], out); console.log('ok', out.length)
await c.end()
