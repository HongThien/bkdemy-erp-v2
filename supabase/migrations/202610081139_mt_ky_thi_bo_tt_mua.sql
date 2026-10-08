-- ============================================================================
-- mt_ky_thi_bo_tt_mua
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 08/10: "sao không load được dữ liệu của 9S"): _mt_ky_thi (mig 202610081051) gọi _tt_mua() để lấy
-- mùa khi TẠO kỳ thi MT cho buổi chưa có kỳ — mà _tt_mua chỉ cấp EXECUTE cho claude_build ⇒ người dùng app gặp
-- "permission denied for function _tt_mua" ⇒ màn Chấm MT không tải được đề. Dính mọi buổi MT chưa từng có kỳ
-- (17 buổi lúc vá: 9S1, 9C1, 12B1, 11B1, 8S1, 8B1, 8B2, 7S2, 7B2, 8S0, 4A1…). 9A1 có kỳ sẵn nên lúc kiểm không lộ.
-- Sửa: đọc mùa thẳng từ gami_mua (authenticated đọc được qua RLS gami_mua_member_all) — cùng câu lệnh _tt_mua,
-- KHÔNG nới quyền _tt_mua.
-- MẤT GÌ: không.
-- ============================================================================
create or replace function _mt_ky_thi(p_buoi uuid) returns uuid
language plpgsql as $$
declare v_id uuid; v_mua text;
begin
  select id into v_id from ky_thi where buoi_hoc_id = p_buoi and loai = 'mt_sat_hach' order by created_at limit 1;
  if v_id is not null then return v_id; end if;
  select m.mua into v_mua from gami_mua m
   where to_char((now() at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM') between m.thang_dau and m.thang_cuoi
   limit 1;
  insert into ky_thi (ten, loai, he_so, mon, khoi, mua, buoi_hoc_id)
  select trim('MT ' || coalesce(l.ten_lop, '') || ' ' || b.ngay::text), 'mt_sat_hach', 2, l.mon, l.khoi, v_mua, b.id
    from buoi_hoc b left join lop l on l.id = b.lop_id where b.id = p_buoi
  on conflict (buoi_hoc_id) where loai = 'mt_sat_hach' and buoi_hoc_id is not null do nothing;
  select id into v_id from ky_thi where buoi_hoc_id = p_buoi and loai = 'mt_sat_hach' order by created_at limit 1;
  return v_id;
end $$;
