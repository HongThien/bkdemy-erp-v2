-- Thùy 09-09: "Ca bổ trợ đã hiện ở app TA nhưng chưa hiện ở app HS" — app HS chỉ có `fn_btyeu_ca_cua_toi`
-- (ca YẾU hôm nay ĐÃ điểm danh có mặt, để vào luyện), không có LỊCH. Box "Bổ trợ" màn chính HS cần lịch
-- đã xếp/sắp tới của CẢ 3 loại (yếu / bù / đuổi) — "trigger cái nào thì cái đấy hiện". Read-only, derive
-- thuần từ buoi_hoc × buoi_hoc_hs (CLAUDE.md §2.0: tổng hợp ở Postgres, client chỉ render).
create or replace function public.fn_hs_lich_bo_tro() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'loai', b.loai, 'ngay', b.ngay,
    'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
    'mon', case b.loai when 'bo_tro_yeu' then y.mon else l.mon end,
    'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
    'diem_danh', hh.diem_danh,
    'hom_nay', b.ngay = public._btyeu_today(),
    'vao_ca', coalesce(b.loai = 'bo_tro_yeu' and b.ngay = public._btyeu_today()
                       and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null, false)
  ) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
  from buoi_hoc_hs hh
  join buoi_hoc b on b.id = hh.buoi_hoc_id
  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id
  left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
  left join lop l on l.id = coalesce(bg.lop_id, d.lop_id)
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  left join nhan_su ns2 on ns2.id = b.nguoi_day
  where hh.hoc_sinh_id = public.my_hoc_sinh_id()
    and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')
    and b.trang_thai = 'mo'
    and b.ngay >= public._btyeu_today()
$$;
grant execute on function public.fn_hs_lich_bo_tro() to authenticated;
