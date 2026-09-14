-- ============================================================================
-- 202609141200 — Điểm THI LẠI MT (Thùy 14/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: BK cho HS có điểm MT quá thấp thi lại. Điểm thi lại CHỈ hiển thị cho
--   PH biết (Report PH), KHÔNG tính xếp hạng, KHÔNG cộng vào Level/XU. Có bạn
--   thi lại có bạn không (đa số NULL — §1.5: NULL = "không áp dụng", KHÔNG phải
--   "chưa đo").
--
-- CÁCH: TÁI DÙNG bảng `diem_thi` — thêm 3 cột "_thi_lai" đối xứng với 3 cột gốc,
--   thêm cột dẫn xuất `diem_thi_lai` do TRIGGER tự tính (§2.0: công thức ở DB).
--   Trigger `tg_diem_thi_tinh` mở rộng — logic điểm thi lại Y HỆT điểm chính
--   (full→10 · Σ≥10→9.75 · round 2), nhưng KHÔNG đụng cột `diem` GỐC ⇒
--   3 hàm rank (`fn_rank_diem_mt`, `fn_rank_diem_mt_lop`, `fn_bxh_diem_mt_khoi`)
--   và `getLevelXu` đọc `diem_thi.diem`/`verdict` — TỰ ĐỘNG bỏ qua thi lại,
--   đúng ý "không tính xếp hạng, không nuôi Level".
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. Chỉ THÊM cột + mở rộng function trigger.
-- ============================================================================

alter table diem_thi
  add column if not exists diem_thi_lai numeric,
  add column if not exists diem_thi_lai_co_ban numeric,
  add column if not exists diem_thi_lai_nang_cao numeric,
  add column if not exists full_thi_lai boolean not null default false;

-- Mở rộng trigger: tính THÊM `diem_thi_lai` từ 3 cột "_thi_lai" (giữ nguyên
-- logic tính `diem` GỐC và `verdict` — chỉ thêm nhánh cho thi lại).
create or replace function public.fn_diem_thi_tinh() returns trigger
language plpgsql as $$
declare
  v_tong numeric;
  v_tl_tong numeric;
begin
  -- Điểm CHÍNH (giữ nguyên bản cũ mig 202608300221 §③)
  if new.full_diem or new.diem_co_ban is not null or new.diem_nang_cao is not null then
    if new.full_diem then
      new.diem := 10;
    else
      v_tong := coalesce(new.diem_co_ban, 0) + coalesce(new.diem_nang_cao, 0);
      new.diem := case when v_tong >= 10 then 9.75 else round(v_tong, 2) end;
    end if;
    new.verdict := case when new.diem >= 8 then 'dat' when new.diem >= 6.5 then 'gan_dat' else 'khong_dat' end;
  end if;

  -- Điểm THI LẠI (14/09): logic y hệt điểm chính, nhưng ghi vào cột riêng.
  -- KHÔNG động `verdict` (thi lại không đổi Level/XU).
  if new.full_thi_lai or new.diem_thi_lai_co_ban is not null or new.diem_thi_lai_nang_cao is not null then
    if new.full_thi_lai then
      new.diem_thi_lai := 10;
    else
      v_tl_tong := coalesce(new.diem_thi_lai_co_ban, 0) + coalesce(new.diem_thi_lai_nang_cao, 0);
      new.diem_thi_lai := case when v_tl_tong >= 10 then 9.75 else round(v_tl_tong, 2) end;
    end if;
  else
    -- Xoá thi lại (cả 3 cột đều rỗng + full_thi_lai=false) ⇒ điểm thi lại NULL
    -- (§1.5: không có dữ kiện = không có dòng — ở đây là không có SỐ, để trống).
    new.diem_thi_lai := null;
  end if;

  return new;
end $$;
