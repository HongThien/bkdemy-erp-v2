-- Thùy 24/09 tối — màn "Trạng thái ca bổ trợ" làm lại: card 1 dòng (tên trái · thanh MỨC phải), filter toggle theo mức có số tổng, bấm card ⇒ popup chi tiết.
-- Trước: client tự ghép (layTienDoCa, vi phạm §2.0) theo 4 bước cũ, không khớp vòng 4 trạng thái. Giờ MỨC tính ở DB, 1 nguồn:
--   cho_noi_dung (case mở, chưa chọn dạng) → can_xep (còn dạng cần dạy, chưa có buổi chờ) → da_xep (có buổi chờ học) → cho_retest
--   → cho_danh_gia (mọi dạng đã đóng, case chưa đánh giá/đóng) → hoan_thanh (case đã đóng, 60 ngày gần nhất).

create or replace function public.fn_btyeu_trang_thai_ca(p_so_ngay_ht integer default 60) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(s.x order by s.thu, s.uu desc, s.tao), '[]'::jsonb) end
  from (
    select array_position(array['cho_noi_dung','can_xep','da_xep','cho_retest','cho_danh_gia','hoan_thanh'], m.buoc) as thu, y.uu_tien as uu, y.created_at as tao,
      jsonb_build_object(
        'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
        'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
        'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
        'uu_tien', y.uu_tien, 'created_at', y.created_at, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
        'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong,
        'buoi_cho_ngay', ch.ngay, 'buoi_cho_gio', ch.gio_bat_dau, 'buoi_cho_nguoi', ch.nguoi,
        'retest_ngay', (select min(t.ngay) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                          and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                          and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
        'buoc', m.buoc) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    cross join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc
    left join lateral (
      select b.ngay, b.gio_bat_dau, ns.ho_ten as nguoi from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    cross join lateral (select case
        when y.trang_thai = 'hoan_thanh' then 'hoan_thanh'
        when dc.tong = 0 then 'cho_noi_dung'
        when dc.can_day > 0 and ch.ngay is null then 'can_xep'
        when dc.can_day > 0 then 'da_xep'
        when dc.cho_retest > 0 then 'cho_retest'
        else 'cho_danh_gia' end as buoc) m
    where y.trang_thai = 'dang_xu' or y.hoan_thanh_at >= now() - make_interval(days => greatest(1, coalesce(p_so_ngay_ht, 60)))
  ) s
$$;
grant execute on function public.fn_btyeu_trang_thai_ca(integer) to authenticated;

-- Chi tiết 1 case cho popup: đầu case · từng dạng (tên theo bản đồ môn, nguồn, điểm lúc mở, dạy, retest, đóng) · mọi buổi · bài retest · lịch sử duyệt level.
create or replace function public.fn_btyeu_chi_tiet_case(p_case uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then null else jsonb_build_object(
    'case', jsonb_build_object('id', y.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon, 'nguon', y.nguon, 'ly_do', y.ly_do,
              'trang_thai', y.trang_thai, 'uu_tien', y.uu_tien, 'created_at', y.created_at, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua, 'ghi_chu_dong', y.ghi_chu_dong,
              'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
              'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
              'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                           select count(*) from ch where id is not null),
              'mo_boi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = y.actor)),
    'dang', (select coalesce(jsonb_agg(jsonb_build_object(
               'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(y.mon, d.ma_dang), d.ma_dang), 'nguon', d.nguon, 'them_at', d.created_at,
               'diem_luc_mo', d.diem_luc_mo, 'so_lan_do_luc_mo', d.so_lan_do_luc_mo, 'day_at', d.day_at, 'retest_diem', d.retest_diem, 'retest_at', d.retest_at,
               'dat', d.dat, 'dong_at', d.dong_at,
               'tt', case when d.dong_at is not null then 'xong' when d.day_at is null then 'chua_day' when d.dat = false then 'day_lai' else 'cho_retest' end
             ) order by d.dong_at nulls first, d.day_at nulls first, d.created_at), '[]'::jsonb) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id),
    'buoi', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'nguoi', ns.ho_ten,
               'trang_thai', b.trang_thai, 'ly_do_huy', b.ly_do_huy, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at, 'che_do', hh.btyeu_che_do,
               'ca_truc', b.ca_bo_tro_id is not null
             ) order by b.ngay desc, b.gio_bat_dau desc nulls last), '[]'::jsonb)
             from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
             where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'),
    'retest', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', t.ngay, 'so_cau', t.so_cau,
               'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'),
               'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = t.id and blc.verdict = 'correct')
             ) order by t.ngay desc), '[]'::jsonb)
             from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon
               and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
    'duyet', (select coalesce(jsonb_agg(jsonb_build_object(
               'at', g.created_at, 'level_cu', g.level_cu, 'level_may', g.level_may_de_xuat, 'level_chot', g.level_chot,
               'ly_do_may', g.ly_do_may -> 'lyDo', 'kenh', g.ly_do_may -> 'kenh', 'ly_do_nguoi', g.ly_do_nguoi,
               'nguoi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = g.actor)
             ) order by g.created_at desc), '[]'::jsonb)
             from hs_level_log g where g.hoc_sinh_id = y.hoc_sinh_id and g.mon = y.mon and g.loai = 'kien_thuc'
               and g.created_at >= y.created_at - interval '1 day' and (y.hoan_thanh_at is null or g.created_at <= y.hoan_thanh_at + interval '1 day'))
  ) end
  from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
  where y.id = p_case
$$;
grant execute on function public.fn_btyeu_chi_tiet_case(uuid) to authenticated;
