-- ============================================================================
-- 202609161648 — HÌNH HỌC · Bài → tương thích schema dai_cau_hoi để PLUG THẲNG
--   DangHub / CauModal / AiImportModal / CumBaiTab / LyThuyetModal của Đại.
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 16/09 chiều): "bê nguyên module nhập của bên đại số hoặc hình học,
--   m tự tạo ra module mới làm đéo gì vậy" — thay vì viết modal riêng cho Hình học Bài
--   (đã bị bỏ), TÁI DÙNG y hệt component Đại (đã có paste clipboard, upload PDF, AI OCR
--   đầy đủ). Component Đại nhận `cauTbl` param nên chỉ cần bảng câu Hình học tuân đúng
--   SHAPE của `dai_cau_hoi` là plug thẳng.
--
-- ⭐ SAFETY (CEO xác nhận 16/09): bảng `hinh_hoc_*` mới tạo lúc chiều, CHƯA CÓ CÂU/CỤM
--   nào. Rename cột không mất data. Xác nhận qua CEO trước khi chạy.
--
-- ĐỔI TÊN 2 CỘT (khớp Đại):
--   hinh_hoc_cau_hoi.ma_bai → dang_chinh   (chỗ DangHub query .eq('dang_chinh', maDang))
--   hinh_hoc_cum_bai.ma_bai → ma_dang       (chỗ CumBaiTab query .eq('ma_dang', maDang))
-- KHÔNG đổi `hinh_hoc_bai` — nó vẫn là bảng "gốc" (leaf), giữ PK `ma_bai`. Component Đại
--   nhìn `dang_chinh` như "khoá lá", không cần biết bảng gốc tên gì.
--
-- THÊM 7 CỘT compat (mọi cột có default hợp lý — bỏ trống thì Hình học vẫn chạy như cũ):
--   loai_cau text default 'tu_luan'   -- Hình chủ yếu tự luận; UI select vẫn cho đổi
--   lua_chon jsonb                    -- chỉ trắc nghiệm dùng (Hình gần như không)
--   menh_de  jsonb                    -- chỉ đúng-sai dùng (Hình gần như không)
--   nguon text default 'le'           -- 'le' | 'clone' (biến thể AI)
--   nguon_giai text default 'nguoi'   -- 'nguoi' | 'ai' (AI giải cần duyệt)
--   parent_ma_cau text                -- self-FK cho clone biến thể AI
--   clone_method text                 -- 'gemini-2.5-flash' etc.
--
-- SỬA RPC `count_cau_by_bai_hh` — đổi cột đếm từ `ma_bai` → `dang_chinh` (đã rename).
--
-- KHÔNG XOÁ GÌ. Không đụng bảng `hinh_hoc_bai` / `hinh_hoc_bai_ly_thuyet` (đã ổn).
-- ============================================================================

-- ── 1. RENAME 2 cột ──────────────────────────────────────────────────────────
alter table hinh_hoc_cau_hoi rename column ma_bai to dang_chinh;
alter table hinh_hoc_cum_bai rename column ma_bai to ma_dang;

-- Rename index cũ theo cột đã đổi tên
alter index if exists hinh_hoc_cau_hoi_bai_idx rename to hinh_hoc_cau_hoi_dang_idx;
alter index if exists hinh_hoc_cum_bai_bai_idx rename to hinh_hoc_cum_bai_dang_idx;

-- ── 2. THÊM 7 CỘT compat với dai_cau_hoi ────────────────────────────────────
alter table hinh_hoc_cau_hoi
  add column if not exists loai_cau    text not null default 'tu_luan',
  add column if not exists lua_chon    jsonb,
  add column if not exists menh_de     jsonb,
  add column if not exists nguon       text not null default 'le',
  add column if not exists nguon_giai  text not null default 'nguoi',
  add column if not exists parent_ma_cau text references hinh_hoc_cau_hoi(ma_cau) on delete set null,
  add column if not exists clone_method text;

create index if not exists hinh_hoc_cau_hoi_parent_idx on hinh_hoc_cau_hoi (parent_ma_cau) where parent_ma_cau is not null;

-- ── 3. SỬA RPC count theo tên cột mới ───────────────────────────────────────
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
    from (select dang_chinh, count(*) n from hinh_hoc_cau_hoi
           where xoa_at is null and khoi = p_khoi
           group by dang_chinh) t;
  return result;
end $$;
