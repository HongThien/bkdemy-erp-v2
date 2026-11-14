-- Thu quyền các hàm nội bộ của luật bù-nhóm (mig 202611140851) cho đúng hàng rào kiến trúc (K1 hàm `_` không mở cho client · K14 secdef phải có cổng).
-- Chúng chỉ được gọi từ BÊN TRONG hàm security definer đã có cổng (fn_ca_bo_tro_xep · fn_ca_bo_tro_ung_vien) hoặc từ trigger — không cần EXECUTE cho người đăng nhập.
-- Hai hàm đọc _ca_bo_tro_n_bu / _ca_bo_tro_dv_them_bu chuyển sang quyền người gọi (không còn secdef): khi chạy trong hàm secdef cha thì vẫn chạy bằng quyền chủ hàm cha.
create or replace function public._ca_bo_tro_n_bu(p_ca uuid, p_bai uuid, p_tru_hs uuid default null) returns integer language sql stable set search_path to 'public' as $f$
  select count(distinct hh.hoc_sinh_id)::int
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
   where b.ca_bo_tro_id = p_ca and b.loai = 'bu' and b.trang_thai <> 'huy' and hh.bu_cho_buoi_id = p_bai and hh.don_vi is not null
     and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep') and (p_tru_hs is null or hh.hoc_sinh_id <> p_tru_hs)
$f$;
create or replace function public._ca_bo_tro_dv_them_bu(p_ca uuid, p_bai uuid, p_hs uuid) returns integer language sql stable set search_path to 'public' as $f$
  select public._ca_bo_tro_dv_bu_nhom(n + 1) - public._ca_bo_tro_dv_bu_nhom(n) from (select public._ca_bo_tro_n_bu(p_ca, p_bai, p_hs) as n) x
$f$;
revoke all on function public._ca_bo_tro_dv_bu_moi_em(bigint), public._ca_bo_tro_dv_bu_nhom(bigint), public._ca_bo_tro_n_bu(uuid, uuid, uuid), public._ca_bo_tro_dv_them_bu(uuid, uuid, uuid),
  public._ca_bo_tro_cap_nhat_dv_bu(uuid), public._trg_hh_dv_bu(), public._trg_buoi_dv_bu() from public, anon, authenticated;
