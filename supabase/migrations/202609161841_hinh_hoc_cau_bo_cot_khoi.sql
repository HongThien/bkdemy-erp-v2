-- ============================================================================
-- 202609161841 — HÌNH HỌC · Bài: BỎ CỘT `khoi` khỏi hinh_hoc_cau_hoi (fix NOT-NULL)
-- ----------------------------------------------------------------------------
-- LỖI ĐANG XẢY RA (CEO 16/09 tối): nhập kho báo
--   `null value in column "khoi" of relation "hinh_hoc_cau_hoi" violates not-null constraint`.
-- NGUYÊN NHÂN: module Đại (AiImportModal/CauModal) đang được TÁI DÙNG cho bảng
--   hinh_hoc_cau_hoi (đã thiết kế compat) — nó KHÔNG biết cột `khoi` (Đại không có,
--   khối suy từ `dang_chinh` → `dai_ban_do.khoi`). Insert không kèm `khoi` ⇒ NOT NULL nổ.
--
-- FIX: BỎ cột `khoi` — semantically nó thuộc `hinh_hoc_bai`, câu là con (§1.5 chống denormalize).
--   Chỗ duy nhất đang đọc cột này là RPC count — sửa RPC dùng JOIN.
--
-- MẤT GÌ: cột `khoi` trên `hinh_hoc_cau_hoi` (chưa có code TS/TSX nào tham chiếu — đã grep).
--   Chưa có câu nào trong bảng (CEO đang test nhập lần đầu) ⇒ không mất data.
-- ============================================================================

alter table hinh_hoc_cau_hoi drop column if exists khoi;

-- RPC count — join sang hinh_hoc_bai lấy khối (thay vì lọc trực tiếp cột đã bỏ).
create or replace function public.count_cau_by_bai_hh(p_khoi text)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  select coalesce(jsonb_object_agg(dang_chinh, n), '{}'::jsonb)
    into result
    from (
      select c.dang_chinh, count(*) n
        from hinh_hoc_cau_hoi c
        join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
       where c.xoa_at is null and b.khoi = p_khoi
       group by c.dang_chinh
    ) t;
  return result;
end $$;
