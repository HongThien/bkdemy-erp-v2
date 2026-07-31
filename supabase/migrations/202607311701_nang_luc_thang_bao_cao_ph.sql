-- ============================================================================
-- 202607311701 — nang_luc_thang_bao_cao_ph
-- ----------------------------------------------------------------------------
-- VÌ SAO: Report tháng cần GV nhập "band năng lực" + điểm năng lực + sai số
--   + 7 chỉ số phát triển (mức 1..5) cho mỗi (HS × môn × tháng). App phụ huynh
--   hiện band + 7 chỉ số (tô màu theo mức) + xu hướng so tháng trước.
--   Xu hướng = SUY ĐỘNG lúc đọc (không lưu). Tất cả cột nullable: thiếu = chưa
--   nhập, KHÔNG đẻ ô rác (§1.5). Mở rộng thẳng bao_cao_ph vì PK (hoc_sinh_id,
--   mon, thang) đã đúng "mỗi tháng" và có nhãn mon (§1.6).
--
-- MẤT GÌ: không xoá/thu hẹp gì — chỉ ADD COLUMN nullable + ADD CHECK mới.
-- ============================================================================

alter table public.bao_cao_ph
  add column if not exists nl_band      text,     -- band năng lực GV chọn: S-/S/S+ .. D-/D/D+
  add column if not exists nl_diem      numeric,  -- điểm năng lực trung bình (thang 10), GV nhập
  add column if not exists nl_sai_so    numeric,  -- sai số (±), GV nhập
  add column if not exists cs_thai_do   smallint, -- 1) Thái độ học tập
  add column if not exists cs_tap_trung smallint, -- 2) Khả năng tập trung
  add column if not exists cs_tiep_thu  smallint, -- 3) Khả năng tiếp thu
  add column if not exists cs_tu_duy    smallint, -- 4) Tư duy học tập
  add column if not exists cs_ky_nang   smallint, -- 5) Kỹ năng làm bài
  add column if not exists cs_van_dung  smallint, -- 6) Khả năng vận dụng
  add column if not exists cs_vuot_kho  smallint; -- 7) Khả năng vượt khó

-- CHECK band thuộc tập cố định (§2.1 — cột text phải có CHECK).
alter table public.bao_cao_ph drop constraint if exists bao_cao_ph_nl_band_chk;
alter table public.bao_cao_ph add constraint bao_cao_ph_nl_band_chk
  check (nl_band is null or nl_band in (
    'S-','S','S+','A-','A','A+','B-','B','B+','C-','C','C+','D-','D','D+'));

-- CHECK điểm 0..10, sai số 0..5.
alter table public.bao_cao_ph drop constraint if exists bao_cao_ph_nl_diem_chk;
alter table public.bao_cao_ph add constraint bao_cao_ph_nl_diem_chk
  check (nl_diem is null or (nl_diem >= 0 and nl_diem <= 10));
alter table public.bao_cao_ph drop constraint if exists bao_cao_ph_nl_sai_so_chk;
alter table public.bao_cao_ph add constraint bao_cao_ph_nl_sai_so_chk
  check (nl_sai_so is null or (nl_sai_so >= 0 and nl_sai_so <= 5));

-- CHECK 7 chỉ số mức 1..5.
do $$
declare c text;
begin
  foreach c in array array['cs_thai_do','cs_tap_trung','cs_tiep_thu','cs_tu_duy','cs_ky_nang','cs_van_dung','cs_vuot_kho']
  loop
    execute format('alter table public.bao_cao_ph drop constraint if exists %I', 'bao_cao_ph_'||c||'_chk');
    execute format('alter table public.bao_cao_ph add constraint %I check (%I is null or (%I between 1 and 5))', 'bao_cao_ph_'||c||'_chk', c, c);
  end loop;
end $$;
