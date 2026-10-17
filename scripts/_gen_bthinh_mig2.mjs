// Sinh migration phần 2 của bổ trợ Hình: vá các hàm "biết 3 loại" cho biết thêm Hình. Thân lấy từ DB đang chạy.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const def = async (n) => (await c.query("select pg_get_functiondef(p.oid) d from pg_proc p where proname=$1 and pronamespace='public'::regnamespace", [n])).rows[0].d
const sub = (s, a, b, tag) => { if (!s.includes(a)) throw new Error('KHÔNG KHỚP: ' + tag); return s.replace(a, b) }
let out = '-- Bổ trợ Hình phần 2 (17/10): các hàm đang chỉ biết Yếu/Bù/Đuổi học thêm loại Hình. Thân lấy từ DB đang chạy (scripts/_gen_bthinh_mig2.mjs).\n-- Công/lương: buổi Hình tính y hệt buổi Yếu (loại việc `bo_tro_yeu`, cùng đơn giá/quy tắc) — Thùy chưa nói khác.\n\n'

// 1) dọn ca không diễn ra
let d = await def('fn_btyeu_don_ca_khong_dien_ra')
d = sub(d, "hh.diem_danh is distinct from 'co_mat'\n  ),", "hh.diem_danh is distinct from 'co_mat'\n    union all\n    select b.id, b.ngay, hh.hoc_sinh_id\n    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_hinh_id is not null\n    where b.loai = 'bo_tro_hinh' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null\n      and b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date and hh.diem_danh is distinct from 'co_mat'\n  ),", 'don')
out += d + ';\n\n'

// 2) dashboard tuần
d = await def('fn_bo_tro_dashboard_tuan')
d = sub(d, "order by hl.ngay_vao desc limit 1)) as lop,", "order by hl.ngay_vao desc limit 1),\n             (select l.ten_lop from bo_tro_hinh yh join hoc_sinh_lop hl on hl.hoc_sinh_id = yh.hoc_sinh_id and hl.trang_thai = 'dang_hoc'\n                join lop l on l.id = hl.lop_id and l.mon = yh.mon where yh.id = hh.bo_tro_hinh_id order by hl.ngay_vao desc limit 1)) as lop,", 'dash.lop')
d = sub(d, "b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')", "b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')", 'dash.loai')
d = sub(d, "('bo_tro_duoi')) k(loai)", "('bo_tro_duoi'), ('bo_tro_hinh')) k(loai)", 'dash.k')
out += d + ';\n\n'

// 3) lịch app HS
d = await def('fn_hs_lich_bo_tro')
d = sub(d, "case b.loai when 'bo_tro_yeu' then y.mon else l.mon end", "case b.loai when 'bo_tro_yeu' then y.mon when 'bo_tro_hinh' then yh.mon else l.mon end", 'lich.mon')
d = sub(d, "  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id\n", "  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id\n  left join bo_tro_hinh yh on yh.id = hh.bo_tro_hinh_id\n", 'lich.join')
d = sub(d, "and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')\n    and b.trang_thai = 'mo'", "and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh')\n    and b.trang_thai = 'mo'", 'lich.loai')
out += d + ';\n\n'

// 4) tự kiểm hiển thị
d = await def('fn_bo_tro_tu_kiem')
d = sub(d, "where b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi') and b.trang_thai = 'mo'", "where b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai = 'mo'", 'tk.loai')
d = sub(d, "when 'bu' then public.fn_bu_ca_cua_toi() else", "when 'bo_tro_hinh' then public.fn_bthinh_viec_cua_toi()->'ca'\n                             when 'bu' then public.fn_bu_ca_cua_toi() else", 'tk.case')
out += d + ';\n\n'

// 5) công TA: lớp của buổi · thiếu công · hôm nay · đối chiếu
d = await def('_ta_lop_cua_buoi')
d = sub(d, "select coalesce(d.lop_id, y.lop_id, me.lop_id) as lop_id", "select coalesce(d.lop_id, y.lop_id, h.lop_id, me.lop_id,\n                        (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hh.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = h.mon limit 1)) as lop_id", 'lop.sel')
d = sub(d, "        left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id\n", "        left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id\n        left join bo_tro_hinh h on h.id = hh.bo_tro_hinh_id\n", 'lop.join')
out += d + ';\n\n'

d = await def('_ta_buoi_thieu_cong')
d = sub(d, "select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end,", "select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' else 'bo_tro_duoi' end,", 'tc.code')
d = sub(d, "(case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' else 'Bổ trợ đuổi' end)", "(case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' when 'bo_tro_hinh' then 'Bổ trợ Hình' else 'Bổ trợ đuổi' end)", 'tc.ten')
d = sub(d, "where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den", "where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den", 'tc.where')
out += d + ';\n\n'

d = await def('fn_ta_hom_nay')
d = sub(d, "case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end", "case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' else 'bo_tro_duoi' end", 'hn.code')
d = sub(d, "b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and v_ns in", "b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh') and b.trang_thai <> 'huy' and v_ns in", 'hn.where')
out += d + ';\n\n'

d = await def('_ta_doi_chieu')
d = sub(d, "and b.loai = case cv.loai_viec when 'bo_tro_bu' then 'bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end", "and b.loai = any (case cv.loai_viec when 'bo_tro_bu' then array['bu'] when 'bo_tro_yeu' then array['bo_tro_yeu', 'bo_tro_hinh'] else array['bo_tro_duoi'] end)", 'dc')
out += d + ';\n'

fs.writeFileSync(process.argv[2], out); console.log('ok', out.length)
await c.end()
