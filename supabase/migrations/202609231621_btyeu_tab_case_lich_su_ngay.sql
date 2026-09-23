-- Thùy 23/09 — màn Xếp bổ trợ yếu giống Bù: tab CẦN XẾP · ĐÃ XẾP · CHỜ RETEST · HOÀN THÀNH (đơn vị = CASE; hoàn thành lưu hết).
-- (1) Ca đã xếp mà KHÔNG DIỄN RA (qua ngày không điểm danh có mặt, hoặc bị huỷ) ⇒ tự huỷ, case về Cần xếp, tag "không diễn ra · N lần".
-- (2) Case còn dạng chưa xong ⇒ về Cần xếp kèm thông tin (đã có: x/y dạng cần dạy, đã học k buổi).
-- (3) Duyệt bổ trợ: LỊCH SỬ BỔ TRỢ 2 tuần (mọi hoạt động: buổi yếu/bù/đuổi · test · retest · duyệt · báo động · case mở/đóng) — popup.
-- (4) Tab Đang diễn ra: MỌI bổ trợ liên quan ngày đó — yếu (có sẵn) + bù + đuổi + retest, toggle lọc.
-- MẤT GÌ: không xoá dữ liệu. Tự huỷ = đổi trang_thai buổi 'mo'→'huy' (giữ dấu, ly_do_huy ghi rõ tự động). +3 function, thay 1.

-- (1) Dọn ca không diễn ra — gọi khi mở màn Xếp (idempotent). Trả về danh sách vừa huỷ.
create or replace function public.fn_btyeu_don_ca_khong_dien_ra() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then return '[]'::jsonb; end if;
  with cu as (
    select b.id, b.ngay, hh.hoc_sinh_id
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      and b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date and hh.diem_danh is distinct from 'co_mat'
  ),
  up as (
    update buoi_hoc b set trang_thai = 'huy', ly_do_huy = coalesce(b.ly_do_huy, 'Không diễn ra — qua ngày không điểm danh (tự động ' || to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI') || ')'), updated_at = now()
    from cu where b.id = cu.id returning b.id, b.ngay
  )
  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', id, 'ngay', ngay)), '[]'::jsonb) into v from up;
  return v;
end $$;
grant execute on function public.fn_btyeu_don_ca_khong_dien_ra() to authenticated;

-- List case đủ 4 tab: thêm case hoàn thành + số buổi không diễn ra (= buổi huỷ) + ngày gần nhất.
create or replace function public.fn_btyeu_case_xep_lich(p_mon text default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_ht desc nulls first, x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, y.hoan_thanh_at as x_ht, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien, 'trang_thai', y.trang_thai,
      'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                   select count(*) from ch where id is not null),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may, 'so_dang_bao_dong', dc.bao_dong,
      'so_dang_chua_day', dc.can_day,
      'giai_doan', case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh' when dc.can_day > 0 then 'dang_bo_tro' when dc.cho_retest > 0 then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', bh.da_hoc, 'so_buoi_khong_dien_ra', bh.khong_dien_ra, 'khong_dien_ra_gan_nhat', bh.khong_dien_ra_gan_nhat,
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may,
             count(*) filter (where d.nguon = 'bao_dong' and d.day_at is null) as bao_dong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    join lateral (
      select count(*) filter (where b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null) as da_hoc,
             count(*) filter (where b.trang_thai = 'huy') as khong_dien_ra,
             max(b.ngay) filter (where b.trang_thai = 'huy') as khong_dien_ra_gan_nhat
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'
    ) bh on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where (p_mon is null or y.mon = p_mon) and (y.trang_thai = 'hoan_thanh' or dc.tong > 0)
  ) s
$$;

-- (3) LỊCH SỬ BỔ TRỢ của 1 HS (1 môn) trong N ngày: mọi hoạt động, 1 mảng sự kiện sắp theo thời gian giảm dần.
create or replace function public.fn_btyeu_lich_su_hs(p_hoc_sinh uuid, p_mon text, p_so_ngay integer default 14) returns jsonb
language sql stable security definer set search_path = public as $$
  with tu as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date - greatest(1, coalesce(p_so_ngay, 14)) as d),
  bd as (select public._kho_ban_do_tbl(p_mon) as t),
  ev as (
    -- buổi bổ trợ (yếu / bù / đuổi)
    select b.ngay::timestamptz + coalesce(b.gio_bat_dau, '00:00'::time) as t, 'buoi' as loai, jsonb_build_object(
      'loai_buoi', b.loai, 'buoi_id', b.id, 'ngay', b.ngay, 'gio', b.gio_bat_dau, 'phong', b.phong, 'trang_thai', b.trang_thai, 'ly_do_huy', b.ly_do_huy,
      'diem_danh', hh.diem_danh, 'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
      'dang_day', (select coalesce(jsonb_agg(d.ma_dang), '[]'::jsonb) from bo_tro_yeu_dang d where d.day_buoi_id = b.id),
      'luyen', (select jsonb_build_object('so_cau', sum(so_cau), 'so_dung', sum(so_dung)) from public._btyeu_tien_do(b.id)),
      'test', (select jsonb_build_object('so_cau', count(*), 'so_dung', count(*) filter (where blc.verdict = 'correct'), 'da_nop', bool_or(bl.trang_thai = 'da_nop'))
               from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id join bai_lam_cau blc on blc.bai_lam_id = bl.id
               where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'),
      'nhan_xet', (select dg.nhan_xet from buoi_danh_gia dg where dg.buoi_hoc_id = b.id and dg.hoc_sinh_id = p_hoc_sinh limit 1),
      'che_do', hh.btyeu_che_do
    ) as d
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, tu
    where hh.hoc_sinh_id = p_hoc_sinh and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi') and b.ngay >= tu.d
      and (b.loai <> 'bo_tro_yeu' or exists (select 1 from bo_tro_yeu y where y.id = hh.bo_tro_yeu_id and y.mon = p_mon))
    union all
    -- retest tầng 2 (bài) + kết quả từng dạng
    select bt.ngay::timestamptz + interval '23 hours', 'retest', jsonb_build_object(
      'bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau, 'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'),
      'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = bt.id and blc.verdict = 'correct'),
      'dang', (select coalesce(jsonb_agg(distinct jsonb_build_object('ma_dang', k.ma_dang, 'dat', d.dat, 'diem', d.retest_diem)), '[]'::jsonb)
               from bai_test_cau k left join buoi_hoc_hs hh on hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id is not null
               left join bo_tro_yeu_dang d on d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.ma_dang = k.ma_dang where k.bai_test_id = bt.id)
    ) from bai_test bt, tu where bt.hoc_sinh_id = p_hoc_sinh and bt.mon = p_mon and bt.loai = 'retest' and bt.ngay >= tu.d
    union all
    -- lượt duyệt level
    select l.created_at, 'duyet', jsonb_build_object('loai', l.loai, 'level_cu', l.level_cu, 'level_chot', l.level_chot, 'level_may', l.level_may_de_xuat, 'ly_do', l.ly_do_nguoi, 'actor', l.actor)
    from hs_level_log l, tu where l.hoc_sinh_id = p_hoc_sinh and l.mon = p_mon and l.created_at >= tu.d
    union all
    -- báo động
    select k.created_at, 'bao_dong', jsonb_build_object('ma_dang', k.ma_dang, 'nguon', k.nguon, 'ghi_chu', k.ghi_chu)
    from canh_bao_yeu k, tu where k.hoc_sinh_id = p_hoc_sinh and k.created_at >= tu.d
      and public._btyeu_mon_cua_bao_dong(k.hoc_sinh_id, k.buoi_hoc_id) is not distinct from p_mon
    union all
    -- case mở / đóng
    select y.created_at, 'case_mo', jsonb_build_object('case_id', y.id, 'nguon', y.nguon, 'uu_tien', y.uu_tien, 'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id))
    from bo_tro_yeu y, tu where y.hoc_sinh_id = p_hoc_sinh and y.mon = p_mon and y.created_at >= tu.d
    union all
    select y.hoan_thanh_at, 'case_dong', jsonb_build_object('case_id', y.id, 'ket_qua', y.ket_qua, 'ghi_chu', y.ghi_chu_dong)
    from bo_tro_yeu y, tu where y.hoc_sinh_id = p_hoc_sinh and y.mon = p_mon and y.hoan_thanh_at >= tu.d
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce((
    select jsonb_agg(jsonb_build_object('t', ev.t, 'loai', ev.loai, 'd', ev.d) order by ev.t desc) from ev), '[]'::jsonb) end
$$;
grant execute on function public.fn_btyeu_lich_su_hs(uuid, text, integer) to authenticated;

-- (4) Bổ trợ trong ngày ngoài yếu: bù · đuổi · retest đến hạn. Yếu vẫn qua fn_btyeu_ca_theo_doi.
create or replace function public.fn_bo_tro_trong_ngay(p_ngay date default null) returns jsonb
language sql stable security definer set search_path = public as $$
  with d as (select coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as ngay)
  select case when not public.la_thanh_vien() then '{}'::jsonb else jsonb_build_object(
    'bu', coalesce((select jsonb_agg(jsonb_build_object('buoi_id', b.id, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
              'nguoi', coalesce(ns.ho_ten, ns2.ho_ten), 'so_hs', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id),
              'hs', (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'lop_goc', l.ten_lop) order by hs.ho_ten), '[]'::jsonb)
                     from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id left join buoi_hoc g on g.id = hh.bu_cho_buoi_id left join lop l on l.id = g.lop_id where hh.buoi_hoc_id = b.id)
            ) order by b.gio_bat_dau nulls last)
            from buoi_hoc b left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, d
            where b.loai = 'bu' and b.ngay = d.ngay and b.trang_thai <> 'huy'), '[]'::jsonb),
    'duoi', coalesce((select jsonb_agg(jsonb_build_object('buoi_id', b.id, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
              'nguoi', coalesce(ns.ho_ten, ns2.ho_ten), 'so_hs', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id),
              'hs', (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'lop', l.ten_lop) order by hs.ho_ten), '[]'::jsonb)
                     from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id left join bo_tro_duoi bd on bd.id = hh.bo_tro_duoi_id left join lop l on l.id = bd.lop_id where hh.buoi_hoc_id = b.id)
            ) order by b.gio_bat_dau nulls last)
            from buoi_hoc b left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, d
            where b.loai = 'bo_tro_duoi' and b.ngay = d.ngay and b.trang_thai <> 'huy'), '[]'::jsonb),
    'retest', coalesce((select jsonb_agg(jsonb_build_object('bai_test_id', bt.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', bt.mon, 'lop', l.ten_lop, 'so_cau', bt.so_cau,
              'ta_lop', (select ns.ho_ten from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id where pc.lop_id = bt.lop_id and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last limit 1),
              'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'),
              'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = bt.id and blc.verdict = 'correct'),
              'qua_han', bt.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date
            ) order by l.ten_lop, hs.ho_ten)
            from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id left join lop l on l.id = bt.lop_id, d
            where bt.loai = 'retest' and bt.ngay = d.ngay and bt.trang_thai = 'mo'), '[]'::jsonb)
  ) end
$$;
grant execute on function public.fn_bo_tro_trong_ngay(date) to authenticated;
