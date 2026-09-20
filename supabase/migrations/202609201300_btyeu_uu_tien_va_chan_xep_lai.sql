-- Thùy 20/09 — 2 story:
-- (1) "HS đã được xếp bổ trợ CŨ — CHƯA bổ trợ — mà có đợt bổ trợ mới thì phải hiện rõ trạng thái đó và KHÔNG được xếp lại."
--     Bất biến: 1 case bổ trợ yếu có TỐI ĐA 1 buổi "đã xếp, chưa học" (buoi_hoc mo + chưa danh_gia_xong). Chặn ở DB (trigger) để
--     mọi đường tạo buổi (form xếp · tự ghép · sau này) đều dính, không dựa vào UI. Đo 20/09: 27 case đang có buổi chờ học, 0 case
--     có >1 ⇒ áp bất biến không đụng dữ liệu hiện có. "Đợt mới" = dạng được GỘP thêm vào case SAU khi buổi đã xếp
--     (moHoacGopCaseBoTroYeu) ⇒ RPC trả `so_dang_moi_sau_xep` để màn Xếp lịch hiện rõ.
-- (2) MỨC ƯU TIÊN của case (khác level): cùng level vẫn cần trước/sau. 3 = Cao · 2 = Thường (mặc định) · 1 = Thấp.
-- MẤT GÌ: không. +1 cột, +1 trigger, +1 RPC.
alter table public.bo_tro_yeu add column if not exists uu_tien smallint not null default 2 check (uu_tien between 1 and 3);

create or replace function public._trg_btyeu_mot_buoi_cho_hoc() returns trigger
language plpgsql security definer set search_path = public as $$
declare v record;
begin
  if new.bo_tro_yeu_id is null then return new; end if;
  select b.ngay, b.gio_bat_dau into v
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
  where hh.bo_tro_yeu_id = new.bo_tro_yeu_id and hh.buoi_hoc_id <> new.buoi_hoc_id
    and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
  limit 1;
  if found then
    raise exception 'Em đã có buổi bổ trợ ĐÃ XẾP CHƯA HỌC (% %) — sửa hoặc huỷ buổi đó, không xếp buổi mới.',
      to_char(v.ngay, 'DD/MM'), coalesce(to_char(v.gio_bat_dau, 'HH24:MI'), '');
  end if;
  return new;
end $$;
drop trigger if exists trg_btyeu_mot_buoi_cho_hoc on public.buoi_hoc_hs;
create trigger trg_btyeu_mot_buoi_cho_hoc before insert on public.buoi_hoc_hs
  for each row execute function public._trg_btyeu_mot_buoi_cho_hoc();

-- Danh sách case cho màn Xếp bổ trợ yếu — 1 nguồn, tổng hợp ở DB (§2.0): trạng thái xếp, buổi chờ học, dạng mới sau xếp, level, ưu tiên.
create or replace function public.fn_btyeu_case_xep_lich(p_mon text default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id),
      'so_dang_chua_day', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.day_at is null and d.dong_at is null),
      'so_buoi_da_hoc', (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                          where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and (b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null)),
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else
          (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where y.trang_thai = 'dang_xu' and (p_mon is null or y.mon = p_mon)
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id)
  ) s
$$;
grant execute on function public.fn_btyeu_case_xep_lich(text) to authenticated;
